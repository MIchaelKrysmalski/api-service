import { BeforeApplicationShutdown, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';
import { Browser } from 'puppeteer';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
    private twing: TwingEnvironment;
    private browser: Browser;
    constructor(){
        this.twing = new TwingEnvironment(
            new TwingLoaderFilesystem(__dirname + '/templates'),
        );
    }
    
    async generatePdf() {
        this.browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const template = await this.twing.load('test/test.twig');
        const html = await template.render({});
        const page = await this.browser.newPage();
        await page.setContent(html);
        let documentName = 'test';
        const pdf = await page.pdf({
            format: 'A4'
        });
        await page.close();
        const encoded = pdf.toString('base64');
        await this.browser.close();
        return {base64: encoded, name: documentName};
    }
}
