import { Module } from '@nestjs/common';
import { CryptoXBotService } from "./crypto-x-bot.service";
import { CryptoXBotUpdate } from "./crypto-x-bot.update";

@Module({
  imports: [],
  providers: [CryptoXBotService, CryptoXBotUpdate],
  exports: [CryptoXBotService],
})
export class CryptoXBotModule {
}
