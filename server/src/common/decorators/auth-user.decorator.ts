import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AccessTokenConfirmedGuard, JwtAuthGuard, UserGuard } from '@common/guards';
import { UserPasswordChangedGuard } from '@common/guards';
import { AuthCookies } from '@common/enums';

export function AuthUser() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, UserGuard, UserPasswordChangedGuard, AccessTokenConfirmedGuard),
    ApiCookieAuth(AuthCookies.AccessToken),
  );
}
