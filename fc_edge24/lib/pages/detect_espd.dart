import 'dart:core';
import 'dart:developer';
import 'dart:io';
import 'package:flutter/services.dart';
import 'package:image/image.dart' as img;
import 'package:tflite_flutter/tflite_flutter.dart';
import 'package:flutter/material.dart';

class DetectEspd {
  static const String _mdlPath =
      'assets/models/v5_espd_efficientnet_b1_full.tflite';
  static const String _lblPath =
      'assets/models/v5_espd_efficientnet_b1_full_label.txt';

  Interpreter? _interpreter;
  List<String>? _labels;
  final int _tensorSize = 256;
  // final int _classsNum = 8;

  DetectEspd() {
    _loadModel();
    _loadLabels();
    log('DetectEspd Constructor Done.');
  }

  Future<void> _loadModel() async {
    log('Loading interpreter options...');
    final interpreterOptions = InterpreterOptions();

    // Use XNNPACK Delegate
    if (Platform.isAndroid) {
      interpreterOptions.addDelegate(XNNPackDelegate());
    }

    // Use Metal Delegate
    if (Platform.isIOS) {
      interpreterOptions.addDelegate(GpuDelegate());
    }

    log('Loading interpreter...');
    _interpreter =
        await Interpreter.fromAsset(_mdlPath, options: interpreterOptions);
  }

  Future<void> _loadLabels() async {
    log('Loading labels...');
    final labelsRaw = await rootBundle.loadString(_lblPath);
    _labels = labelsRaw.split('\n');
  }

  // <List<List<List<num>>>> prepareImage(String imagePath) {
  //   // Reading image bytes from file
  //   final int tensorSize = 256;
  //   final imageData = File(imagePath).readAsBytesSync();
  //   final image = img.decodeImage(imageData);

  //   // Resizing image fpr model, [300, 300]
  //   final croppedImage = img.copyResizeCropSquare(image!, size: tensorSize);
  //   final imageInput =
  //       img.copyResize(image!, width: tensorSize, height: tensorSize);

  //   // final input = [imageMatrix];

  //   // Convert image to Float32List
  //   final inputData = Float32List(1 * 3 * tensorSize * tensorSize);
  //   var inputIndex = 0;

  //   for (var y = 0; y < tensorSize; y++) {
  //     for (var x = 0; x < tensorSize; x++) {
  //       final pixel = croppedImage.getPixel(x, y);
  //       inputData[inputIndex++] = (pixel.r / 255.0 - 0.4742) / 0.2196;
  //       inputData[inputIndex++] = (pixel.g / 255.0 - 0.4680) / 0.2135;
  //       inputData[inputIndex++] = (pixel.b / 255.0 - 0.4666) / 0.2184;
  //     }
  //   }

  //   // Reshape input to match model's expected input shape
  //   final input = inputData.reshape([1, 3, tensorSize, tensorSize]);

  //   return input;
  // }

  List<List<List<num>>> prepareImageMatrix(img.Image imageInput) {
    // // Creating matrix representation, [300, 300, 3]
    // final imageMatrix = List.generate(
    //   imageInput.height,
    //   (y) => List.generate(
    //     imageInput.width,
    //     (x) {
    //       final pixel = imageInput.getPixel(x, y);
    //       return [pixel.r, pixel.g, pixel.b];
    //     },
    //   ),
    // );
    // Creating matrix representation, [3, 256, 256]
    final imageMatrix = List.generate(
      3,
      (c) => List.generate(
        imageInput.height,
        (y) => List.generate(
          imageInput.width,
          (x) {
            final pixel = imageInput.getPixel(x, y);
            return switch (c) {
              0 => (pixel.r / 255 - 0.4742) / 0.2196,
              1 => (pixel.g / 255 - 0.4680) / 0.2135,
              2 => (pixel.b / 255 - 0.4666) / 0.2184,
              int() => throw UnimplementedError(),
            };
          },
        ),
      ),
    );

    return imageMatrix;
  }

