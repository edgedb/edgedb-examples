import { Module } from "@nestjs/common";
import { ActorController } from "./actor/actor.controller";
import { ActorService } from "./actor/actor.service";

@Module({
  imports: [],
  controllers: [ActorController],
  providers: [ActorService],
})
export class AppModule {}
