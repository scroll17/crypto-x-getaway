import { ApiProperty } from '@nestjs/swagger';
import { AdminModel } from '@entities/admin';
import { AccessTokenEntity } from '@entities/accessToken';

export class LoggedInAdminEntity {
  @ApiProperty({
    type: AdminModel,
    example: AdminModel,
    description: 'The admin record',
  })
  user: AdminModel;

  @ApiProperty({
    type: AccessTokenEntity,
    description: 'The access token кусщкв',
  })
  accessToken: AccessTokenEntity;
}
