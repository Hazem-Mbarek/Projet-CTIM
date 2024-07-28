import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AppareilDto } from './dto/appareil.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { imputations } from '@prisma/client';

@Injectable()
export class AppareilsService {
  constructor(@InjectClient() private readonly connection: Connection, private jwt: JwtService) {}


  
  async create(dto: AppareilDto) {
    const { code_app, UR, section, type, etat, existence, classImp, annee_acqui, designation } = dto;
   
    const params = [
      code_app ?? null,
      UR ?? null,
      section ?? null,
      type ?? null,
      etat ?? null,
      existence ?? null,
      classImp ?? null,  
      annee_acqui ?? null,
      designation ?? null,
    ];
  

  
    /* 
    const [appareilExists] = await this.connection.execute(
      'SELECT * FROM appareils WHERE code_app = ?',
      [code_app]
    );
  
    if (appareilExists.length > 0) {
      throw new BadRequestException('Appareil already exists');
    }
    */
  
    await this.connection.execute(
      'INSERT INTO appareils (code_app, UR, section, type, etat, existence, classImp, annee_acqui, designation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      params
    );
  
    return 'Appareil added successfully';
  }


  async findAll() {
    const appareilslist = await this.connection.execute(
      'SELECT * FROM appareils'
    );
    const results = Object.assign([{}], appareilslist[0]);
    /*if (appareilslist ) {
      throw new NotFoundException('No expertises found');
    }*/

    return results ;
  }


  async findOne(code_app: string) {
    const appareilfind = await this.connection.execute(
      'SELECT * FROM appareils WHERE code_app = ?',
      [code_app]
    );

   /* if ((appareilfind as any[]).length === 0) {
      throw new NotFoundException('Expertise not found');
    }*/

    return { Appareil: appareilfind [0] };
  }



  async update(code_app: string, dto: AppareilDto) {
    /*const existingExpertise = await this.connection.execute(
      'SELECT * FROM expertises WHERE num_exp = ?',
      [num_exp]
    );

    if (existingExpertise) {
      throw new NotFoundException(`Expertise with num_exp ${num_exp} not found`);
    }
*/
    await this.connection.execute(
      'UPDATE appareils SET UR = ?, section = ?, type = ?, etat = ?, existence = ?,classImp=?, annee_acqui=?, designation=? WHERE code_app = ?',
      [dto.UR, dto.section, dto.type, dto.etat, dto.existence,dto.classImp ,dto.annee_acqui,dto.designation ,code_app]
    );

    const updatedAppareil = await this.connection.execute(
      'SELECT * FROM appareils WHERE code_app = ?',
      [code_app]
    );

    return { Appareil: (updatedAppareil)[0] };
  }

  async remove(code_app: string) {
    /*const existingExpertise = await this.connection.execute(
      'SELECT * FROM expertises WHERE num_exp = ?',
      [num_exp]
    );

    if (existingExpertise) {
      throw new NotFoundException(`Expertise with num_exp ${num_exp} not found`);
    }*/

    await this.connection.execute(
      'DELETE FROM appareils WHERE code_app = ?',
      [code_app]
    );

    return 'Deleted successfully';
  }
}