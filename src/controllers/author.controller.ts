import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch, Security } from "tsoa";
import { authorService } from "../services/author.service";
import { AuthorDTO } from "../dto/author.dto";
import { Author } from "../models/author.model";
import { CustomError } from "../middlewares/errorHandler";
import { bookService } from "../services/book.service";
import { BookDTO } from "../dto/book.dto";

@Route("authors")
@Tags("Authors")
export class AuthorController extends Controller {
  // Récupère tous les auteurs
  @Get("/")
  @Security("jwt", ["read:*"])
  public async getAllAuthors(): Promise<AuthorDTO[]> {
    return authorService.getAllAuthors();
  }

  // Récupère un auteur par ID
  @Get("{id}")
  @Security("jwt", ["read:Author"])
  public async getAuthorById(@Path() id: number): Promise<AuthorDTO | null> {
    let author : Author | null = await authorService.getAuthorById(id);
    if (author === null) {
        let error : CustomError = new Error("Author not found");
        error.status = 404;
        throw error;
    } else {
        return author;
    }
  }

  @Get("{id}/books")
  @Security("jwt", ["read:Author"])
  public async getBooksByAuthorId(@Path() id: number): Promise<BookDTO[] | null> {
    const author : Author | null = await authorService.getAuthorById(id);
    if (author === null) {
        let error : CustomError = new Error("Author not found");
        error.status = 404;
        throw error;
    } else {
        return bookService.getBooksByAuthorId(id);
    }
  }

  // Crée un nouvel auteur
  @Post("/")
  @Security("jwt", ["create:Author"])
  public async createAuthor(
    @Body() requestBody: AuthorDTO
  ): Promise<AuthorDTO> {
    const { firstName, lastName } = requestBody;
    if (!firstName || !lastName) {
        let error : CustomError = new Error("First name and last name are required to create an author");
        error.status = 404;
        throw error;
    }
    return authorService.createAuthor(firstName, lastName);
  }

  // Supprime un auteur par ID
  @Delete("{id}")
  @Security("jwt", ["delete:Author"])
  public async deleteAuthor(@Path() id: number): Promise<void> {
    const books: BookDTO[] | null = await bookService.getBooksByAuthorId(id);
    if (books === null) {
        let error : CustomError = new Error("Author not found");
        error.status = 404;
        throw error;
    } else if (books.length > 0) {
        let error : CustomError = new Error("Cannot delete author with associated books");
        error.status = 400;
        throw error;
    }
    await authorService.deleteAuthor(id);
  }

  // Met à jour un auteur par ID
  @Patch("{id}")
  @Security("jwt", ["update:*", "update:Author"])
  public async updateAuthor(
    @Path() id: number,
    @Body() requestBody: AuthorDTO
  ): Promise<AuthorDTO | null> {
    const { firstName, lastName } = requestBody;
    if (!firstName || !lastName) {
        let error : CustomError = new Error("First name and last name are required to update an author");
        error.status = 404;
        throw error;
    }
    const author : Author | null = await authorService.updateAuthor(id, firstName, lastName);
    if (author === null) {
        let error : CustomError = new Error("Author not found");
        error.status = 404;
        throw error;
    } else {
        return author;
    }
  }
}
