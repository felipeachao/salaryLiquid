import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { SalaryDto } from './salary.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Salario')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query() salary: SalaryDto) {
    return this.appService.salary(salary);
  }
}
