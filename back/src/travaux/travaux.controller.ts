import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TravauxService } from './travaux.service';
import { TravauxDto } from './dto/travaux.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

//@UseGuards(JwtAuthGuard)
@Controller('travaux')
export class TravauxController {
  constructor(private readonly travauxService: TravauxService) {}

  @Post('ajout')
  create(@Body() travauxDto: TravauxDto) {
    return this.travauxService.create(travauxDto);
  }

  @Get()
  findAll() {
    return this.travauxService.findAll();
  }

  @Get(':num_exp/:code_app/:code_piece')
  findOne(@Param('num_exp') num_exp: number,
  @Param('code_app') code_app: string,
  @Param('code_piece') code_piece: string,) {
    return this.travauxService.findOne(+num_exp,code_app,code_piece);
  }


  @Get(':num_exp')
  findDetails(@Param('num_exp') num_exp: number) {
    return this.travauxService.Details(+num_exp);
  }

  @Get('history/:code_app')
  findAppHistory(@Param('code_app') code_app: string) {
    return this.travauxService.History(code_app);
  }

  @Patch(':num_exp/:code_app/:code_piece')
  update(@Param('num_exp') num_exp: number,@Param('code_app') code_app: string,@Param('code_piece') code_piece: string, @Body() travauxDto: TravauxDto) {
    return this.travauxService.update(+num_exp,code_app,code_piece ,travauxDto);
  }

  @Delete(':num_exp/:code_app/:code_piece')
  remove(@Param('num_exp') num_exp: number,
  @Param('code_app') code_app: string,
  @Param('code_piece') code_piece: string,) {
    return this.travauxService.remove(+num_exp,code_app,code_piece);
  }
}
