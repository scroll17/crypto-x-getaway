import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@common/guards';
import { CurrentUser } from '@common/decorators';
import { ICurrentUserData } from '@common/interfaces/auth';
import { UserModel } from '@entities/user';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current user.' })
  @ApiOkResponse({
    status: 200,
    description: 'Current user.',
    type: UserModel,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getMe(@CurrentUser() user: ICurrentUserData) {
    return user.info;
  }
}
