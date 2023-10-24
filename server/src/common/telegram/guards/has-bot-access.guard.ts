import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TUserRepository, USER_REPOSITORY } from '../../../modules/database/repositories';
import { TelegrafMessageHelper } from '@common/telegram/helpers';

@Injectable()
export class TelegrafHasBotAccessGuard implements CanActivate {
  constructor(
    private messageHelper: TelegrafMessageHelper,
    @Inject(USER_REPOSITORY)
    private userRepository: TUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tgCtx = TelegrafExecutionContext.create(context).getContext<Context>();

    const { user: tgUser } = this.messageHelper.getTelegramUserFromCtx(tgCtx);

    const user = await this.userRepository.findOne({
      where: {
        telegramId: tgUser.telegramId,
      },
    });
    if (!user) {
      throw new TelegrafException('User not found');
    }

    return user.hasBotAccess;
  }
}
