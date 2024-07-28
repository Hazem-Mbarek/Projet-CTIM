import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

//@UseGuards(JwtAuthGuard)
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService,) {}

 
  @Get(':num_exp')
  async generatePdf(@Res() res: Response,@Param('num_exp') num_exp: number): Promise<void> {
    await this.pdfService.fillPdfTemplate(res,+num_exp);
  }
}
