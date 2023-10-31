import { Controller, All } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, DisableController, AuthUser } from '@common/decorators';
import { ICurrentUserData } from '@common/types/auth';
import { ActionService } from './action.service';

@Controller('action')
@ApiTags('Action')
@DisableController()
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @All('/*')
  @AuthUser()
  @ApiOperation({ summary: 'Transmit request to Action server.' })
  @ApiOkResponse({
    description: 'Response from Action server.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async transmit(@CurrentUser() user: ICurrentUserData) {
    return user.info;
  }
}