  Map<int, Object?> analyseImage(String imagePath) {
    log('Analysing image...');

    final Uint8List imageData = File(imagePath).readAsBytesSync();
    final image = img.decodeImage(imageData);
    final imageInput =
        img.copyResize(image!, width: _tensorSize, height: _tensorSize);

    // 경과 시간을 밀리초 단위로 반환

    final tensorInput = prepareImageMatrix(imageInput);

    Stopwatch stopwatch = Stopwatch()..start();
    final output = _runInference(tensorInput);
    stopwatch.stop();

    var t0 = output[0] as List;
    // var t1 = output[1] as List;
    var t2 = output[2] as List;
    var t3 = output[3] as List;
    // var t4 = output[4];

    var classIdx = (t0)[0];
    var className = _labels?[classIdx];
    num conf = 100 * t2[0];
    num inferTime = stopwatch.elapsed.inMilliseconds;

    log('Class: $className');
    log('Confdence: : ${conf.toStringAsFixed(2)}');
    log('Latency : : ${inferTime.toStringAsFixed(2)} ms');

    List<List<List<double>>> scores = List.from(t3[0]);
    img.Image imageMask = drawFloat(scores: scores);
    // imageMask = img.contrast(imageMask, contrast: 150);
    // var imageResult = img.sketch(
    //   imageInput,
    //   amount: 0.9,
    //   mask: imageMask,
    //   maskChannel: img.Channel.alpha,
    // );
    final imageResult = img.compositeImage(imageInput, imageMask,
        blend: img.BlendMode.addition);

    // img.encodeImageFile("test1.png", imageResult);

    var retMap = {
      0: img.encodeJpg(imageResult),
      1: """      Class : $className
      Latency : ${inferTime.toStringAsFixed(0)}ms    Conf: ${conf.toStringAsFixed(2)}
      """,
      2: conf,
      3: className,
    };
    // return img.encodeJpg(imageResult);

    return retMap;
  }

  Map<int, Object> _runInference(List<List<List<num>>> imageMatrix) {
    log('Running inference...');
    // // Set output tensor - sample
    // final output = {
    //   0: [List<num>.filled(10, 0)], // Scores: [1, 10],
    //   1: [ List<List<num>>.filled(10, List<num>.filled(4, 0)) ], // Loc: [1, 10, 4],
    //   2: [0.0], // Number of detections: [1],
    //   3: [List<num>.filled(10, 0)], // Classes: [1, 10],
    // };

    // 출력 텐서 준비
    final output = {
      0: Uint8List(8), // pred: classnum TensorType.Int64 의 문제로 Uint8List 로 선언함
      // 0: [0], // pred
      1: [List<num>.filled(8, 0)], // logits [1, 8]
      2: [0.0], // Conf
      3: [
        List.generate(
            8, (x) => List.generate(256, (y) => List.filled(256, 0.0)))
      ],
      // outs [1,8,256,256]
      4: [
        List.generate(
            128, (x) => List.generate(32, (y) => List.filled(32, 0.0)))
      ], // reprs [1,128,32, 32]
    };

    // Set input tensor [1, 3, 256, 256]
    final input = [imageMatrix];
    _interpreter!.runForMultipleInputs([input], output);
    return output;
  }

  img.Image drawFloat({required List<List<List<double>>> scores}) {
    final int tensorSize = scores[0].length;
    final int classNum = scores.length;

    final outImage = img.Image(width: tensorSize, height: tensorSize);

    for (int j = 0; j < tensorSize; j++) {
      for (int k = 0; k < tensorSize; k++) {
        var maxi = 0;
        var maxnum = -double.maxFinite;

        for (int i = 0; i < classNum; i++) {
          final score = scores[i][j][k];
          if (score > maxnum) {
            maxnum = score;
            maxi = i;
          }
        }

        final color = switch (maxi) {
          1 => Colors.yellow,
          2 => Colors.green,
          3 => Colors.red,
          4 => Colors.blue,
          5 => Colors.grey,
          6 => Colors.cyan,
          7 => Colors.purple,
          _ => Colors.transparent,
        };

        // outImage.setPixelRgba(
        //     k, j, color.red, color.green, color.blue, color.alpha);
        outImage.setPixelRgba(k, j, color.red, color.green, color.blue, 127);
      }
    }

    return outImage;
  }
}
