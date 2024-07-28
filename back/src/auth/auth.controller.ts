import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request,Response } from 'express'; 
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('signin')
  signin(@Body() dto:AuthDto, @Req() req,@Res() res){
    return this.authService.signin(dto,req,res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signup')
  signup(@Body() dto:AuthDto, @Req() req){
    return this.authService.signup(dto,req);
  }


  @Get('signout')
  signout(@Req() req,@Res() res){
    return this.authService.signout(req,res);
  }
 
}
