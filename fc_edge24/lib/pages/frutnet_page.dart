import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

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
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Button Pressed')),
                );
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
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 10,
      itemBuilder: (context, index) {
        return Container(
          height: 100,
          color: (index % 2 == 0) ? Colors.red : Colors.green,
          child: Column(
            // mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.start,

            children: [
              Text(
                '이미지 $index ',
                style: TextStyle(fontSize: 30, color: Colors.white),
              ),
              Text(
                '결과 : $index',
                style: TextStyle(fontSize: 30, color: Colors.white),
              )
            ],
          ),
        );
      },
    );
  }
}
