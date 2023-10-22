import { NgModule } from "@angular/core"; 
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser"; 
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";

const iconNames = [
  "profile", "edit", "farm", "device", "equipment", "profile", "receipt", "register", "search", "share-in", "share-out", "tag",
  "bee", "hive", "setting", "arrow-down-thin", "arrow-up-thin", "calendar", "bee-active", "hive-active", "setting-active",
  "monitor", "control", "plus", "alarm", "timer", "log", "check-circle", "x-circle", "error-circle", "wifi-on", "wifi-off", "wifi-standby", "list", "minus", "add", "up", "down", "board", "graph-up", "graph-down",
  "temperature", "humidity", "CO2", "fan-on", "fan-off", "heater-on", "heater-off", "door-on", "door-off"
];

@NgModule({
  imports: [ MatIconModule ],
  exports: [ MatIconModule ]
})
export class IconModule {
  private path: string = "/files/icon";

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    iconNames.forEach((name) => {
      this.matIconRegistry.addSvgIcon(name, this.setPath(`${this.path}/${name}.svg`));
    });
  }

  private setPath(url: string): SafeResourceUrl { 
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url); 
  }
}
