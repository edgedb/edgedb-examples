import { Controller, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreateActorDto } from './actor.dto';
import { ActorService } from './actor.service';

@Controller()
export class ActorController {
  constructor(private readonly appService: ActorService) {}

  @Get()
  getActors(@Query('name') name: string): string {
    return this.appService.getHello();
  }

  @Post()
  postActor(body: CreateActorDto): string {
    return this.appService.getHello();
  }

  @Get()
  putActors(body: Partial<CreateActorDto>): string {
    return this.appService.getHello();
  }

  @Get()
  deleteActors(@Query('name') name: string): string {
    return this.appService.getHello();
  }
}
