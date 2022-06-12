import { IsNotEmpty, IsNumber, IsBoolean } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class CreateActorDto {
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  age?: number;

  @IsNumber()
  height?: number;

  @IsBoolean()
  isDeceased?: boolean;
}

export class UpdateActorDto extends PartialType(CreateActorDto) {}
