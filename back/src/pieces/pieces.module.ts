import { Module } from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { PiecesController } from './pieces.controller';
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
  controllers: [PiecesController],
  providers: [PiecesService],
})
export class PiecesModule {}
