import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_pytorch/pigeon.dart';
import 'camera_util.dart';

/// [CameraRun] stacks [CameraView] and [BoxWidget]s with bottom sheet for stats
class CameraRun extends StatefulWidget {
  @override
  _CameraRunState createState() => _CameraRunState();
}

class _CameraRunState extends State<CameraRun> {
  List<ResultObjectDetection?>? results;
  String? classification;

  /// Scaffold Key
  GlobalKey<ScaffoldState> scaffoldKey = GlobalKey();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      backgroundColor: Colors.black,
      body: Stack(
        children: <Widget>[
          // Camera View
          CameraView(resultsCallback, resultsCallbackClassification),
          // Bounding boxes
          boundingBoxes2(results),
          //Bottom Sheet
          Align(
            alignment: Alignment.bottomCenter,
            child: DraggableScrollableSheet(
              initialChildSize: 0.4,
              minChildSize: 0.1,
              maxChildSize: 0.5,
              builder: (_, ScrollController scrollController) => Container(
                width: double.maxFinite,
                decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    borderRadius: BORDER_RADIUS_BOTTOM_SHEET),
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: Icon(Icons.close),
                          onPressed: () {
                            Navigator.pop(context);
                          },
                        ),
                        Icon(Icons.keyboard_arrow_up,
                            size: 48, color: Colors.orange),
                        (classification != null)
                            ? Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Column(
                                  children: [
                                    StatsRow(
                                      'Classification:',
                                      '${classification}',
                                    ),
                                  ],
                                ),
                              )
                            : Container()
                      ],
                    ),
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  /// Returns Stack of bounding boxes
  Widget boundingBoxes2(List<ResultObjectDetection?>? results) {
    if (results == null) {
      return Container();
    }
    return Stack(
      children: results.map((e) => BoxWidget(result: e!)).toList(),
    );
  }

  void resultsCallback(List<ResultObjectDetection?> results) {
    if (mounted) {
      setState(() {
        this.results = results;
        results.forEach((element) {
          print({
            "rect": {
              "left": element?.rect.left,
              "top": element?.rect.top,
              "width": element?.rect.width,
              "height": element?.rect.height,
              "right": element?.rect.right,
              "bottom": element?.rect.bottom,
            },
          });
        });
      });
    }
  }

  void resultsCallbackClassification(String classification) {
    if (mounted) {
      setState(() {
        this.classification = classification;
      });
    }
  }

  static const BOTTOM_SHEET_RADIUS = Radius.circular(24.0);
  static const BORDER_RADIUS_BOTTOM_SHEET = BorderRadius.only(
      topLeft: BOTTOM_SHEET_RADIUS, topRight: BOTTOM_SHEET_RADIUS);
}

/// Row for one Stats field
class StatsRow extends StatelessWidget {
  final String left;
  final String right;

  StatsRow(this.left, this.right);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      // child: Row(
      //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
      //   children: [Text(left), Text(right)],
      // ),
      child: RichText(
        text: TextSpan(
          style: TextStyle(color: Colors.black, fontSize: 18),
          children: <TextSpan>[
            TextSpan(text: '$left\n'),
            TextSpan(text: right),
          ],
        ),
      ),
    );
  }
}
