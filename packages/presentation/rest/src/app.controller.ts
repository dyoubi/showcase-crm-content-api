import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
  ) { }


  @Get('status')
  @HealthCheck()
  status() {
    return this.health.check([]);
  }
}
