import { Injectable } from "@nestjs/common";
import { CreateActorDto, UpdateActorDto } from "./actor.dto";
import { createClient } from "edgedb";
import e from "dbschema/edgeql-js"; // auto-generated code

const client = createClient();

@Injectable()
export class ActorService {
  async getActors(name?: string) {
    if (!name) {
      const query = e.select(e.Actor, (actor) => ({
        id: true,
        name: true,
        age: true,
        height: true,
        order_by: [
          {
            expression: actor.name,
            direction: e.ASC,
            empty: e.EMPTY_LAST,
          },
        ],
      }));
      return await query.run(client);
    }
    const query = e.select(e.Actor, (actor) => ({
      id: true,
      name: true,
      age: true,
      height: true,
      filter: e.op(actor.name, "=", name),
      order_by: [
        {
          expression: actor.name,
          direction: e.ASC,
          empty: e.EMPTY_LAST,
        },
      ],
    }));
    return await query.run(client);
  }

  async postActor(body: CreateActorDto) {
    const queryCreate = e
      .insert(e.Actor, {
        name: body.name,
        age: body?.age,
        height: body?.height,
        is_deceased: body?.isDeceased,
      })
      .unlessConflict();

    const resultCreate = await queryCreate.run(client);
    const queryDisplay = e.select(e.Actor, (actor) => ({
      id: true,
      name: true,
      age: true,
      height: true,
      filter: e.op(actor.id, "=", e.uuid(resultCreate!.id)),
    }));
    return await queryDisplay.run(client);
  }

  async putActors(name: string, body: UpdateActorDto) {
    return null;
  }

  async deleteActors(name: string) {
    return null;
  }
}
