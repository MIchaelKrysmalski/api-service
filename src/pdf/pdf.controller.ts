import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags()
@Controller('pdf')
export class PdfController {}
