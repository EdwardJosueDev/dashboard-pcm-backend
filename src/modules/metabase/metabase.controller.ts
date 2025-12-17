import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetabaseService } from './metabase.service';

@Controller('metabase')
export class MetabaseController {
  constructor(private readonly metabaseService: MetabaseService) {}

  @Get('dashboard')
  findAll() {
    const url = this.metabaseService.generateDashboardUrl();
    return { url };
  }
}
