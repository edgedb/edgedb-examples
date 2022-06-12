import { Injectable } from '@nestjs/common';
import { CreateActorDto } from './actor.dto';

@Injectable()
export class ActorService {
  getHello(): string {
    return 'Hello World!';
  }

  postHello(body: CreateActorDto): string {
    return 'Hello World!';
  }

  putHello(name: string, body:Partial<CreateActorDto>): string {
    return 'Hello World!';
  }

  delteHello(): string {
    return 'Hello World!';
  }
}
