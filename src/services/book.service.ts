import { CustomError } from "../middlewares/errorHandler";
import { Author } from "../models/author.model";
import { Book } from "../models/book.model";

export class BookService {
    public async getAllBooks(): Promise<Book[]> {
        return Book.findAll({
            include: [{
                model: Author,
                as: 'author'
            }]
        });
    }

    public async getBookById(id: number): Promise<Book | null> {
        return Book.findByPk(id , {
            include: [{
                model: Author,
                as: 'author'
            }]
        });
    }

    public async getBooksByAuthorId(authorId: number): Promise<Book[] | null> {
        return Book.findAll({
            where: { authorId: authorId },
            include: [{
                model: Author,
                as: 'author'
            }]
        });
    }

    public async createBook(
        title: string,
        publishYear: number,
        authorId: number,
        isbn: string
    ): Promise<Book> {
        let author : Author | null = await Author.findByPk(authorId);
        if (author === null) {
            let error : CustomError = new Error(`Author ${authorId} not found`);
            error.status = 404;
            throw error;
        }
        return Book.create({ title: title, publishYear: publishYear, authorId: authorId, isbn: isbn });
    }

    public async deleteBook(id: number): Promise<void> {
        const book = await Book.findByPk(id);
        if (book) {
            await book.destroy();
        }
    }

    public async updateBook(
        id: number,
        title?: string,
        publishYear?: number,
        authorId?: number,
        isbn?: string
    ): Promise<Book | null> {
        const book = await Book.findByPk(id);
        if (book) {
            if (title) book.title = title;
            if (publishYear) book.publishYear = publishYear;
            if (authorId) book.authorId = authorId;
            if (isbn) book.isbn = isbn;
            await book.save();
            return book;
        }
        return null;
    }
}

export const bookService = new BookService();
