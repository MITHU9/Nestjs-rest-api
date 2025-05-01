import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: mongoose.Model<Book>,
  ) {}

  async create(book: Book): Promise<Book> {
    const createdBook = new this.bookModel(book);
    return createdBook.save();
  }

  async findAll(): Promise<Book[]> {
    const books = await this.bookModel.find();
    return books;
  }

  async findById(id: string): Promise<Book | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException(`Book not found`);
    }

    return book;
  }

  async updateBook(id: string, book: UpdateBookDto): Promise<Book | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const res = await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });

    if (!res) {
      throw new NotFoundException(`Book not found`);
    }

    return res;
  }

  async deleteBook(id: string): Promise<Book | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const res = await this.bookModel.findByIdAndDelete(id);

    if (!res) {
      throw new NotFoundException(`Book not found`);
    }

    return res;
  }
}
