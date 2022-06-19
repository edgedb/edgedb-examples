import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
} from "@nestjs/common";

import { CreateActorDto, UpdateActorDto } from "./actor.dto";
import { ActorService } from "./actor.service";

@Controller("actors")
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get()
  async getActors(@Query("name") name: string) {
    return this.actorService.getActors(name);
  }

  @Post()
  async postActor(@Body() body: CreateActorDto) {
    return await this.actorService.postActor(body);
  }

  @Put()
  async putActors(@Query("name") name: string, @Body() body: UpdateActorDto) {
    return this.actorService.putActors(name, body);
  }

  @Delete()
  async deleteActors(@Query("name") name: string) {
    return this.actorService.deleteActors(name);
  }
}

// Healthcheck.
@Controller("health-check")
export class HealthController {
  @Get()
  async getHealth() {
    return { ok: true };
  }
}
