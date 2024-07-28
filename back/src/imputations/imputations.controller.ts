import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ImputationsService } from './imputations.service';
import { CreateImputationDto } from './dto/imputation.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('imputations')
export class ImputationsController {
  constructor(private readonly imputationsService: ImputationsService) {}
  
  @Post('ajout')
  create(@Body() createImputationDto: CreateImputationDto) {
    return this.imputationsService.create(createImputationDto);
  }

  @Get()
  findAll() {
    return this.imputationsService.findAll();
  }

  @Get('unique')
  findUR() {
    return this.imputationsService.findUR();
  }

  @Get(':UR/:section')
  findOne(@Param('UR') UR: string, @Param('section') section: string) {
    return this.imputationsService.findOne(+UR,+section);//convert route string to a number
  }

  @Get(':UR')
  findmany(@Param('UR') UR: string) {
    return this.imputationsService.findmany(+UR);
  }

  
}
