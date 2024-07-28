import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { InjectClient } from 'nest-mysql';
import { Connection } from 'mysql2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class PdfService {

    constructor(@InjectClient() private readonly connection: Connection, private jwt: JwtService,private prisma: PrismaService,) {}

  async fillPdfTemplate(res: Response,num_exp: number): Promise<void> {
    const pdfPath = path.resolve('src/pdf/utils/CTIM Expertise 2024.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);
    

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
 

    const { width, height } = firstPage.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;


// get expertise data and associated travaux
    const expertisefind = await this.prisma.expertises.findUnique({
      where: { num_exp },
    });
    const travauxfind = await this.prisma.travaux.findMany({
      where: { num_exp },
    });
   
    //********************************************************************************************************* */
//********************************************************************************************************* */
// printing data pieces and appareils
//********************************************************************************************************* */
    //********************************************************************************************************* */
    
    let x=0;
    let y=0;
    let z=0;
    let w1=0;
    let w2=0;

    const repetitioncheck:string[]=[];
    let exist=false;
    
    for (let i = 0; i < travauxfind.length; i++) {
      
    //check repetition of apps  
    if (repetitioncheck.includes(travauxfind[i].code_app)) {
      exist = true;
    }

    if(!exist){
      //NUM APPAREIL
    firstPage.drawText(travauxfind[i].code_app, {
      x: 440-x,
      y: height - 195,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    x=x+75;
    repetitioncheck.push(travauxfind[i].code_app);
    
  //****************************************************************** */  
// Nom des appareils
    const appareilname = await this.prisma.appareils.findUnique({ 
      where: { code_app:repetitioncheck[repetitioncheck.length-1]}, 
    });

    if(appareilname){ 
      firstPage.drawText(appareilname.designation, {
        x: 380-w1,
        y: height - 290+w2,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      if(w1==0){w1=220;}
      else{w2=w2-20}
      
  }
//****************************************************************** */  

  }




      //NUM PIECE
      firstPage.drawText(travauxfind[i].code_piece, {
        x: 300,
        y: height - 455+y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      z=z+1;
      //*********************************************************** */
      //libelle piece
      const piecelibelle = await this.prisma.pieces.findUnique({ 
        where: { code_piece:travauxfind[i].code_piece}, 
      });
  
      if(piecelibelle){ 
      firstPage.drawText(piecelibelle.libelle, {
        x: 400,
        y: height - 455+y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
    }
//*********************************************************** */
       //Rang
       firstPage.drawText(z.toString(), {
        x: 540,
        y: height - 455+y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      
      //Nombre de pieces
      firstPage.drawText(travauxfind[i].qte.toString(), {
        x: 165,
        y: height - 455+y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      y=y-30;

      
     
     
    }

//********************************************************************************************************* */
//********************************************************************************************************* */
//********************************************************************************************************* */
//********************************************************************************************************* */

    //NUM EXPERTISE
    firstPage.drawText(num_exp.toString(), {
      x:  90,
      y: height - 115,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });


   
//CREATING DATE FORMAT
const month = expertisefind.date_dps.getUTCMonth() + 1;
const day = expertisefind.date_dps.getUTCDate();
const year = expertisefind.date_dps.getUTCFullYear();
const formattedDate = `${month}/${day}/${year}`;

     //DATEE DPS
     firstPage.drawText(formattedDate.toString(), {
      x: 215,
      y: height - 228,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });


//CREATING DATE FORMAT
const month2 = expertisefind.date_exp.getUTCMonth() + 1;
const day2 = expertisefind.date_exp.getUTCDate();
const year2 = expertisefind.date_exp.getUTCFullYear();
const formattedDate2 = `${month}/${day}/${year}`;

     //DATEE expertise
     firstPage.drawText(formattedDate2.toString(), {
      x: 465,
      y: height - 745,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    


     //NUM DPS
     firstPage.drawText(expertisefind.num_dps.toString(), {
      x: 385,
      y: height - 228,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });


     //section
     firstPage.drawText(expertisefind.section.toString(), {
      x: 100,
      y: height - 228,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });


 

     //UR
     firstPage.drawText(expertisefind.UR.toString(), {
      x: 55,
      y: height - 228,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });


    const sectionlibelle = await this.prisma.imputations.findFirst({ 
      where: { section:expertisefind.section}, 
    });

        //libelle section
    firstPage.drawText(sectionlibelle.libelle, {
      x: 400,
      y: height - 163,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });









    
    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=filled-template.pdf');
    res.send(Buffer.from(pdfBytes));
  }
}
