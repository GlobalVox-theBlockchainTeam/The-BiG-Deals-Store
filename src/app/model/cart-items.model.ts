import { DeserializableImpl } from '../interface/deserializable-impl';
import { Deserializable } from '../interface/deserializable.interface';

export class CartItems extends DeserializableImpl implements Deserializable {
    item_id!: number;
    sku!: string;
    qty!: number;
    name!: string;
    price!: number;
    product_type!: string;
    quote_id!: string;
    product_option!: CartProductOption;
}

class CartProductOption extends DeserializableImpl implements Deserializable {
    extension_attributes!: CartExtensionAttributes;
}

class CartExtensionAttributes extends DeserializableImpl implements Deserializable {
    bundle_options!: BundleOption[];
}

class BundleOption extends DeserializableImpl implements Deserializable {
    option_id!: number;
    option_qty!: number;
    option_selections!: number[];
}