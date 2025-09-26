import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Security, Tags } from "tsoa";
import { BookDTO } from "../dto/book.dto";
import { bookService } from "../services/book.service";
import { CustomError } from "../middlewares/errorHandler";
import { Book } from "../models/book.model";
import { bookCollectionService } from "../services/bookCollection.service";
import { BookCopyDTO } from "../dto/bookCopy.dto";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
    @Get("/")
    @Security("jwt", ["read:Book"])
    public async getAllBooks(): Promise<BookDTO[]> {
        return bookService.getAllBooks();
    }

    @Get("{id}")
    @Security("jwt", ["read:Book"])
    public async getBookById(@Path() id: number): Promise<BookDTO | null> {
        let book : Book | null = await bookService.getBookById(id);
        if (book === null) {
            let error : CustomError = new Error("Book not found");
            error.status = 404;
            throw error;
        } else {
            return book;
        }
    }

    @Get("{id}/book-copies")
    @Security("jwt", ["read:Book"])
    public async getBookCopiesByBookId(@Path() id: number): Promise<BookCopyDTO[] | null> {
        const book : Book | null = await bookService.getBookById(id);
        if (book === null) {
            let error : CustomError = new Error("Book not found");
            error.status = 404;
            throw error;
        }
        return bookCollectionService.getBookCopiesByBookId(id);
    }

    @Post("/")
    @Security("jwt", ["create:Book"])
    public async createBook(
        @Body() requestBody: BookDTO
    ): Promise<BookDTO> {
        const { title, publishYear, author, isbn } = requestBody;
        if (author?.id === undefined) {
            let error : CustomError = new Error("Author ID is required to create a book");
            error.status = 400;
            throw error;
        }
        return bookService.createBook(title, publishYear, author?.id , isbn);
    }

    @Delete("{id}")
    @Security("jwt", ["delete:Book"])
    public async deleteBook(@Path() id: number): Promise<void> {
        const bookCopies: BookCopyDTO[] | null = await bookCollectionService.getBookCopiesByBookId(id);
        if (bookCopies === null) {
            let error : CustomError = new Error("Book not found");
            error.status = 404;
            throw error;
        } else if (bookCopies.length > 0) {
            let error : CustomError = new Error("Cannot delete book with associated book copies");
            error.status = 400;
            throw error;
        }
        await bookService.deleteBook(id);
    }

    @Patch("{id}")
    @Security("jwt", ["update:Book"])
    public async updateBook(
        @Path() id: number,
        @Body() requestBody: BookDTO
    ): Promise<BookDTO | null> {
        const { title, publishYear, author, isbn } = requestBody;
        if (author?.id === undefined) {
            let error : CustomError = new Error("Author ID is required to update a book");
            error.status = 400;
            throw error;
        }
        const book : Book | null = await bookService.updateBook(id, title, publishYear, author?.id , isbn);
        if (book === null) {
            let error : CustomError = new Error("Book not found");
            error.status = 404;
            throw error;
        } else {
            return book;
        }
    }
}
