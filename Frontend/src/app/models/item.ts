export class Item {
    id?: number;
    name: string;
    price: number;
    createdBy: number;
    createdAt?: Date;
    updatedBy?: number;
    updatedAt?: Date;

    constructor() {
        this.name = '';
        this.price = 0;
        this.createdBy = 1; // Default user ID
    }
}
