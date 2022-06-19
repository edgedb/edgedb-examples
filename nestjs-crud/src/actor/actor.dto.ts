import { IsNotEmpty, IsBoolean, IsInt } from "class-validator";
import { PartialType, OmitType } from "@nestjs/swagger";

export class CreateActorDto {
  @IsNotEmpty()
  name!: string;

  @IsInt()
  age?: number;

  @IsInt()
  height?: number;

  @IsBoolean()
  isDeceased?: boolean;
}

// We want to make the mandatory 'name' type optional during PUT request.
// So, we'll remove it from the 'CreateActorDto' class and redefine it.
class _UpdateActorDto extends OmitType(CreateActorDto, ["name"]) {
  name?: string;
}

export class UpdateActorDto extends PartialType(_UpdateActorDto) {}
