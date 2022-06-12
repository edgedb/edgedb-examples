import { Controller, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreateActorDto } from './actor.dto';
import { ActorService } from './actor.service';

@Controller()
export class ActorController {
  constructor(private readonly appService: ActorService) {}

  @Get()
  async getActors(@Query('name') name: string) {
    return this.appService.getHello();
  }

  @Post()
  async postActor(body: CreateActorDto) {
    return this.appService.getHello();
  }

  @Get()
  async putActors(body: Partial<CreateActorDto>) {
    return this.appService.getHello();
  }

  @Get()
  async deleteActors(@Query('name') name: string) {
    return this.appService.getHello();
  }
}
