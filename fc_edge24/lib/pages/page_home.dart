import 'package:flutter/material.dart';

class PageHome extends StatelessWidget {
  const PageHome({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            ListTile(
              title: const Text("ETRI EDGE 앱\n",
                  style: TextStyle(fontSize: 35, fontWeight: FontWeight.bold)),
            ),
            const Text(
              """
# ESPD(생육) - 병충해 탐지
  * 카메라, 갤러리를 통해 병충해(잎곰팡이병 등) 추론
  * 추론 결과를 저장(edge 에서 추론 및 관리)
  * 결과 전송 : 농장/지역별 발생상황 관리
  * pytorch 이용 학습한 후 tflite 파일 생성
  * tflite_flutter 패키지 이용

# 앱 정보
 - 이 앱은 2024년도 정부(과학기술정보통신부)의 재원으로 정보통신기획평가원의 지원을 받아 수행된 연구임(No. 2021-0-00907 능동적 즉시 대응 및 빠른 학습이 가능한 적응형 경량 엣지 연동분석 기술개발).

""",
            ),
            const SizedBox(height: 20), // 간격 추가
          ],
        ));
  }
}
