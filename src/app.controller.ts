import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('默认')
export class AppController {

  @Get()
  index() {
    return 'index'
  }

  @Get('env')
  env() {
    return process.env.NODE_ENV
  }
}
