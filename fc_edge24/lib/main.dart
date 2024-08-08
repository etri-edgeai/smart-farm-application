import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'pages/page_home.dart';
import 'pages/page_espd.dart';
import 'pages/page_frutnet.dart';
// import 'webview_page.dart';
// import 'package:webview_flutter/webview_flutter.dart';
// import 'page_home.dart';
// import 'page_espd.dart';s

Future main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
  //   await InAppWebViewController.setWebContentsDebuggingEnabled(kDebugMode);
  // }

  runApp(const FcEdgeApp());
}

class FcEdgeApp extends StatelessWidget {
  const FcEdgeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'FCEDGE 24',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const FcEdgeAppHomePage(title: 'FC EDGE 24'),
    );
  }
}

class FcEdgeAppHomePage extends StatefulWidget {
  const FcEdgeAppHomePage({super.key, required this.title});
  final String title;

  @override
  State<FcEdgeAppHomePage> createState() => _FcEdgeAppHomePageState();
}

class _FcEdgeAppHomePageState extends State<FcEdgeAppHomePage> {
  int _selectedIndex = 0;

  static final List<Widget> _widgetOptions = <Widget>[
    const PageFrutnet(),
    const PageEspd(),
    const PageHome(),
    // const PageEspdLegacy(),
    // ImagePickerScreen(),
    PageMultiSensor(),
    PageConnectOn(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 3,
        // title: Text('FarmConnect Edge AI app'),
        title: null,
      ),
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: navBar(),
    );
  }

  BottomNavigationBar navBar() {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          // icon: Icon(Icons.search),
          icon: Text("ESPD"),
          label: '(생육)',
        ),
        BottomNavigationBarItem(
          icon: Text("FRUTNET"),
          label: '(성장)',
        ),
        BottomNavigationBarItem(
          icon: Text("멀티센서"),
          label: '(환경)',
        ),
        BottomNavigationBarItem(
          icon: Text("ConnectOn"),
          label: '(환경)',
        ),
      ],
      currentIndex: _selectedIndex,
      selectedItemColor: Colors.amber[800],
      unselectedItemColor: Colors.grey, // 선택되지 않은 항목 색상 지정
      showSelectedLabels: true,
      showUnselectedLabels: true, // 선택되지 않은 항목의 라벨도 표시
      onTap: _onItemTapped,
      backgroundColor: Colors.white, // 배경색 지정
      type: BottomNavigationBarType.fixed, // 아이템이 4개 이하일 때 권장
    );
  }
}

class PageEspdLegacy2 extends StatelessWidget {
  const PageEspdLegacy2({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Button Pressed')),
                );
              },
              child: const Text(
                'ESPD',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {},
                    child: const Text('사진 선택'),
                  ),
                ),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {},
                    child: const Text('  '),
                  ),
                ),
                // Add more buttons as needed
              ],
            ),
            const Text(
              """
# 병충해 확인
* 발생일자 : 2024-06-01
* 추론결과 : 잎곰팡이병(Leaf mold)

# 진단 결과
    2024-06-01 111111111.png 진단 : 정상
 √ 2024-06-01 221111111.png 진단 : Leaf mold
    2024-06-01 331111111.png 진단 : chlorosis virus
""",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20), // 간격 추가
          ],
        ));
  }
}

class PageMultiSensor extends StatelessWidget {
  // @override
  // Widget build(BuildContext context) {
  //   return Text('11');
  // }

  @override
  Widget build(BuildContext context) {
    return InAppWebView(
      initialUrlRequest:
          URLRequest(url: WebUri('https://testfarm.farmcloud.kr/multisensor')),
    );
  }
}

class PageConnectOn extends StatelessWidget {
  const PageConnectOn({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return InAppWebView(
      initialUrlRequest:
          URLRequest(url: WebUri('https://testfarm.farmcloud.kr/app')),
    );
  }
}

class PageEspdLegacy extends StatelessWidget {
  const PageEspdLegacy({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return InAppWebView(
      initialUrlRequest:
          URLRequest(url: WebUri('https://smartca.farmcloud.kr/espd')),
    );
  }
}
