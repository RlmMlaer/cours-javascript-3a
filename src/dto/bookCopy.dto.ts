import { BookDTO } from "./book.dto";

export interface BookCopyDTO {
    id?: number;
    bookId: number;
    available: boolean;
    state: number;
    book?: BookDTO;
}
