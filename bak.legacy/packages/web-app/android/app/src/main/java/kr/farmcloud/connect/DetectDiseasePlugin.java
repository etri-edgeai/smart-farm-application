package kr.farmcloud.connect;
import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DetectDisease")
public class DetectDiseasePlugin extends Plugin {

  @PluginMethod()
  public void launch(PluginCall call) {
    String value = call.getString("value");

    Intent intent = new Intent(getActivity().getApplicationContext(), DetectDiseaseActivity.class);
    getActivity().startActivity(intent);

    JSObject ret = new JSObject();
    ret.put("value", "haha " + value);
    call.resolve(ret);
  }
}
