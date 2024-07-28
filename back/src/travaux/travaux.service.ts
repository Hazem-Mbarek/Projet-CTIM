import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TravauxDto } from './dto/travaux.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class TravauxService {
  constructor(private prisma: PrismaService, private jwt:JwtService){}

    
  async create(travauxDto:TravauxDto) {
    const{num_exp,code_app,code_piece,qte}=travauxDto;
    const travauxexiste = await this.prisma.travaux.findUnique({
      where: { num_exp,code_app,code_piece },
    });
    if(travauxexiste)
    {
      throw new BadRequestException('travaux existe');
    }
    await this.prisma.travaux.create(
      {
          data:{
            num_exp,
            code_app,
            code_piece,
            qte,
            
          }
      }
    )
    return 'ajout travaux success'
  }

  async findAll() {
    const travauxlist = await this.prisma.travaux.findMany({
      select: { num_exp: true, code_app: true,code_piece:true,qte: true },
    });
    if (!travauxlist) {
      throw new NotFoundException('travaux not found');
    }
    return {travauxlist};
  }

  async Details(num_exp: number) {
    const travauxfind = await this.prisma.travaux.findMany({
      where: { num_exp },
    });
    if (!travauxfind) {
      throw new NotFoundException('travaux not found');
    }
    return travauxfind;
  }


  async History(code_app: string) {
    const travauxfind = await this.prisma.travaux.findMany({
      where: { code_app },
    });
    if (!travauxfind) {
      throw new NotFoundException('travaux not found');
    }
    return travauxfind;
  }




  async findOne(num_exp: number,code_app:string,code_piece:string) {
    const travauxfind = await this.prisma.travaux.findMany({
      where: { num_exp,code_app,code_piece },
    });
    if (!travauxfind) {
      throw new NotFoundException('travaux not found');
    }
    return {travauxfind};
  }

  async update(num_exp2: number, code_app2: string, code_piece2: string, travauxDto: TravauxDto) {
    const{num_exp,code_app,code_piece,qte}=travauxDto;
    const travauxexiste = await this.prisma.travaux.findUnique({
      where: {num_exp,code_app,code_piece },
    });
    if(!travauxexiste)
    {
      throw new BadRequestException('travaux n existe pas');
    }
    try {
      const travaux = await this.prisma.travaux.update({
        where: {
          num_exp: num_exp2,
          code_app: code_app2,
          code_piece: code_piece2,
        },
        data: {
          ...travauxDto,
        },
      });
      return "travaux updated successfully";
    } catch (error) {
     
      throw error;
    }
  }
  

  async remove(num_exp: number,code_app:string,code_piece:string) {
    try {
      const travaux = await this.prisma.travaux.delete({
        where: {
          num_exp: num_exp,
          code_app: code_app,
          code_piece: code_piece,
        }
      });
      
      return "deleted successfully";
    } catch (error) {
      console.error(error);
      throw new NotFoundException(`travaux with num ${num_exp} not found`);
    }
  }
}
