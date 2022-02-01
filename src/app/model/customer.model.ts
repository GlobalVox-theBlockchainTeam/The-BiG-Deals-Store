import { Address } from './address.model';
import { CustomAttribute } from './custom-attribute.model';
import { Deserializable } from '../interface/deserializable.interface';
import { DeserializableImpl } from '../interface/deserializable-impl';

export class Customer extends DeserializableImpl implements Deserializable {
    id!: number;
    group_id!: number;
    default_billing!: string;
    default_shipping!: string;
    confirmation!: string;
    created_at!: string;
    updated_at!: string;
    created_in!: string;
    dob!: string;
    email!: string;
    firstname!: string;
    lastname!: string;
    middlename!: string;
    prefix!: string;
    suffix!: string;
    gender!: number;
    store_id!: number;
    taxvat!: string;
    website_id!: number;
    addresses!: Address[];
    disable_auto_group_change!: number;
    extension_attributes!: CustomerExtensionAttribute;
    custom_attributes!: CustomAttribute[];

    public getName() {
        return `${this.firstname} ${this.lastname}`;
    }
}

class CustomerExtensionAttribute extends DeserializableImpl implements Deserializable {
    assistance_allowed!: number;
    is_subscribed!: boolean;
    amazon_id!: string;
    vertex_customer_code!: string;
    vertex_customer_country!: string;
}