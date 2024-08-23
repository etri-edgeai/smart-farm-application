import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_pytorch/flutter_pytorch.dart';
import 'package:image/image.dart' as image_lib;
import 'package:path_provider/path_provider.dart';
import 'package:flutter_pytorch/pigeon.dart';

class CameraViewSingleton {
  static double ratio = 0;
  static Size screenSize = const Size(0, 0);
  static Size inputImageSize = const Size(0, 0);
  static Size get actualPreviewSize =>
      Size(screenSize.width, screenSize.width * ratio);
  static Size get actualPreviewSizeH {
    return Size(screenSize.width, screenSize.width * (1 / ratio));
  }
}

class ImageUtils {
  static Uint8List imageToByteListUint8(image_lib.Image image) {
    var width = image.width;
    var height = image.height;
    var convertedBytes = Uint8List(width * height * 3);
    var buffer = Uint8List.view(convertedBytes.buffer);
    int pixelIndex = 0;
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        var pixel = image.getPixel(i, j);
        buffer[pixelIndex++] = image_lib.getRed(pixel);
        buffer[pixelIndex++] = image_lib.getGreen(pixel);
        buffer[pixelIndex++] = image_lib.getBlue(pixel);
      }
    }
    return convertedBytes.buffer.asUint8List();
  }

  /// Converts a [CameraImage] in YUV420 format to [image_lib.Image] in RGB format
  static image_lib.Image? convertCameraImage(CameraImage cameraImage) {
    if (cameraImage.format.group == ImageFormatGroup.yuv420) {
      return convertYUV420ToImage(cameraImage);
    } else if (cameraImage.format.group == ImageFormatGroup.bgra8888) {
      return convertBGRA8888ToImage(cameraImage);
    } else {
      return null;
    }
  }

  /// Converts a [CameraImage] in BGRA888 format to [image_lib.Image] in RGB format
  static image_lib.Image convertBGRA8888ToImage(CameraImage cameraImage) {
    image_lib.Image img = image_lib.Image.fromBytes(
        cameraImage.planes[0].width!,
        cameraImage.planes[0].height!,
        cameraImage.planes[0].bytes,
        format: image_lib.Format.bgra);
    return img;
  }

  /// Converts a [CameraImage] in YUV420 format to [image_lib.Image] in RGB format
  static image_lib.Image convertYUV420ToImage(CameraImage cameraImage) {
    final int width = cameraImage.width;
    final int height = cameraImage.height;

    final int uvRowStride = cameraImage.planes[1].bytesPerRow;
    final int? uvPixelStride = cameraImage.planes[1].bytesPerPixel;

    final image = image_lib.Image(width, height);

    for (int w = 0; w < width; w++) {
      for (int h = 0; h < height; h++) {
        final int uvIndex =
            uvPixelStride! * (w / 2).floor() + uvRowStride * (h / 2).floor();
        final int index = h * width + w;

        final y = cameraImage.planes[0].bytes[index];
        final u = cameraImage.planes[1].bytes[uvIndex];
        final v = cameraImage.planes[2].bytes[uvIndex];

        image.data[index] = ImageUtils.yuv2rgb(y, u, v);
      }
    }
    return image;
  }

  /// Convert a single YUV pixel to RGB
  static int yuv2rgb(int y, int u, int v) {
    // Convert yuv pixel to rgb
    int r = (y + v * 1436 / 1024 - 179).round();
    int g = (y - u * 46549 / 131072 + 44 - v * 93604 / 131072 + 91).round();
    int b = (y + u * 1814 / 1024 - 227).round();

    // Clipping RGB values to be inside boundaries [ 0 , 255 ]
    r = r.clamp(0, 255);
    g = g.clamp(0, 255);
    b = b.clamp(0, 255);

    return 0xff000000 |
        ((b << 16) & 0xff0000) |
        ((g << 8) & 0xff00) |
        (r & 0xff);
  }

  static void saveImage(image_lib.Image image, [int i = 0]) async {
    List<int> jpeg = image_lib.JpegEncoder().encodeImage(image);
    final appDir = await getTemporaryDirectory();
    final appPath = appDir.path;
    final fileOnDevice = File('$appPath/out$i.jpg');
    await fileOnDevice.writeAsBytes(jpeg, flush: true);
    if (kDebugMode) {
      print('Saved $appPath/out$i.jpg');
    }
  }
}

/// [CameraView] sends each frame for inference
class CameraView extends StatefulWidget {
  /// Callback to pass results after inference to [HomeView]
  final Function(List<ResultObjectDetection?> recognitions) resultsCallback;
  final Function(String classification) resultsCallbackClassification;

  /// Constructor
  const CameraView(this.resultsCallback, this.resultsCallbackClassification);
  @override
  _CameraViewState createState() => _CameraViewState();
}

class _CameraViewState extends State<CameraView> with WidgetsBindingObserver {
  /// List of available cameras
  late List<CameraDescription> cameras;

  /// Controller
  CameraController? cameraController;

  /// true when inference is ongoing
  late bool predicting;

  ModelObjectDetection? _objectModel;
  ClassificationModel? _imageModel;

  bool classification = false;
  @override
  void initState() {
    super.initState();
    initStateAsync();
  }

  //load your model
  Future loadModel() async {
    String pathImageModel = "assets/models/model_classification.pt";
    //String pathCustomModel = "assets/models/custom_model.ptl";
    String pathObjectDetectionModel = "assets/models/yolov5s.torchscript";
    try {
      _imageModel = await FlutterPytorch.loadClassificationModel(
          pathImageModel, 224, 224,
          labelPath: "assets/labels/label_classification_imageNet.txt");
      //_customModel = await PytorchLite.loadCustomModel(pathCustomModel);
      _objectModel = await FlutterPytorch.loadObjectDetectionModel(
          pathObjectDetectionModel, 80, 640, 640,
          labelPath: "assets/labels/labels_objectDetection_Coco.txt");
    } catch (e) {
      if (e is PlatformException) {
        print("only supported for android, Error is $e");
      } else {
        print("Error is $e");
      }
    }
  }

