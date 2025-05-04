import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: mongoose.Model<Book>,
  ) {}

  async create(book: Book, user: User): Promise<Book> {
    const data = Object.assign(book, {
      user: user._id,
    });
    const res = await this.bookModel.create(data);
    return res;
  }

  async findAll(query: Query): Promise<Book[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keywords = query.keyword
      ? {
          title: { $regex: query.keyword, $options: 'i' },
        }
      : {};

    const books = await this.bookModel
      .find({ ...keywords })
      .limit(resPerPage)
      .skip(skip);
    return books;
  }

  async findById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException(`Invalid ID format`);
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
