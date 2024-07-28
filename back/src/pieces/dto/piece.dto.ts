import { IsNotEmpty, IsString } from 'class-validator';
export class PieceDto {

    @IsNotEmpty()
    @IsString()
  public code_piece:string;

  @IsNotEmpty()
  @IsString()
  public libelle:string;

  @IsNotEmpty()
  @IsString()
  public type: string;

}