import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { IncomingMessage } from "http";
import { ResponseBody } from "../response-body";

/**
 * 주로 microservice의 RpcException을 HttpException으로 변환해서 반환하기 위해 사용한다
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const status = exception.error?.status | exception.status | exception.statusCode;
    const httpStatus = status && Number.isInteger(status) ? status : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = new ResponseBody(httpStatus, exception.message);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    const req: any = ctx.getRequest<IncomingMessage>();
    Logger.error( req.url, req.body, JSON.stringify(responseBody));
  }
}
