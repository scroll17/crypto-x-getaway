import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MarkdownHelper } from '../../common/helpers';
import { NgrokService } from '../../../ngrok/ngrok.service';

@Injectable()
export class CryptoXBotService {

  constructor(
    private readonly configService: ConfigService,
    private readonly ngrokService: NgrokService,
  ) {}

  public async getServerUrl() {
    const url = await this.ngrokService.connect({
      port: this.configService.getOrThrow<number>('ports.http'),
      proto: 'http'
    });

    const urlMsg = MarkdownHelper.bold('URL');
    const urlText = MarkdownHelper.monospaced(url);

    return `${urlMsg}: ${urlText}`;
  }
}
