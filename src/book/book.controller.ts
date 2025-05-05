import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/schemas/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @Roles(Role.Admin, Role.Moderator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    const books = await this.bookService.findAll(query);
    return books;
  }

  @Post('new')
  @UseGuards(AuthGuard('jwt'))
  async createBook(
    @Body() book: CreateBookDto,
    @Req() req: { user: User },
  ): Promise<Book> {
    //console.log('User ID:', req.user);

    const createdBook = await this.bookService.create(book, req.user);
    return createdBook;
  }

  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book | null> {
    const book = await this.bookService.findById(id);
    return book;
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book | null> {
    const updatedBook = await this.bookService.updateBook(id, book);
    return updatedBook;
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<Book | null> {
    const deletedBook = await this.bookService.deleteBook(id);
    return deletedBook;
  }
}
