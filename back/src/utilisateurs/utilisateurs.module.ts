import { Module } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { UtilisateursController } from './utilisateurs.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PrismaService } from 'prisma/prisma.service';
import { MysqlModule } from 'nest-mysql';

@Module({
  imports:[ MysqlModule.forRoot({
    host: process.env.DB_HOST, 
      port: parseInt(process.env.DB_PORT, 10),     
      user: process.env.DB_USER,  
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_DATABASE,  
  }),],
  controllers: [UtilisateursController],
  providers: [UtilisateursService, JwtStrategy],
})
export class UtilisateursModule {}