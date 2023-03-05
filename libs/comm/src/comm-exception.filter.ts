import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

/**
 * Exception을 RpcException으로 변환
 */
@Catch()
export class CommExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    return throwError(() => exception.response ?
      exception.response :
      new RpcException(exception));
  }
}