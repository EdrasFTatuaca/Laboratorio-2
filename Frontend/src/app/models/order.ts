export class Order {
    id?: number;
    personId: number;
    number: number;
    createdBy: number;
    createdAt?: Date;
    updatedBy?: number;
    updatedAt?: Date;
    
    // Para mostrar información de la persona asociada
    personName?: string;

    constructor() {
        this.personId = 0;
        this.number = 0;
        this.createdBy = 1; // Default user ID
    }
}
