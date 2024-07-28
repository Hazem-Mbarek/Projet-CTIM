import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExpertiseDto } from './dto/expertise.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { imputations } from '@prisma/client';


@Injectable()
export class ExpertisesService {
  constructor(@InjectClient() private readonly connection: Connection, private jwt: JwtService,private prisma: PrismaService) {}

  async create(dto: ExpertiseDto) {
    const { num_exp, date_exp, num_dps, date_dps, UR, section,state } = dto;
    

      const imputationExists = await this.connection.execute(
        'SELECT * FROM imputations WHERE UR = ? AND section = ?',
        [UR, section]
      );

      if (imputationExists) {
        throw new BadRequestException('Imputation non existante');
      }

    await this.connection.execute(
      'INSERT INTO expertises ( date_exp, num_dps, date_dps, UR, section,state) VALUES (?, ?, ?, ?, ?,?)',
      [ date_exp, num_dps, date_dps, UR, section,state]
    );
    const lastnumexp = await this.connection.execute(
      'SELECT num_exp FROM expertises ORDER BY num_exp DESC LIMIT 1'
    );
  
    return lastnumexp[0];
  }


  async findAll(): Promise<ExpertiseDto[]> {
    const expertiselist = await this.prisma.expertises.findMany();
    console.log("list:", expertiselist);

    if (!expertiselist || expertiselist.length === 0) {
      throw new NotFoundException('No expertises found');
    }

    return expertiselist;
  }

  
  async findOne(num_exp: number) {
    const expertisefind = await this.connection.execute(
      'SELECT * FROM expertises WHERE num_exp = ?',
      [num_exp]
    );

   /* if ((expertisefind as any[]).length === 0) {
      throw new NotFoundException('Expertise not found');
    }*/

    return expertisefind [0] ;
  }

  async update(num_exp: number, dto: ExpertiseDto) {
    /*const existingExpertise = await this.connection.execute(
      'SELECT * FROM expertises WHERE num_exp = ?',
      [num_exp]
    );

    if (existingExpertise) {
      throw new NotFoundException(`Expertise with num_exp ${num_exp} not found`);
    }
*/
    await this.connection.execute(
      'UPDATE expertises SET date_exp = ?, num_dps = ?, date_dps = ?, UR = ?, section = ? WHERE num_exp = ?',
      [dto.date_exp, dto.num_dps, dto.date_dps, dto.UR, dto.section, num_exp]
    );

    const updatedExpertise = await this.connection.execute(
      'SELECT * FROM expertises WHERE num_exp = ?',
      [num_exp]
    );

    return { updatedExpertise: (updatedExpertise)[0] };
  }

  async remove(num_exp: number) {
    /*const existingExpertise = await this.connection.execute(
      'SELECT * FROM expertises WHERE num_exp = ?',
      [num_exp]
    );

    if (existingExpertise) {
      throw new NotFoundException(`Expertise with num_exp ${num_exp} not found`);
    }*/

    await this.connection.execute(
      'DELETE FROM expertises WHERE num_exp = ?',
      [num_exp]
    );

    return 'Deleted successfully';
  }


async confirm(num_exp: number) {
  await this.connection.execute(
    'UPDATE expertises SET state=? WHERE num_exp = ?',
    ["confirme", num_exp]
  );

  const confirmedExpertise = await this.connection.execute(
    'SELECT * FROM expertises WHERE num_exp = ?',
    [num_exp]
  );

  return { confirmedExpertise: (confirmedExpertise)[0] };
}

}