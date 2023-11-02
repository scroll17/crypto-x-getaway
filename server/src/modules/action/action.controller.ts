import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '@common/decorators';
import { ICurrentUserData } from '@common/types/auth';
import { ActionService } from './action.service';
import { UserEntity } from '@entities/user';

@Controller('action')
@ApiTags('Action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @All('/*')
  @AuthUser()
  @ApiOperation({ summary: 'Transmit request to Action server.' })
  @ApiOkResponse({
    description: 'Response from Action server.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async transmit(
    @CurrentUser() user: ICurrentUserData,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.actionService.transmit(user.info as UserEntity, request, response);
  }
}
