import 'package:fc_edge24/pages/image_run.dart';
import 'package:flutter/material.dart';
import 'camera_run.dart';
import 'image_run.dart';

class PageEspd extends StatefulWidget {
  const PageEspd({
    super.key,
  });

  @override
  State<PageEspd> createState() => _PageEspdState();
}

class _PageEspdState extends State<PageEspd> {
  // @override
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text("   ▶ 사진/동영상 선택"),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => CameraRun(),
                        ),
                      )
                    },
                    // onPressed: () {
                    //   ScaffoldMessenger.of(context).showSnackBar(
                    //     const SnackBar(content: Text('Camera Pressed')),
                    //   );
                    // },
                    child: const Text('Camera'),
                  ),
                ),
                SizedBox(height: 30),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ImageRun(),
                        ),
                      )
                    },
                    child: const Text('Gallay'),
                  ),
                ),
              ],
            ),
            SizedBox(height: 30),
            Text("   ▶ 전송 결과"),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Button Pressed')),
                      );
                    },
                    child: const Text('결과 전송'),
                  ),
                ),
                SizedBox(width: 30),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {},
                    child: const Text('삭제'),
                  ),
                ),
                // Add more buttons as needed
              ],
            ),
          ],
        ),
        Expanded(child: Scrollbar(child: EspdListView())),
      ],
    );
  }
}

class EspdListView extends StatefulWidget {
  const EspdListView({
    super.key,
  });

  @override
  State<EspdListView> createState() => _EspdListViewState();
}

class _EspdListViewState extends State<EspdListView> {
  final List<Map<String, String>> data = [
    {
      "image": "/assets/test_imgs/0001091_SAM_1490.png ",
      "text1": "2024-07-01",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image": "/assets/test_imgs/0002438_20180919_120006.png",
      "text1": "2024-06-21",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image": "/assets/test_imgs/0001097_SAM_1496.png",
      "text1": "2024-05-29",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image": "/assets/test_imgs/0002449_20180919_130344.png",
      "text1": "2024-04-29",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image": "/assets/test_imgs/0005443_SAM_0638.png",
      "text1": "2024-04-21",
      "text2": " class 0 : 정상 ",
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
                width: 200,
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
                  RichText(
                    text: TextSpan(
                      style: TextStyle(color: Colors.black, fontSize: 18),
                      children: <TextSpan>[
                        TextSpan(text: '일     자 : ${data[index]["text1"]!}\n'),
                        TextSpan(text: '추론 결과 : ${data[index]["text2"]!}\n'),
                        TextSpan(text: '  ${data[index]["text3"]!}\n'),
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
