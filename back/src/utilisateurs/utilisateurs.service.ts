import {
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { PrismaService } from 'prisma/prisma.service';
import { jwtSecret } from 'src/utils/constants';
  
  @Injectable()
  export class UtilisateursService {
    constructor(private prisma: PrismaService) {}
  
    async getMyUser(matricule: number, req: Request) {

      //token payload in req.user
      const decodedUserInfo = req.user as { matricule: number; nom_prenom: string };
      // matricule needs to be passed as number
      const foundUser = await this.prisma.utilisateurs.findUnique({ where: { matricule:Number(matricule) } });
      
   
      if (!foundUser) {
        throw new NotFoundException();
      }
  
      if (foundUser.matricule !== decodedUserInfo.matricule) {
      
        throw new ForbiddenException();
      }
  
      delete foundUser.mdp;
  
      return { user: foundUser };
    }
  
    async getUsers(req:Request) {
      const users = await this.prisma.utilisateurs.findMany({
        select: { matricule: true, mdp:true , nom_prenom: true },
      });
      console.log(users);
      const results = Object.assign([{}], users[0]);
     /* const decodedUserInfo = req.user as { matricule: number; nom_prenom: string };
      //verify admin
      if(decodedUserInfo.matricule!=1)
      {
        throw new ForbiddenException();
      }*/

      return users ;
    }
  }