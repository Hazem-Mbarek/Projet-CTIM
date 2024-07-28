import { Module } from '@nestjs/common';
import { TravauxService } from './travaux.service';
import { TravauxController } from './travaux.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[JwtModule,PassportModule],
  controllers: [TravauxController],
  providers: [TravauxService],
})
export class TravauxModule {}
