import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailjetModule } from 'nest-mailjet';
import { PdfModule } from 'src/pdf/pdf.module';

@Module({
  imports: [
    MailjetModule.registerAsync({
      useFactory: () => ({
          apiKey: process.env.MAILJET_API_KEY,
          apiSecret: process.env.MAILJET_API_SECRET,
      }),
  }),
  PdfModule
  ],
  //2f0b2b0c1204a44264e32d1167fdf1df
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule {}