  void initStateAsync() async {
    WidgetsBinding.instance.addObserver(this);

    await loadModel();

    // Camera initialization
    initializeCamera();

    // Initially predicting = false
    predicting = false;
  }

  /// Initializes the camera by setting [cameraController]
  void initializeCamera() async {
    cameras = await availableCameras();

    // cameras[0] for rear-camera
    cameraController =
        CameraController(cameras[0], ResolutionPreset.high, enableAudio: false);

    cameraController?.initialize().then((_) async {
      // Stream of image passed to [onLatestImageAvailable] callback
      await cameraController?.startImageStream(onLatestImageAvailable);

      /// previewSize is size of each image frame captured by controller
      ///
      /// 352x288 on iOS, 240p (320x240) on Android with ResolutionPreset.low
      Size? previewSize = cameraController?.value.previewSize;

      /// previewSize is size of raw input image to the model
      CameraViewSingleton.inputImageSize = previewSize!;

      // the display width of image on screen is
      // same as screenWidth while maintaining the aspectRatio
      Size screenSize = MediaQuery.of(context).size;
      CameraViewSingleton.screenSize = screenSize;
      CameraViewSingleton.ratio = screenSize.width / previewSize.height;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Return empty container while the camera is not initialized
    if (cameraController == null || !cameraController!.value.isInitialized) {
      return Container();
    }

    return CameraPreview(cameraController!);
    //return cameraController!.buildPreview();

    // return AspectRatio(
    //     // aspectRatio: cameraController.value.aspectRatio,
    //     child: CameraPreview(cameraController));
  }

  /// Callback to receive each frame [CameraImage] perform inference on it
  onLatestImageAvailable(CameraImage cameraImage) async {
    // if (classifier.interpreter != null && classifier.labels != null) {

    // If previous inference has not completed then return
    if (predicting) {
      //print("here processing");
      return;
    }

    if (mounted) {
      setState(() {
        predicting = true;
      });
    }

    if (_objectModel != null) {
      List<ResultObjectDetection?> objDetect = await _objectModel!
          .getImagePredictionFromBytesList(
              cameraImage.planes.map((e) => e.bytes).toList(),
              cameraImage.width,
              cameraImage.height,
              minimumScore: 0.3,
              IOUThershold: 0.3);

      debugPrint("data outputted $objDetect");
      widget.resultsCallback(objDetect);
    }
    if (_imageModel != null) {
      String imageClassifaction =
          await _imageModel!.getImagePredictionFromBytesList(
        cameraImage.planes.map((e) => e.bytes).toList(),
        cameraImage.width,
        cameraImage.height,
      );

      debugPrint("imageClassifaction $imageClassifaction");
      widget.resultsCallbackClassification(imageClassifaction);
    }
    // set predicting to false to allow new frames
    if (mounted) {
      setState(() {
        predicting = false;
      });
    }
    // }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) async {
    switch (state) {
      case AppLifecycleState.paused:
        cameraController?.stopImageStream();
        break;
      case AppLifecycleState.resumed:
        if (!cameraController!.value.isStreamingImages) {
          await cameraController?.startImageStream(onLatestImageAvailable);
        }
        break;
      default:
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    cameraController?.dispose();
    super.dispose();
  }
}

class BoxWidget extends StatelessWidget {
  final ResultObjectDetection result;
  final Color? boxesColor;
  final bool showPercentage;

  BoxWidget(
      {Key? key,
      required this.result,
      this.boxesColor,
      this.showPercentage = true})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Color for bounding box
    //print(MediaQuery.of(context).size);
    Color? usedColor;
    //Size screenSize = CameraViewSingleton.inputImageSize;
    Size screenSize = CameraViewSingleton.actualPreviewSizeH;
    //Size screenSize = MediaQuery.of(context).size;

    //print(screenSize);
    double factorX = screenSize.width;
    double factorY = screenSize.height;
    if (boxesColor == null) {
      //change colors for each label
      usedColor = Colors.primaries[
          ((result.className ?? result.classIndex.toString()).length +
                  (result.className ?? result.classIndex.toString())
                      .codeUnitAt(0) +
                  result.classIndex) %
              Colors.primaries.length];
    } else {
      usedColor = boxesColor;
    }
    return Positioned(
      left: result.rect.left * factorX,
      top: result.rect.top * factorY - 20,
      //width: re.rect.width.toDouble(),
      //height: re.rect.height.toDouble(),

      //left: re?.rect.left.toDouble(),
      //top: re?.rect.top.toDouble(),
      //right: re.rect.right.toDouble(),
      //bottom: re.rect.bottom.toDouble(),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 20,
            alignment: Alignment.centerRight,
            color: usedColor,
            child: Text(
              (result.className ?? result.classIndex.toString()) +
                  "_" +
                  (showPercentage
                      ? (result.score * 100).toStringAsFixed(2) + "%"
                      : ""),
            ),
          ),
          Container(
            width: result.rect.width.toDouble() * factorX,
            height: result.rect.height.toDouble() * factorY,
            decoration: BoxDecoration(
                border: Border.all(color: usedColor!, width: 3),
                borderRadius: BorderRadius.all(Radius.circular(2))),
            child: Container(),
          ),
        ],
      ),
    );
  }
}
