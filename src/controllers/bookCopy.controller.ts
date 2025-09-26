import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Security, Tags } from "tsoa";
import { BookCopyDTO } from "../dto/bookCopy.dto";
import { bookCollectionService } from "../services/bookCollection.service";
import { CustomError } from "../middlewares/errorHandler";
import { BookCopy } from "../models/bookCopy.model";

@Route("book-copies")
@Tags("bookCopies")
export class BookCopyController extends Controller {
    @Get("/")
    @Security("jwt", ["read:BookCopy"])
    public async getAllBookCopys(): Promise<BookCopyDTO[]> {
        return bookCollectionService.getAllBookCopys();
    }

    @Get("{id}")
    @Security("jwt", ["read:BookCopy"])
    public async getBookCopyById(@Path() id : number): Promise<BookCopyDTO | null> {
        let bookCopy : BookCopyDTO | null = await bookCollectionService.getBookCopyById(id);
        if (bookCopy === null) {
            let error : CustomError = new Error("BookCopy not found");
            error.status = 404;
            throw error;
        } else {
            return bookCopy;
        }
    }

    @Post("/")
    @Security("jwt", ["create:BookCopy"])
    public async createBookCopy(
        @Body() requestBody: BookCopyDTO
    ): Promise<void> {
        const { book, available, state } = requestBody;
        if (book?.id === undefined) {
            let error : CustomError = new Error("Book ID is required to create a book copy");
            error.status = 400;
            throw error;
        }
        return bookCollectionService.createBookCopy(book?.id , available, state);
    }

    @Delete("{id}")
    @Security("jwt", ["delete:BookCopy"])
    public async deleteBookCopy(@Path() id: number): Promise<void> {
        const bookCopy : BookCopyDTO | null = await bookCollectionService.getBookCopyById(id);
        if (bookCopy === null) {
            let error : CustomError = new Error("BookCopy not found");
            error.status = 404;
            throw error;
        } else {
            await bookCollectionService.deleteBookCopy(id);
        }
    }

    @Patch("{id}")
    public async updateBookCopy(
        @Path() id: number,
        @Body() requestBody: BookCopyDTO
    ): Promise<BookCopyDTO | null> {
        const { book, available, state } = requestBody;
        if (book?.id === undefined) {
            let error : CustomError = new Error("Book ID is required to update a book copy");
            error.status = 400;
            throw error;
        }
        const bookCopy : BookCopyDTO | null = await bookCollectionService.updateBookCopy(id, book?.id , available, state);
        if (bookCopy === null) {
            let error : CustomError = new Error("BookCopy not found");
            error.status = 404;
            throw error;
        } else {
            return bookCopy;
        }
    }
}
