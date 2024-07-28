import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AppareilsService } from './appareils.service';
import {AppareilDto } from './dto/appareil.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

//@UseGuards(JwtAuthGuard)
@Controller('appareils')
export class AppareilsController {
  constructor(private readonly appareilsService: AppareilsService) {}

  @Post('ajout')
  create(@Body() appareilDto: AppareilDto) {
    return this.appareilsService.create(appareilDto);
  }

  @Get()
  findAll() {
    return this.appareilsService.findAll();
  }

  @Get(':code_app')
  findOne(@Param('code_app') code_app: string) {
    return this.appareilsService.findOne(code_app);
  }

  @Patch(':code_app')
  update(@Param('code_app') code_app: string, @Body() appareilDto: AppareilDto) {
    return this.appareilsService.update(code_app, appareilDto);
  }

  @Delete(':code_app')
  remove(@Param('code_app') code_app: string) {
    return this.appareilsService.remove(code_app);
  }
}
