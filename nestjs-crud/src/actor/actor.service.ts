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
      filter: e.op(actor.name, "ilike", e.str(`%${name}%`)),
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
    const queryCreate = e.insert(e.Actor, {
      name: body.name,
      age: body?.age,
      height: body?.height,
      is_deceased: body?.isDeceased,
    });

    const queryDisplay = e.select(queryCreate, () => ({
      id: true,
      name: true,
      age: true,
      height: true,
      is_deceased: true,
    }));
    return await queryDisplay.run(client);
  }

  async putActors(name: string, body: UpdateActorDto) {
    // Return an empty list if no filter 'name' is provided.
    if (!name) {
      return [];
    }
    const queryUpdate = e.update(e.Actor, (actor) => ({
      filter: e.op(actor.name, "=", e.str(name)),
      set: {
        name: body?.name ? body.name : actor.name,
        age: body?.age ? body.age : actor.age,
        height: body?.height ? body.height : actor.height,
        is_deceased: body?.isDeceased ? body.isDeceased : actor.is_deceased,
      },
    }));

    const queryDisplay = e.select(queryUpdate, (actor) => ({
      id: true,
      name: true,
      age: true,
      height: true,
      is_deceased: true,
      order_by: [
        {
          expression: actor.name,
          direction: e.ASC,
          empty: e.EMPTY_LAST,
        },
      ],
    }));

    return await queryDisplay.run(client);
  }

  async deleteActors(name: string) {
    // Return an empty list if no filter 'name' is provided.
    if (!name) {
      return [];
    }
    const queryDelete = e.delete(e.Actor, (actor) => ({
      filter: e.op(actor.name, "=", name),
    }));
    const queryDisplay = e.select(queryDelete, (actor) => ({
      id: true,
      name: true,
      age: true,
      height: true,
      is_deceased: true,
      order_by: [
        {
          expression: actor.name,
          direction: e.ASC,
          empty: e.EMPTY_LAST,
        },
      ],
    }));

    return await queryDisplay.run(client);
  }
}
