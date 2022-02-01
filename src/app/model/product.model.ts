import { DeserializableImpl } from '../interface/deserializable-impl';
import { Deserializable } from '../interface/deserializable.interface';

export class Product extends DeserializableImpl implements Deserializable {
    add_to_cart_button!: AddToCartButton;
    add_to_compare_button!: AddToCompareButton;
    price_info!: PriceInfo;
    images!: ProductImage[];
    url!: string;
    id!: number;
    name!: string;
    type!: string;
    is_salable!: string;
    store_id!: number;
    currency_code!: string;
    extension_attributes!: ProductExtensionAttribute;

    get getName() {
        return this.name;
    }

    get getShortDescription() {
        return "Coming soon...";
    }

    getBaseImage() {
        return this.images[0];
    }

    get getPrice() {
        return this.price_info.final_price;
    }
}

class ProductExtensionAttribute extends DeserializableImpl implements Deserializable {
    review_html!: string;
    wishlist_button!: WishlistButton;
}

class WishlistButton extends DeserializableImpl implements Deserializable {
    post_data!: string;
    url!: string;
    required_options!: boolean;
    extension_attributes!: any;
}

class ProductImage extends DeserializableImpl implements Deserializable {
    url!: string;
    code!: string;
    height!: number;
    width!: number;
    label!: string;
    resized_width!: number;
    resized_height!: number;
    extension_attributes: any;
}

class PriceInfo extends DeserializableImpl implements Deserializable {
    final_price!: number;
    max_price!: number;
    max_regular_price!: number;
    minimal_regular_price!: number;
    special_price!: number;
    minimal_price!: number;
    regular_price!: number;
    formatted_prices!: FormattedPrices;
    extension_attributes!: PriceInfoAttribute;
}

class PriceInfoAttribute extends DeserializableImpl implements Deserializable {
    msrp!: Msrp;
    weee_attributes!: WeeeAttribute[];
    weee_adjustment!: string;
}

class Msrp extends DeserializableImpl implements Deserializable {
    msrp_price!: string;
    is_applicable!: string;
    is_shown_price_on_gesture!: string;
    msrp_message!: string;
    explanation_message!: string;
    extension_attributes: any;
}

class WeeeAttribute extends DeserializableImpl implements Deserializable {
    amount!: string;
    tax_amount!: string;
    tax_amount_incl_tax!: string;
    amount_excl_tax!: string;
    attribute_code!: string;
    extension_attributes: any;
}

class FormattedPrices extends DeserializableImpl implements Deserializable {
    final_price!: string;
    max_price!: string;
    minimal_price!: string;
    max_regular_price!: string;
    minimal_regular_price!: string;
    special_price!: string;
    regular_price!: string;
    extension_attributes: any;
}

class AddToCartButton extends DeserializableImpl implements Deserializable {
    post_data!: string;
    url!: string;
    required_options!: boolean;
    extension_attributes: any;
}

class AddToCompareButton extends DeserializableImpl implements Deserializable {
    post_data!: string;
    url!: string;
    required_options!: boolean;
    extension_attributes: any;
}
