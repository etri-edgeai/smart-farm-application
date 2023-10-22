import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FrontConfigService } from '@front/services/config';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private configService: FrontConfigService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.method === "JSONP") return next.handle(req);

    let headers = req.headers;
    const siteCode = this.configService.siteConfig?.code;
    if (siteCode) {
      headers = headers.set('X-SITE-CODE', siteCode);
    }
    const newReq = req.clone({headers: headers});
    return next.handle(newReq);
  }
}
