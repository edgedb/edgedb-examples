import { Injectable } from '@nestjs/common';
import { CreateActorDto, UpdateActorDto } from './actor.dto';

@Injectable()
export class ActorService {
  async getActors() {
    return 'Hello World!';
  }

  async postActor(body: CreateActorDto) {
    return body;
  }

  async putActors(name: string, body: UpdateActorDto){
    return [body];
  }

  async deleteActors(name: string) {
    return null;
  }
}
