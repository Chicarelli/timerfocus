import { User } from "../domain/User";


class UserRepository {
    collection: Array<User>;

    constructor() {
        this.collection = [];
    }


    async createUser(newUser: User): Promise<User> {
        this.collection.push(newUser);
        return newUser;
    }

    async findUser(userId: string): Promise<User | null> {
        const user = this.collection.find(us => us.id === userId);

        return user || null
    }
}