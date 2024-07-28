import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { ImputationsModule } from './imputations/imputations.module';
import { PiecesModule } from './pieces/pieces.module';
import { ExpertisesModule } from './expertises/expertises.module';
import { AppareilsModule } from './appareils/appareils.module';
import { TravauxModule } from './travaux/travaux.module';
import { MysqlModule } from 'nestjs-mysql';
import { PdfModule } from './pdf/pdf.module';
@Global()
@Module({
  imports: [MysqlModule.forRoot({
    host: process.env.DB_HOST, 
      port: parseInt(process.env.DB_PORT, 10),     
      user: process.env.DB_USER,  
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_DATABASE,  
  }),
  AuthModule,PdfModule,PrismaModule,UtilisateursModule, ImputationsModule, PiecesModule, ExpertisesModule, AppareilsModule, TravauxModule],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
