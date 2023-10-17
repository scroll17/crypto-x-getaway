import * as _ from 'lodash';
import { Command } from 'nestjs-command';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { TUserRepository, USER_REPOSITORY } from '../../modules/database/repositories';
import { UserWentFrom } from '@entities/user';
import { ConfigService } from '@nestjs/config';
import { TUserSeed } from '@common/interfaces';

@Injectable()
export class UserSeed {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private userRepository: TUserRepository,
  ) {}

  @Command({ command: 'create:users', describe: 'Create users' })
  async createBulk() {
    const usersSeed = this.configService.getOrThrow<Array<TUserSeed>>('usersSeed');

    this.logger.debug('Generating bulk of Users records');
    await Promise.all(
      usersSeed.map(async (userSeed) => {
        let user = await this.userRepository.findOne({
          where: {
            email: userSeed.email,
          },
        });
        if (user) {
          this.logger.verbose('User already exists', {
            firstName: userSeed.firstName,
            email: userSeed.email,
            hasBotAccess: userSeed.hasBotAccess,
            telegramId: userSeed.telegramId,
          });
          return;
        }

        this.logger.debug('Creating User with data', {
          firstName: userSeed.firstName,
          email: userSeed.email,
          hasBotAccess: userSeed.hasBotAccess,
          telegramId: userSeed.telegramId,
        });
        user = this.userRepository.create({
          ...userSeed,
          changePassword: true,
          wentFrom: UserWentFrom.Admin,
        });
        await user.hashPassword();
        await user.save();

        // const { accessToken, refreshToken } = await this.authService.generateAuthTokens('127.0.0.1', user, false);

        this.logger.verbose('Created Users', {
          user: _.pick(user, ['firstName', 'email']),
          // accessToken,
          // refreshToken,
        });
      }),
    );
  }
}
