import { AppError } from "../../domain/AppError";

export class InvalidCycleException extends AppError {
    constructor(message: string) {
        super(message, 422);
    }
}