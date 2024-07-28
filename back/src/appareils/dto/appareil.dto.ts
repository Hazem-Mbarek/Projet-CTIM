import { IsNotEmpty, IsString ,IsNumber,IsDate} from 'class-validator';
export class AppareilDto {
    @IsNotEmpty()
    @IsString()    
    public code_app:string;
   
    @IsNotEmpty()
    @IsNumber()
    public UR: number;
  
    @IsNotEmpty()
    @IsNumber()
    public section: number;

    @IsNotEmpty()
    @IsString()
    public type:string;
  
    @IsNotEmpty()
    @IsString()    
    public etat:string;

    @IsNotEmpty()
    @IsString()
    public existence:string;
  
    
   
    public classImp?:string;

    @IsNotEmpty()
    @IsNumber()
    public annee_acqui: number;

    
    @IsString()    
    public designation:string;
}
