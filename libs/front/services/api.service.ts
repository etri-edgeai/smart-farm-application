import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  server = "";

  constructor(private _httpClient: HttpClient) {}

  req<T=any>(cmd: string, data?: any): Observable<T> {
    return this._httpClient.post<T>(this.server + "/api/" + cmd, data);
  }

  reqJsonp(url: string){
    return this._httpClient.jsonp(url, 'callback');
  }
}
