import { Product } from './product.model';

export class CommonResponse<T> {
    result?: T | T[];
}