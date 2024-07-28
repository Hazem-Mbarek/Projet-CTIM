import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UtilisateursService } from './utilisateurs.service';

//@UseGuards(JwtAuthGuard)
@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly usersService: UtilisateursService) {}

  
  @Get(':matricule')
  getMyUser(@Param() params: { matricule: number }, @Req() req) {
    return this.usersService.getMyUser(params.matricule, req);
  }

  @Get()
  getUsers(@Req() req) {
    return this.usersService.getUsers(req);
  }
}