import 'package:flutter/material.dart';
import 'pages/page_home.dart';
import 'pages/page_espd.dart';
import 'pages/page_frutnet.dart';
import 'package:webview_flutter/webview_flutter.dart';

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
      home: const FcEdgeAppHomePage(title: 'ETRI EDGE 24'),
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
  late WebViewController _controller;
  final String url = "https://github.com/etri-edgeai/smart-farm-application";

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted);
    // ..loadRequest(Uri.parse(url));
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Widget _getBody() {
    return switch (_selectedIndex) {
      0 => PageEspd(),
      1 => PageFrutnet(),
      2 => PageHome(),
      3 => WebViewWidget(
          controller: _controller
            ..loadRequest(Uri.parse(
                "https://github.com/etri-edgeai/smart-farm-application"))),
      4 => WebViewWidget(
          controller: _controller
            ..loadRequest(Uri.parse(
                "https://github.com/etri-edgeai/smart-farm-application"))),
      // 4 => WebViewWidget(
      //     controller: _controller
      //       ..loadRequest(Uri.parse("https://smartfarm.gongju.go.kr/app/"))),
      _ => WebViewWidget(
          controller: _controller
            ..loadRequest(Uri.parse(
                "https://github.com/etri-edgeai/smart-farm-application"))),
      // _ => PageHome(),
    };
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
        child: _getBody(),
      ),
      bottomNavigationBar: navBar(),
    );
  }

  BottomNavigationBar navBar() {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
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
          icon: Icon(Icons.home),
          label: 'Fc Edge',
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
