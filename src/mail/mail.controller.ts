import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';

@ApiTags('mail')
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService){}
    @Get()
    sendMail() {
        this.mailService.sendMail();
    }
    resetPasswod() {

    }
    //frst day of the month -> last day of the month
    sendTimeEntryTable(userId:number, dateOfWork:Date) {

    }
}
