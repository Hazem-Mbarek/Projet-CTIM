import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PiecesService } from './pieces.service';
import { PieceDto } from './dto/piece.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

//@UseGuards(JwtAuthGuard)
@Controller('pieces')
export class PiecesController {
  constructor(private readonly piecesService: PiecesService) {}

  @Post('ajout')
  create(@Body() pieceDto: PieceDto) {
    return this.piecesService.create(pieceDto);
  }

  @Get()
  findAll() {
    return this.piecesService.findAll();
  }

  @Get(':code_piece')
  findOne(@Param('code_piece') code_piece: string) {
    return this.piecesService.findOne(code_piece);
  }

  @Patch(':code_piece')
  update(@Param('code_piece') code_piece: string, @Body() pieceDto: PieceDto) {
    return this.piecesService.update(code_piece, pieceDto);
  }

  @Delete(':code_piece')
  remove(@Param('code_piece') code_piece: string) {
    return this.piecesService.remove(code_piece);
  }
}
