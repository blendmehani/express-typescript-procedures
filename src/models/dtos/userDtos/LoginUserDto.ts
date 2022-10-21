import {IsString, IsNotEmpty, MinLength, MaxLength} from 'class-validator'
import {Transform, TransformFnParams} from "class-transformer";

export class LoginUserDto {
    @IsString()
    @MinLength(5)
    @MaxLength(10)
    @IsNotEmpty()
    @Transform(({value}: TransformFnParams) => value?.trim())
    username: string

    @IsString()
    @MinLength(5)
    @MaxLength(10)
    @IsNotEmpty()
    password: string
}