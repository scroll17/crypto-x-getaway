import { Module } from '@nestjs/common';
import { ProtectionService } from './protection.service';

@Module({
  providers: [ProtectionService],
  exports: [ProtectionService]
})
export class ProtectionModule {}
