import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { ExpertisesModule } from 'src/expertises/expertises.module';
import { TravauxModule } from 'src/travaux/travaux.module';
import { MysqlModule } from 'nest-mysql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [MysqlModule.forRoot({
    host: process.env.DB_HOST, 
      port: parseInt(process.env.DB_PORT, 10),     
      user: process.env.DB_USER,  
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_DATABASE,  
  }),JwtModule,PassportModule,ExpertisesModule, TravauxModule,PrismaModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
