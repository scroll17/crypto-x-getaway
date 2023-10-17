/*external modules*/
import * as _ from 'lodash';
import { CallHandler, ContextType, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
/*modules*/
/*adapters*/
/*providers*/
/*common*/
/*libs*/
/*db*/
/*other*/

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    let token: string | null = null;
    let trace: Record<string, string | number | Date | Record<string, unknown>> = {};

    switch (context.getType()) {
      case 'http': {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();

        token = `HTTP ${request.method} "${request.path}"`;
        trace = {
          body: request.body,
          query: request.query,
          headers: _.pick(request.headers, ['content-type', 'user-agent', 'host']),
          timestamp: new Date(),
        };

        break;
      }
      default: {
        return next.handle();
      }
      // case 'telegraf' as ContextType: {
      //   const httpContext = context.switchToHttp();
      //   const request = httpContext.getRequest();
      //
      //   token = `Telegraf ${request.method} "${request.path}"`;
      //   trace = {
      //     body: request.body,
      //     query: request.query,
      //     headers: request.headers,
      //     timestamp: new Date(),
      //   };
      // }
    }

    this.logger.verbose(token ?? '<token>', trace);

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => this.logger.debug(`[${token}] Execution time: ${((Date.now() - now) / 1000).toFixed(2)}s`)));
  }
}
