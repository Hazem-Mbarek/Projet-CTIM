import { IsNotEmpty, IsString, IsEmail, Length, isInt, IS_INT, IsNumber } from 'class-validator';

//dto sets conditions controle de saisie
export class AuthDto {
  @IsNotEmpty()
  @IsNumber()
  public matricule:number;
 
  @IsNotEmpty()
  @IsString()
  @Length(3, 30, { message: 'Passowrd has to be at between 3 and 20 chars' })
  public password: string;
  //use non attribute name(to asign after hashing =>dto const)

  
  @IsNotEmpty()
  @IsString()
  public nom_prenom: string;
  
}