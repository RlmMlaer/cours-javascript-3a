import { Book } from "../models/book.model";
import { BookCopy } from "../models/bookCopy.model";

export class BookCollectionService {
    public async getAllBookCopys(): Promise<BookCopy[]> {
        return BookCopy.findAll({
            include: [{
                model: Book,
                as: 'book'
            }]
        });
    }

    public async getBookCopyById(id: number): Promise<BookCopy | null> {
        return BookCopy.findByPk(id , {
            include: [{
                model: Book,
                as: 'book'
            }]
        });
    }

    public async getBookCopiesByBookId(bookId: number): Promise<BookCopy[] | null> {
        return BookCopy.findAll({
            where: { bookId: bookId },
            include: [{
                model: Book,
                as: 'book'
            }]
        });
    }

    public async createBookCopy(
        bookId: number,
        available: boolean,
        state: number
    ): Promise<void> {
        await BookCopy.create({ bookId: bookId, available: available, state: state });
    }

    public async deleteBookCopy(id: number): Promise<void> {
        const bookCopy = await BookCopy.findByPk(id);
        if (bookCopy) {
            await bookCopy.destroy();
        }
    }

    public async updateBookCopy(
        id: number,
        bookId?: number,
        available?: boolean,
        state?: number
    ): Promise<BookCopy | null> {
        const bookCopy = await BookCopy.findByPk(id);
        if (bookCopy) {
            if (bookId) bookCopy.bookId = bookId;
            if (available !== undefined) bookCopy.available = available;
            if (state !== undefined) bookCopy.state = state;
            await bookCopy.save();
            return bookCopy;
        }
        return null;
    }
}

export const bookCollectionService = new BookCollectionService();
