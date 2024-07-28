import { IsNotEmpty, IsString ,IsNumber,IsDate} from 'class-validator';
export class ExpertiseDto {
    //@IsNotEmpty()
    //@IsNumber()
  public num_exp:number;

  @IsNotEmpty()
  //@IsDate()    not regestering input in trial
  public date_exp:Date;

  @IsNotEmpty()
  @IsNumber()
  public num_dps:number;

  @IsNotEmpty()
  //@IsDate()    
  public date_dps:Date;

  @IsNotEmpty()
  @IsNumber()
  public UR: number;

  @IsNotEmpty()
  @IsNumber()
  public section: number;

  
  @IsString()
  public state?: string="en attente";
}
