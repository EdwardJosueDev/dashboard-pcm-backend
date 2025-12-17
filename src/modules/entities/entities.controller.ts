// src/entities/entities.controller.ts
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EntitiesService } from './entities.service';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  findAll() {
    return this.entitiesService.findAll();
  }
 
  @Get('combo')
  findAllCombo(@Query('search') search: string) {
    return this.entitiesService.findAllCombo(search);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.entitiesService.findOne(id);
  }
}