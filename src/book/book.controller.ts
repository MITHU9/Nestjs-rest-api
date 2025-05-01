import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    const books = await this.bookService.findAll(query);
    return books;
  }

  @Post('new')
  async createBook(@Body() book: CreateBookDto): Promise<Book> {
    const createdBook = await this.bookService.create(book);
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
