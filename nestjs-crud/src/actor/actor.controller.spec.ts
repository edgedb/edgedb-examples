import { Test, TestingModule } from "@nestjs/testing";
import { ActorController } from "./actor.controller";
import { ActorService } from "./actor.service";

describe("AppController", () => {
  let appController: ActorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ActorController],
      providers: [ActorService],
    }).compile();

    appController = app.get<ActorController>(ActorController);
  });

  test('should return "Hello World!"', async () => {
    expect(await appController.getActors(undefined)).toBe("Hello World!");
  });
});
