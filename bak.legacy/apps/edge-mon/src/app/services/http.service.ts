import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  get<T>(cmd: string, params: unknown = {}): Observable<T> {
    const url = "/api/" + cmd;
    //const url = "192.168.0.229:8080/api/request.json";
    let httpParams = new HttpParams();
    httpParams = httpParams.append("data", JSON.stringify(params));
    return this.http.get<T>(url, { params: httpParams });
  }

  post<T>(cmd: string, params?: unknown): Observable<T> {
    let url = "/api";
    if (!cmd.startsWith("/")) url += "/";
    url = url + cmd;
    return this.http.post<T>(url, params);
  }
}
