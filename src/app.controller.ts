import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  handle() {
    return {"hello": "world"};
  }
}
