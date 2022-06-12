import { IsNotEmpty, IsNumber } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class CreateActorDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  age?: number;

  @IsNumber()
  height?: number;
}

export class UpdateActorDto extends PartialType(CreateActorDto) {}
