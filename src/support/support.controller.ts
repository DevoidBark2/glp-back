import { Controller, Post, Body } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateSupportDto } from './dto/update-support.dto';

@ApiTags('Support')
@Controller('')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('support')
  sendMsgInSupport(@Body() createSupportDto: CreateSupportDto) {
    return this.supportService.sendMsgInSupport(createSupportDto);
  }

  @Post('support/send-user')
  sendMsgFromSupport(@Body() updateSupportDto: UpdateSupportDto) {
    return this.supportService.sendMsgFromSupport(updateSupportDto);
  }
}
