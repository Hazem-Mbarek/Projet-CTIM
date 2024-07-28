import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateImputationDto {
    @IsNotEmpty()
  @IsNumber()
  public UR:number;

  @IsNotEmpty()
  @IsNumber()
  public section:number;

  @IsNotEmpty()
  @IsString()
  public libelle: string;
}
