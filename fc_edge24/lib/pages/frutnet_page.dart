import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:image_picker/image_picker.dart';

import 'package:pytorch_mobile/pytorch_mobile.dart';
import 'package:pytorch_mobile/model.dart';
import 'package:pytorch_mobile/enums/dtype.dart';

class PageFrutnet extends StatefulWidget {
  const PageFrutnet({
    super.key,
  });

  @override
  State<PageFrutnet> createState() => _PageFrutnetState();
}

class _PageFrutnetState extends State<PageFrutnet> {
  Model? _imageModel, _customModel;

  String? _imagePrediction;
  List? _prediction;
  File? _image;
  ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    loadModel();
  }

  //load your model
  Future loadModel() async {
    String pathImageModel = "assets/models/resnet.pt";
    String pathCustomModel = "assets/models/custom_model.pt";
    try {
      _imageModel = await PyTorchMobile.loadModel(pathImageModel);
      _customModel = await PyTorchMobile.loadModel(pathCustomModel);
    } on PlatformException {
      print("only supported for android and ios so far");
    }
  }

  Future runImageModel() async {
    //pick a random image
    // final PickedFile? image = await _picker.getImage(
    //     source: (Platform.isIOS ? ImageSource.gallery : ImageSource.camera),
    //     maxHeight: 224,
    //     maxWidth: 224);

    final XFile? image = await _picker.pickImage(source: ImageSource.camera);

    //get prediction
    //labels are 1000 random english words for show purposes
    _imagePrediction = await _imageModel!.getImagePrediction(
        File(image!.path), 224, 224, "assets/labels/labels.csv");

    setState(() {
      _image = File(image.path);
    });
  }

  //run a custom model with number inputs
  Future runCustomModel() async {
    _prediction = await _customModel!
        .getPrediction([1, 2, 3, 4], [1, 2, 2], DType.float32);

    setState(() {});
  }

  // @override
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                runImageModel();
                // ScaffoldMessenger.of(context).showSnackBar(
                //   const SnackBar(content: Text('Button Pressed')),
                // );
              },
              // onPressed: () => getImage(ImageSource.camera),
              child: const Text('카메라'),
            ),
            SizedBox(width: 20),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Button Pressed')),
                );
              },
              // onPressed: () => getImage(ImageSource.camera),
              child: const Text('갤러리'),
            ),
            _image == null ? Text('No image selected.') : Image.file(_image!),
            Center(
              child: Visibility(
                visible: _imagePrediction != null,
                child: Text("$_imagePrediction"),
              ),
            ),
          ],
        ),
        Expanded(child: Scrollbar(child: FNetListView())),
      ],
    );
  }
}

class FNetListView extends StatefulWidget {
  const FNetListView({
    super.key,
  });

  @override
  State<FNetListView> createState() => _FNetListViewState();
}

class _FNetListViewState extends State<FNetListView> {
  final List<Map<String, String>> data = [
    {
      "image":
          "https://image.dongascience.com/Photo/2018/10/1e4e9eb4a36aaff4874434582f414eae.jpg",
      "text": "Item 1"
    },
    {
      "image":
          "https://cdn.jjan.kr/data2/content/image/2021/05/27/20210527311576.jpg",
      "text": "Item 2"
    },
    {
      "image":
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/TomateCherryTross.jpg/300px-TomateCherryTross.jpg",
      "text": "Item 3\n "
    },
    // Add more items as needed
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: data.length,
      itemBuilder: (context, index) {
        return Padding(
          padding: EdgeInsets.all(16.0),
          child: Row(
            children: [
              Container(
                width: 80,
                height: 120,
                child: Image.network(
                  data[index]["image"]!,
                  fit: BoxFit.cover,
                ),
              ),
              SizedBox(
                width: 10,
              ),
              Column(
                children: [
                  Text('111'),
                  Text('222'),
                  Text('222'),
                  Text('222'),
                  RichText(
                    text: TextSpan(
                      style: TextStyle(color: Colors.black, fontSize: 18),
                      children: <TextSpan>[
                        TextSpan(text: 'This is line one.\n'),
                        TextSpan(text: 'This is line two.\n'),
                        TextSpan(text: 'This is line three.'),
                      ],
                    ),
                  ),
                ],
              ),
              // DataTable(
              //   checkboxHorizontalMargin: 1,
              //   columnSpacing: 1,
              //   horizontalMargin: 0,
              //   headingRowHeight: 30,
              //   dataRowMinHeight: 10,
              //   columns: [
              //     DataColumn(label: Text('Column 1')),
              //     DataColumn(label: Text('Column 2')),
              //   ],
              //   rows: List.generate(
              //     2,
              //     (index) => DataRow(cells: [
              //       DataCell(Text('Row $index, Col dd')),
              //       DataCell(Text('Row $index, Col 3 ')),
              //     ]),
              //   ),
              // ),
            ],
          ),
        );
      },
    );
  }
}
