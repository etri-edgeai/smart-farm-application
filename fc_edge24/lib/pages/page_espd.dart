import 'package:fc_edge24/pages/image_run.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
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
        ListTile(
          title: Text(
            "ESPD ",
            style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
          ),
        ),
        ListTile(title: Text("▶ 사진/동영상 선택")),
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
                child: const Text('Camera'),
              ),
            ),
            SizedBox(width: 30),
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
        ListTile(title: Text('▶ 결과')),
        Container(
          margin: EdgeInsets.symmetric(vertical: 1), // 상하 마진
          height: 2, // 라인의 두께
          color: Colors.grey, // 라인의 색상
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
      "image": "assets/espd/sam1.png",
      "text1": "2024-07-01",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image": "assets/espd/sam2.png",
      "text1": "2024-06-21",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image": "assets/espd/sam3.png",
      "text1": "2024-05-29",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image": "assets/espd/sam4.png",
      "text1": "2024-04-29",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image": "assets/espd/sam5.png",
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
              // SizedBox(
              //   width: 50,
              //   height: 100,
              //   child: Image.network(
              //     data[index]["image"]!,
              //     fit: BoxFit.cover,
              //   ),
              // ),
              SizedBox(
                width: 120,
                height: 120,
                child: Image.asset(
                  data[index]["image"]!,
                  fit: BoxFit.cover,
                ),
              ),
              SizedBox(
                width: 20,
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('일     자 : ${data[index]["text1"]!}'),
                  Text('추론 결과 : ${data[index]["text2"]!}'),
                  Text('  ${data[index]["text3"]!}'),
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
