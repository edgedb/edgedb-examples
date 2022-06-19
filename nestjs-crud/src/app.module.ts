import { Module } from "@nestjs/common";
import { ActorController, HealthController } from "./actor/actor.controller";
import { ActorService } from "./actor/actor.service";

@Module({
  imports: [],
  controllers: [ActorController, HealthController],
  providers: [ActorService],
})
export class AppModule {}
