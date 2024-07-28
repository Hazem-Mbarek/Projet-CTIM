import { IsNotEmpty, IsString ,IsNumber,IsDate} from 'class-validator';
export class TravauxDto {
    @IsNotEmpty()
    @IsNumber()
  public num_exp:number;

  @IsNotEmpty()
  @IsString()   
  public code_app:string;

  @IsNotEmpty()
  @IsString()   
  public code_piece:string;

  @IsNotEmpty()
  @IsNumber()
  public qte: number;

}
