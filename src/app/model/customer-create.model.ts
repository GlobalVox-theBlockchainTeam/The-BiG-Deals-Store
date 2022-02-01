import {Customer} from './customer.model';
import { Deserializable } from '../interface/deserializable.interface';

export class CustomerCreate implements Deserializable {
    customer!: Customer;
    password!: string;
    redirectUrl: string = "";

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}