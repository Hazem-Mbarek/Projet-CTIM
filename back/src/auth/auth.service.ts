import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'; 
import { jwtSecret } from '../utils/constants'; 
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt:JwtService){}

    async signup(dto:AuthDto, req: Request){
        const{matricule,password,nom_prenom}=dto;

      // check if current user is connected as admin
      const decodedUserInfo = req.user as { matricule: number; nom_prenom: string };
      //if(decodedUserInfo.matricule==1){
        const userExists = await this.prisma.utilisateurs.findUnique({
            where: { matricule },
          });
       
          if (userExists) {
            throw new BadRequestException('matricule existe');
          }
         
          const mdp=await this.hashPassword(password);
          await this.prisma.utilisateurs.create(
            {
                data:{
                    matricule,
                    mdp,
                    nom_prenom,
                }
            }
          )

        return 'signup success'
     // }
      //else{throw new ForbiddenException();}
    }


    async signin(dto:AuthDto, req:Request,res:Response){
      //console.log(req.body);
        const{matricule,password,nom_prenom}=dto;
         //check matricule exists
         const foundUser = await this.prisma.utilisateurs.findUnique({
            where: { matricule, },
          });
      
          if (!foundUser) {
            throw new BadRequestException('matricule non existant');
          }
          
          const compareSuccess=await this.comparePasswords({password, hash:foundUser.mdp });
          
          
          if(!compareSuccess)
          {
            throw new BadRequestException('mdp fausse');
          }
       const token=await this.signToken(  {matricule:foundUser.matricule,nom_prenom:foundUser.nom_prenom});

       if (!token) {
        throw new ForbiddenException('Could not signin');
      }
      const cookie=res.cookie('token', token, {
        httpOnly: true,    // Prevents client-side JavaScript from accessing the cookie
        //secure: process.env.NODE_ENV === 'production',  // Ensures cookies are only sent over HTTPS in production
        //maxAge: 1000 * 60 * 60 * 24,  
      });
      
      const responseData={
        token:token,
        userdata:foundUser
      }
       return res.send(responseData);
       
    }



    async signout(req:Request,res:Response){
      res.clearCookie("token");
       res.send({message:"logged out successfully"})
    }


    async comparePasswords({ password, hash }: { password: string; hash: string }): Promise<boolean> {
      return bcrypt.compare(password, hash);
    }

    
    async hashPassword(mdp:string){
        const saltOrRounds = 10;

        return bcrypt.hash(mdp, saltOrRounds);
        
    }


    
    async signToken(args:{matricule:Number , nom_prenom:string}){
       //make sure it matches db to verify user 
      const payload = {
        matricule: args.matricule,
        nom_prenom: args.nom_prenom,
      };
  
      const token = await this.jwt.signAsync(payload, {
        secret: jwtSecret,
      });
  
      return token;
    }
  }


