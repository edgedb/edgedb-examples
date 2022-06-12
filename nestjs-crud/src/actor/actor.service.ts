import { Injectable } from '@nestjs/common';
import { CreateActorDto } from './actor.dto';

@Injectable()
export class ActorService {
  async getHello() {
    return 'Hello World!';
  }

  async postHello(body: CreateActorDto) {
    return 'Hello World!';
  }

  async putHello(name: string, body:Partial<CreateActorDto>) {
    return 'Hello World!';
  }

  async delteHello() {
    return 'Hello World!';
  }
}
