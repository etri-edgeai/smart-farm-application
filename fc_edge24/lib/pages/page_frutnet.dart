import 'package:fc_edge24/pages/image_run.dart';
import 'package:flutter/material.dart';
import 'camera_run.dart';

class PageFrutnet extends StatefulWidget {
  const PageFrutnet({
    super.key,
  });

  @override
  State<PageFrutnet> createState() => _PageFrutnetState();
}

class _PageFrutnetState extends State<PageFrutnet> {
  // @override
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          title: Text(
            "FRUTNET",
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
                // onPressed: () {
                //   ScaffoldMessenger.of(context).showSnackBar(
                //     const SnackBar(content: Text('Camera Pressed')),
                //   );
                // },
                child: const Text('Camera'),
              ),
            ),
            SizedBox(width: 20),
            Expanded(
              child: ElevatedButton(
                // onPressed: () {
                //   ScaffoldMessenger.of(context).showSnackBar(
                //     const SnackBar(content: Text('Gallary Pressed')),
                //   );
                // },
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
      "image":
          "https://image.dongascience.com/Photo/2018/10/1e4e9eb4a36aaff4874434582f414eae.jpg",
      "text1": "2024-07-01",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image":
          "https://cdn.jjan.kr/data2/content/image/2021/05/27/20210527311576.jpg",
      "text1": "2024-06-21",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image":
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/TomateCherryTross.jpg/300px-TomateCherryTross.jpg",
      "text1": "2024-05-29",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image":
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/TomateCherryTross.jpg/300px-TomateCherryTross.jpg",
      "text1": "2024-04-29",
      "text2": " class 0 : 정상 ",
      "text3": " confidence: 0.924  latency : 300ms \n",
    },
    {
      "image":
          "https://cdn.jjan.kr/data2/content/image/2021/05/27/20210527311576.jpg",
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
                width: 120,
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
                        TextSpan(text: '  ${data[index]["text3"]!}'),
                      ],
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
