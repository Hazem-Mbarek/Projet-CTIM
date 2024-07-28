import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PieceDto } from './dto/piece.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { imputations } from '@prisma/client';



@Injectable()
export class PiecesService {
  //constructor(private prisma: PrismaService, private jwt:JwtService){}
  constructor(@InjectClient() private readonly connection: Connection, private jwt:JwtService){}


  async create(dto: PieceDto): Promise<string> {
    const { code_piece, libelle, type } = dto;
  
    const existingpiece = await this.connection.query(
      'SELECT * FROM pieces WHERE code_piece = ?',
      [code_piece]
    );

   /* if (existingImputation) {
      throw new BadRequestException('Imputation already exists');
    }*/
  
    
    await this.connection.query(
      'INSERT INTO pieces (code_piece, libelle, type) VALUES (?, ?, ?)',
      [code_piece, libelle, type]
    );
  
    return 'piece successfully added';
  }


  async findAll(): Promise<imputations[]> {
    const pieces = await this.connection.query('SELECT * FROM pieces ');
    const results = Object.assign([{}], pieces[0]);

    return results;
  }


  async findOne(code_piece: string) {
    const rows = await this.connection.query(
      'SELECT * FROM pieces WHERE code_piece = ?',
      [code_piece]
    );

  /*  if (rows.length === 0) {
      throw new NotFoundException('Piece not found');
    }*/

    return rows[0];
  }



  async update(code_piece: string, dto: PieceDto) {
    // Check if the piece exists
    const existingPiece = await this.connection.execute(
      'SELECT * FROM pieces WHERE code_piece = ?',
      [code_piece]
    );

    if ((existingPiece as any).affectedRows === 0) {
      throw new NotFoundException(`Piece with code ${code_piece} not found`);
    }

    // Update the piece
    const result = await this.connection.execute(
      'UPDATE pieces SET libelle = ?, type = ? WHERE code_piece = ?',
      [dto.libelle, dto.type, code_piece]
    );

    /*if (result ) {
      throw new BadRequestException(`Failed to update piece with code ${code_piece}`);
    }*/

    // Return the updated piece
    const updatedPiece = await this.connection.execute(
      'SELECT * FROM pieces WHERE code_piece = ?',
      [code_piece]
    );

    return updatedPiece[0];
  }
  


  async remove(code_piece: string) {
    // Check if the piece exists
    /*console.log(code_piece)
    const existingPiece = await this.connection.execute(
      'SELECT * FROM pieces WHERE code_piece = ?',
      [code_piece]
    );

    if (existingPiece) {
      throw new NotFoundException(`Piece with code ${code_piece} not found`);
    }*/

    // Delete the piece
    await this.connection.execute(
      'DELETE FROM pieces WHERE code_piece = ?',
      [code_piece]
    );

    return 'Deleted successfully';
  }
  
}
