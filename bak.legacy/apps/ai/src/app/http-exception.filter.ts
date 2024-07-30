import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, RpcExceptionFilter } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { Request, Response } from 'express';
import { Observable, throwError } from "rxjs";

@Catch(RpcException)
export class HttpExceptionFilter implements RpcExceptionFilter<RpcException>{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(() => new Error("Method not implemented."));
  }
  /*
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.FORBIDDEN).json({
      statusCode: 403,
      message: "hmmm!!"
    });
  }
  */
}