import url from 'node:url';
import { Ctx, Message, On, Wizard, WizardStep, Hears } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { MarkupCallbackButtonName, TelegrafScene } from '@common/telegram/enums';
import { ActionService } from '../../../../action/action.service';
import { Markup } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { TelegrafAuthUser } from '@common/telegram/decorators';

@Injectable()
@Wizard(TelegrafScene.SetActionServerUrl)
export class SetServerUrlWizard {
  constructor(private readonly actionService: ActionService) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    await ctx.reply(
      'Отправте URL сервера в следующем сообщении:',
      Markup.keyboard([MarkupCallbackButtonName.LeaveScene]).resize(),
    );

    ctx.wizard.next();
  }

  @Hears(new RegExp(MarkupCallbackButtonName.LeaveScene))
  @TelegrafAuthUser()
  async onSceneLeave(@Ctx() ctx: WizardContext) {
    await ctx.reply('Вы вышли из установки URL', Markup.removeKeyboard());
    await ctx.scene.leave();
  }

  @On('message')
  @TelegrafAuthUser()
  @WizardStep(2)
  async onUrl(@Ctx() ctx: WizardContext, @Message() msg: { text: string }) {
    if (!msg?.text) {
      await ctx.reply('URL не обнаружен. Повторите попытку');
      return;
    }

    const serverUrl = msg.text;
    try {
      new url.URL(serverUrl);
      this.actionService.setActionServerUrl(serverUrl);

      await ctx.reply('Новый URL сервер установлен', Markup.removeKeyboard());
      await ctx.scene.leave();
    } catch {
      await ctx.reply('Невалидный URL. Повторите попытку');
      return;
    }
  }
}
