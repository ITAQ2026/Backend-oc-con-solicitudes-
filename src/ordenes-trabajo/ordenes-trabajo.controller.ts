import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdenesTrabajoService } from './ordenes-trabajo.service';

@Controller('api/ordenes-trabajo')
export class OrdenesTrabajoController {
  constructor(private readonly otService: OrdenesTrabajoService) {}

  @Get()
  findAll() {
    return this.otService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.otService.create(data);
  }
}