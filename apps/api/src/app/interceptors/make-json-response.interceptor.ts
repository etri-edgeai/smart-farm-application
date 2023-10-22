import { ResponseBody } from './../response-body';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Response } from 'express';

@Injectable()
export class MakeJsonResponseInterceptor<T> implements NestInterceptor<T, T|ResponseBody> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T|ResponseBody> {
    return next.handle().pipe(map(data => {
      if (typeof data === 'string' || data == null) {
        const host = context.switchToHttp();
        const res = host.getResponse<Response>();
        return new ResponseBody(res.statusCode, data);
      } else {
        return data;
      }
    }));
  }
}
