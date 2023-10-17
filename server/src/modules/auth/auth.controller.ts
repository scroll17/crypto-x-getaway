import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Ip,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  ApiBasicAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { GoogleAuthGuard, JwtAuthGuard, LocalAuthGuard, UserGuard } from '@common/guards';
import { AccessToken, CurrentUser, DisableEndpoint, RefreshToken } from '@common/decorators';
import { ICurrentUserData, IUserDataInThirdPartyService } from '@common/types/auth';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoggedInUserEntity } from './entities/logged-in-user.entity';
import { LoggedInAdminEntity } from './entities/logged-in-admin.entity';
import { UserEntity, UserModel, UserWentFrom } from '@entities/user';
import { AccessTokenEntity, AccessTokenModel } from '@entities/accessToken';
import { Request } from 'express';
import { LoggedInThirdPartyServiceUserEntity } from './entities/logged-in-third-party-service-user.entity';
import { FacebookAuthGuard } from '@common/guards/facebook-auth.guard';
import { AuthCookies } from '@common/enums';

@Controller('auth')
@ApiTags('Auth')
@ApiExtraModels(LoggedInAdminEntity)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @DisableEndpoint()
  @Post('/register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register user.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Created user with access token.',
    type: LoggedInUserEntity,
  })
  @ApiForbiddenResponse({
    description: 'User with passed email or phone already exists',
  })
  async register(@Body() dto: RegisterUserDto, @Ip() ip: string) {
    return this.authService.register(dto, ip);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(201)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Login user.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'User with tokens.',
    schema: {
      oneOf: [
        {
          $ref: getSchemaPath(LoggedInUserEntity),
        },
        {
          $ref: getSchemaPath(LoggedInAdminEntity),
        },
      ],
    },
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'User not unauthorized.' })
  async login(@CurrentUser() user: ICurrentUserData, @Ip() ip: string, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(user, ip, res);
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Init google auth' })
  async googleInit() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Complete google auth' })
  @ApiOkResponse({
    status: 200,
    description: 'User with tokens.',
    type: LoggedInThirdPartyServiceUserEntity,
  })
  async googleLogin(@Req() req: Request, @Ip() ip: string, @Res({ passthrough: true }) res: Response) {
    return this.authService.thirdPartyLogin(req.user as IUserDataInThirdPartyService, UserWentFrom.Google, ip, res);
  }

  @DisableEndpoint()
  @Get('/facebook')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Init facebook auth' })
  async facebookInit() {}

  @DisableEndpoint()
  @Get('/facebook/callback')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Complete facebook auth' })
  @ApiOkResponse({
    status: 200,
    description: 'User with tokens.',
    type: LoggedInThirdPartyServiceUserEntity,
  })
  async facebookLogin(@Req() req: Request, @Ip() ip: string, @Res({ passthrough: true }) res: Response) {
    return this.authService.thirdPartyLogin(req.user as IUserDataInThirdPartyService, UserWentFrom.Facebook, ip, res);
  }

  @DisableEndpoint()
  @Patch('/verify-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Verify user email.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Current user.',
    type: UserModel,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async verifyEmail(@CurrentUser() user: ICurrentUserData, @Body() dto: VerifyEmailDto) {
    return this.authService.checkVerificationCode(user, dto.code);
  }

  @DisableEndpoint()
  @Post('/resend-verify-code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Resend verify user code to user.' })
  @ApiOkResponse({
    status: 200,
    description: 'Result of resend email.',
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async resendVerifyCode(@CurrentUser() user: ICurrentUserData) {
    return this.authService.resendVerificationCode(user);
  }

  @Get('/tokens-list')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get list of existed tokens.' })
  @ApiOkResponse({
    status: 200,
    description: 'List of existed tokens.',
    type: [AccessTokenModel],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getTokensList(@CurrentUser() user: ICurrentUserData) {
    return this.authService.getTokensList(user.info);
  }

  @Delete('/revoke-token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Remove access token by id.' })
  @ApiNoContentResponse({
    status: 204,
    description: 'Token revoked.',
  })
  @ApiQuery({ name: 'id', type: Number })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Token not found.' })
  async revokeToken(@CurrentUser() user: ICurrentUserData, @Query('id', ParseIntPipe) tokenId: number) {
    await this.authService.revokeToken(user, tokenId);
  }

  @Put('/refresh')
  @HttpCode(201)
  @ApiOperation({ summary: 'Refresh access token.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'New access token record',
    type: AccessTokenEntity,
  })
  @ApiNotFoundResponse({ description: 'Token not found.' })
  async refresh(@RefreshToken() refreshToken: string, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(refreshToken, res);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Logout user and destroy token.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Result of logout.',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'User not unauthorized.' })
  async logout(
    @CurrentUser() user: ICurrentUserData,
    @AccessToken() accessTokenStr: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.authService.logout(user.info, accessTokenStr);

    res.cookie(AuthCookies.LoggedIn, null, { maxAge: 0 });
    res.cookie(AuthCookies.AccessToken, null, { maxAge: 0 });
    res.cookie(AuthCookies.RefreshToken, null, { maxAge: 0 });

    return result;
  }

  @Patch('/init-password-reset')
  @UseGuards(JwtAuthGuard, UserGuard)
  @HttpCode(200)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Init password reset for user.' })
  @ApiOkResponse({
    status: 200,
    description: 'Result of send init password notification.',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  async initPasswordReset(@CurrentUser() user: ICurrentUserData) {
    return this.authService.initPasswordReset(user.info as UserEntity);
  }

  @Patch('/reset-password')
  @UseGuards(JwtAuthGuard, UserGuard)
  @HttpCode(200)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Reset password for user.' })
  @ApiOkResponse({
    status: 200,
    description: 'Result of password reset.',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'Reset code not found.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  async resetPassword(@CurrentUser() user: ICurrentUserData, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(user.info as UserEntity, dto);
  }
}
