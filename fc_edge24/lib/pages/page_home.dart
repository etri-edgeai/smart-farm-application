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
              title: const Text("팜커넥트 통합 앱\n",
                  style: TextStyle(fontSize: 35, fontWeight: FontWeight.bold)),
            ),
            const Text(
              """
# ESPD(생육) - 병충해 탐지
  * 카메라를 통해 병충해(잎곰팡이병 등) 추론
  * 추론 결과를 저장(edge 에서 추론 및 관리)
  * 결과 전송 : 농장/지역별 발생상황 관리


# FRTUNET(성장)
  * 카메라를 통해 성장 판단
  * 추론 결과를 저장(edge 에서 추론 및 관리)
  * 결과 전송 : 농장별 성장 상황 관리가능 


# 멀티센서(환경)
  * 이미지 등을 활용한 사용법 안내
  * 하스우 동안에 여러 개의 센서를 설치하여 위치별 센서 데이터 수집 및 모델링
  * 3D모델링을 통해 가상센서 하우스별(27개) 생성
  * 하우스의 동 내 위치별 온도 습도를 모니터링
  * 모델링한 결과를 분석하여 농장주에게 농장 제어 정보 제안
    ( 측창 구역 동쪽/남쪽, 환기 위치, 천창, 환기 제안 등)
  * 센서 1개만 설치해도 농장 내부 편차를 예측하여 제공


# ConnectON(환경) 
  * 팜커넥트앱 커넥트온 연결
  * 기상청, 농업과학원 등의 공개 데이터를 활용하여 실시간 내/외부 환경 예측 모델 구현
  * 온도 습도 등 예측 데이터 바탕으로 증산/건조 시간 등 분석 정보 제공
  * 예측(온도/습도 등)을 통해 환기 등 활동 제안


# 앱 정보
 - 이 앱은 2024년도 정부(과학기술정보통신부)의 재원으로 정보통신기획평가원의 지원을 받아 수행된 연구임(No. 2021-0-00907 능동적 즉시 대응 및 빠른 학습이 가능한 적응형 경량 엣지 연동분석 기술개발).

""",
            ),
            const SizedBox(height: 20), // 간격 추가
          ],
        ));
  }
}
