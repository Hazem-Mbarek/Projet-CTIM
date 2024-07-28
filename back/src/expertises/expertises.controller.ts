import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { ExpertisesService } from './expertises.service';
import { ExpertiseDto } from './dto/expertise.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('expertises')
export class ExpertisesController {
  constructor(private readonly expertisesService: ExpertisesService) {}

  @Post('ajout')
  create(@Body() expertiseDto: ExpertiseDto) {
    return this.expertisesService.create(expertiseDto);
  }

  @Patch(':num_exp/confirm')
  confirm(@Param('num_exp') num_exp: number) {
    return this.expertisesService.confirm(num_exp);
  }

  @Get()
  findAll() {
    
    return this.expertisesService.findAll();
  }

  @Get(':num_exp')
  findOne(@Param('num_exp') num_exp: number) {
    return this.expertisesService.findOne(num_exp);
  }

  @Patch(':num_exp')
  update(@Param('num_exp') num_exp: number, @Body() expertiseDto: ExpertiseDto) {
    return this.expertisesService.update(num_exp, expertiseDto);
  }

  @Delete(':num_exp')
  remove(@Param('num_exp') num_exp: number) {
    return this.expertisesService.remove(num_exp);
  }
}
