package kr.farmcloud.connect;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(DetectDiseasePlugin.class);
    super.onCreate(savedInstanceState);
  }
}
