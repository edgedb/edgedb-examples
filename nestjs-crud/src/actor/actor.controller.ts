import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
} from '@nestjs/common';

import { CreateActorDto } from './actor.dto';
import { ActorService } from './actor.service';

@Controller("actors")
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get()
  async getActors(@Query('name') name: string) {
    return this.actorService.getActors();
  }

  @Post()
  async postActor(@Body() body: CreateActorDto) {
    return await this.actorService.postActor(body);
  }

  @Put()
  async putActors(
    @Query('name') name: string,
    @Body() body: Partial<CreateActorDto>,
  ) {
    return this.actorService.putActors(name, body);
  }

  @Delete()
  async deleteActors(@Query('name') name: string) {
    return this.actorService.deleteActors(name);
  }
}
