// import 'package:fc_edge24/pages/image_run.dart';
import 'dart:typed_data';
import 'package:image_picker/image_picker.dart';
import 'package:flutter/material.dart';
// import 'detect_frutnet.dart';
import 'object_detection.dart';

class PageFrutnet extends StatefulWidget {
  const PageFrutnet({
    super.key,
  });

  @override
  State<PageFrutnet> createState() => _PageFrutnetState();
}

class _PageFrutnetState extends State<PageFrutnet> {
  final imagePicker = ImagePicker();
  ObjectDetection? detectFrutnet;
  Uint8List? image;
  String? _inferText = "";

  @override
  void initState() {
    super.initState();
    detectFrutnet = ObjectDetection();
  }

  // @override
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(title: Text("▶ FRUTNET 사진/동영상 선택")),
        Row(
          children: [
            SizedBox(width: 20),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Camera Pressed')),
                  );
                },
                // onPressed: () => {
                // Navigator.push(
                //   context,
                //   MaterialPageRoute(
                //     builder: (context) => CameraRun(),
                //   ),
                // )
                // },
                child: const Text('Camera'),
              ),
            ),
            SizedBox(width: 20),
            Expanded(
              child: ElevatedButton(
                onPressed: () async {
                  final result = await imagePicker.pickImage(
                    source: ImageSource.gallery,
                  );

                  if (result != null) {
                    image = detectFrutnet!.analyseImage(result.path);
                    setState(() {});
                  }
                },
                child: const Text('Gallay'),
              ),
            ),
            SizedBox(width: 20),
          ],
        ),
        Expanded(
          child: (image != null)
              ? Image.memory(image!)
              : Text(
                  "사진을 선택해 주세요",
                ),
        ),
        Container(
          alignment: Alignment.topLeft,
          child: Text("$_inferText"),
        ),
        SizedBox(height: 20),
        ListTile(
          title: Text('▶ 결과'),
          dense: true,
        ),
        Container(
          margin: EdgeInsets.symmetric(vertical: 1), // 상하 마진
          height: 2, // 라인의 두께
          color: Colors.grey, // 라인의 색상
        ),
        Expanded(child: Scrollbar(child: FrutnetListView())),
      ],
    );
  }
}

class FrutnetListView extends StatefulWidget {
  const FrutnetListView({
    super.key,
  });

  @override
  State<FrutnetListView> createState() => _FrutnetListViewState();
}

class _FrutnetListViewState extends State<FrutnetListView> {
  final List<Map<String, String>> data = [
    {
      "image": "assets/espd/f11.jpg",
      "text1": "2024-04-29",
      "text2": " class 0 (정상) ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image": "assets/espd/f2.jpg",
      "text1": "2024-04-21",
      "text2": " class 0 (정상) ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
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
              SizedBox(
                width: 120,
                height: 120,
                child: Image.asset(
                  data[index]["image"]!,
                  fit: BoxFit.cover,
                ),
              ),
              SizedBox(
                width: 10,
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('일     자 : ${data[index]["text1"]!}'),
                  Text('추론 결과 : ${data[index]["text2"]!}'),
                  Container(
                    width: 180,
                    child: Text(
                      data[index]["text3"]!,
                      softWrap: true,
                    ),
                  ),
                  Row(
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('전송되었습니다.')),
                          );
                        },
                        child: const Text('전송'),
                      ),
                      SizedBox(width: 10),
                      ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('삭제는 구현중입니다.')),
                          );
                        },
                        child: const Text('삭제'),
                      ),
                    ],
                  )
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
