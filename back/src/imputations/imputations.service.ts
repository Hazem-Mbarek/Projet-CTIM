import { BadRequestException,Injectable, NotFoundException } from '@nestjs/common';
import { CreateImputationDto } from './dto/imputation.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'; 
import { jwtSecret } from '../utils/constants'; 
import { Request, Response } from 'express';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { imputations } from '@prisma/client';



@Injectable()
export class ImputationsService {
  constructor(@InjectClient() private readonly connection: Connection){}
  

  async findAll(): Promise<imputations[]> {
    const imputations = await this.connection.query('SELECT * FROM imputations ');
    const results = Object.assign([{}], imputations[0]);
    console.log(results);

    return results;
  }

  async findUR(): Promise<imputations[]> {
    const imputations = await this.connection.query('SELECT DISTINCT UR FROM imputations');
    const results = Object.assign([{}], imputations[0]);
    console.log(results);

    return results;
  }

  async create(dto: CreateImputationDto): Promise<string> {
    const { UR, section, libelle } = dto;
  
    const existingImputation = await this.connection.query(
      'SELECT * FROM imputations WHERE UR = ? AND section = ?',
      [UR, section]
    );
    console.log(existingImputation);
   /* if (existingImputation) {
      throw new BadRequestException('Imputation already exists');
    }*/
  
    
    await this.connection.query(
      'INSERT INTO imputations (UR, section, libelle) VALUES (?, ?, ?)',
      [UR, section, libelle]
    );
  
    return 'Imputation successfully added';
  }
 


 


  async findOne(UR: number,section: number) {
   const imputationfind = await this.connection.execute(
      'SELECT * FROM imputations WHERE UR = ? and section=?',
      [UR,section]
    );

   /* if ((expertisefind as any[]).length === 0) {
      throw new NotFoundException('Expertise not found');
    }*/

      return { imputationfind: imputationfind [0] };
  }

  async findmany(UR: number) {
    const imputationfind = await this.connection.execute(
       'SELECT * FROM imputations WHERE UR = ?',
       [UR]
     );
       return { imputationfind: imputationfind  [0] };
   }


}
