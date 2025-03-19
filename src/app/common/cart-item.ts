import { Product } from "./product";

export class CartItem {
    id: string;
    name:string;
    unitPrice: number;
    imageUrl: string;

    quantity: number = 1;

    constructor(product: Product){
        this.id = product.id;
        this.name = product.name;
        this.unitPrice = product.unitPrice;
        this.imageUrl = product.imageUrl;
    }
}
