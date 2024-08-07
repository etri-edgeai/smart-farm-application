import 'package:fc_edge24/pages/image_run.dart';
import 'package:flutter/material.dart';
import 'camera_run.dart';

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
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: 30),
            ElevatedButton(
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
            SizedBox(height: 30),
            ElevatedButton(
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
