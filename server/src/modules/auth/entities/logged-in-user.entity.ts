import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '@entities/user';
import { AccessTokenEntity } from '@entities/accessToken';

export class LoggedInUserEntity {
  @ApiProperty({
    type: UserModel,
    example: UserModel,
    description: 'The user record',
  })
  user: UserModel;

  @ApiProperty({
    type: AccessTokenEntity,
    description: 'The access token кусщкв',
  })
  accessToken: AccessTokenEntity;
}
