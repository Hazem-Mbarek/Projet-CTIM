import { Module } from '@nestjs/common';
import { ImputationsService } from './imputations.service';
import { ImputationsController } from './imputations.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MysqlModule } from 'nest-mysql';

@Module({
  imports:[ MysqlModule.forRoot({
    host: process.env.DB_HOST, 
      port: parseInt(process.env.DB_PORT, 10),     
      user: process.env.DB_USER,  
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_DATABASE,  
  }),
    JwtModule,PassportModule],
  controllers: [ImputationsController],
  providers: [ImputationsService],
})
export class ImputationsModule {}
