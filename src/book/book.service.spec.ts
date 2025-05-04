/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Book, Category } from './schemas/book.schema';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from '../auth/schemas/user.schema';

describe('BookService', () => {
  let bookService: BookService;
  let bookModel: Model<Book>;

  const mockBook = {
    title: 'new book8',
    description: 'nice book1',
    author: 'mithu',
    price: 300,
    category: Category.FANTASY,
    user: '6813b90b17205bf9aabb136b',
    _id: '6817879913a30cd947fd393f',
  };

  const mockUser = {
    _id: '6813b90b17205bf9aabb136b',
    name: 'mithu',
    email: 'mithu10@gmail.com',
  };

  const mockBookService = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    // updateBook: jest.fn(),
    // deleteBook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookModel = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('create', () => {
    it('should create a new book and return', async () => {
      const newBook = {
        title: 'new book8',
        description: 'nice book1',
        author: 'mithu',
        price: 300,
        category: Category.FANTASY,
      };

      jest
        .spyOn(bookModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockBook as any));

      const result = await bookService.create(
        newBook as CreateBookDto,
        mockUser as unknown as User,
      );

      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const mockQuery = { page: '1', keyword: 'book' };

      jest.spyOn(bookModel, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockBook]),
            }),
          }) as any,
      );

      const result = await bookService.findAll(mockQuery);

      expect(bookModel.find).toHaveBeenCalledWith({
        title: { $regex: mockQuery.keyword, $options: 'i' },
      });

      expect(result).toEqual([mockBook]);
    });
  });

  describe('findById', () => {
    it('should return a book if found', async () => {
      jest.spyOn(bookModel, 'findById').mockResolvedValue(mockBook as any);

      const result = await bookService.findById(mockBook._id);
      expect(bookModel.findById).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });

    it('should throw BadRequestException if ID format is invalid', async () => {
      const invalidId = 'invalid-id';

      const isValidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(bookService.findById(invalidId)).rejects.toThrowError(
        BadRequestException,
      );
      expect(isValidObjectIdMock).toHaveBeenCalledWith(invalidId);
      isValidObjectIdMock.mockRestore();
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(bookModel, 'findById').mockResolvedValue(null);

      await expect(bookService.findById(mockBook._id)).rejects.toThrowError(
        NotFoundException,
      );
      expect(bookModel.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });
});
