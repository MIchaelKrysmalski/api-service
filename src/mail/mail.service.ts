import { TwingEnvironment, TwingLoaderFilesystem, TwingTemplate } from 'twing';
import { Injectable } from '@nestjs/common';
import { MailjetService } from 'nest-mailjet'
import { PdfService } from 'src/pdf/pdf.service';
@Injectable()
export class MailService {
    private readonly twing: TwingEnvironment
    constructor(
        private readonly mailService: MailjetService,
        private readonly pdfService: PdfService
    ) {
        this.twing = new TwingEnvironment(
            new TwingLoaderFilesystem(__dirname + '/templates'),
        )
    }
    async sendMail() {
        let template: TwingTemplate;
        template = await this.twing.load('/types/test/test.twig');
        let html = await template.render({user: { firstname: "michael", lastname: "krysmalski", email: "email@email.de"}})
        const pdf = await this.pdfService.generatePdf();
        const result = await this.mailService.send({
            Messages: [
                {
                    From: {
                        Email: 'realjupiter@hotmail.de',
                    },
                    To: [
                        {
                            Email: 'realjupiter@hotmail.de'
                        }
                    ],
                    Subject: 'nestjs test mail',
                    TextPart: 'nestjs test mail content',
                    Attachments: [
                        {
                            ContentType: 'application/pdf',
                            Filename: pdf.name,
                            Base64Content: pdf.base64,

                        }
                    ]
                }
            ]
        })
    }
}
