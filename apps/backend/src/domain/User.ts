import { nanoid } from 'nanoid';

export class User {
    id: string = "";
    type: "device" | "user" = "device";
}