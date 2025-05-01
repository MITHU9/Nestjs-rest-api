import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/book.schema';
import { User } from '../../auth/schemas/user.schema';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(Category, {
    message: 'Please select a valid category',
  })
  readonly category: Category;

  @IsEmpty({ message: 'User should not be provided in the request body.' })
  readonly user: User;
}
