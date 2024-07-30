import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const a = context.getArgs();
    // TODO: token으로 유저의 role을 가져와서 아래처럼 박아주자
    // a[0]['role'] = 'haha';
    return true;
  }
}
