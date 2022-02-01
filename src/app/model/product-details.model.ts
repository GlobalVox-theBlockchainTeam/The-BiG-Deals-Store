import { Constants } from '../helper/constants.helper';
import { DeserializableImpl } from '../interface/deserializable-impl';
import { Deserializable } from '../interface/deserializable.interface';
import { CustomAttribute } from './custom-attribute.model';

export class ProductDetails extends DeserializableImpl implements Deserializable {
    id!: number;
    sku!: string;
    name!: string;
    attribute_set_id!: number;
    price!: number;
    status!: number;
    visibility!: number;
    type_id!: string;
    created_at!: string;
    updated_at!: string;
    weight!: number;
    extension_attributes!: ExtensionAttributes;
    product_links!: any[];
    options!: any[];
    media_gallery_entries!: MediaGalleryEntry[];
    tier_prices!: any[];
    custom_attributes!: CustomAttribute[];

    get getName() {
        return this.name;
    }

    getBaseImage() {
        return Constants.API_SERVER + Constants.PRODUCT_MEDIA_PREFIX + this.media_gallery_entries[0].file;
    }

    get getPrice() {
        return this.getAttribute('product_mrp');
    }

    getBundleProducts() {
        return this.extension_attributes.bundle_product_options.sort((a,b) => { return a.position - b.position });
    }

    async getBidProduct(): Promise<ProductLink> {
        let bidProduct = new ProductLink();
        const bundleProducts: BundleProductOption[] = this.extension_attributes.bundle_product_options;
        await bundleProducts.forEach( (bundleProduct: BundleProductOption) => {
            bundleProduct.product_links.forEach( (product_link: ProductLink) => {
                if (product_link.can_change_quantity === 1) {
                    bidProduct = product_link;
                }
            });
        });
        return bidProduct;
    }

    async getAttribute(attribute_code: string) {
        let attribute: CustomAttribute = new CustomAttribute();
        await this.custom_attributes.forEach((custom_attribute: CustomAttribute) => {
            if (custom_attribute.attribute_code === attribute_code) {
                attribute = custom_attribute;
            }
        });
        return attribute;
    }
}

export class CategoryLink extends DeserializableImpl implements Deserializable {
    position!: number;
    category_id!: string;
}

export class ProductLink extends DeserializableImpl implements Deserializable {
    id!: string;
    sku!: string;
    option_id!: number;
    qty!: number;
    position!: number;
    is_default!: boolean;
    price!: number;
    price_type?: any;
    can_change_quantity!: number;
}

export class BundleProductOption extends DeserializableImpl implements Deserializable {
    option_id!: number;
    title!: string;
    required!: boolean;
    type!: string;
    position!: number;
    sku!: string;
    product_links!: ProductLink[];
}

export class ExtensionAttributes extends DeserializableImpl implements Deserializable {
    website_ids!: number[];
    category_links!: CategoryLink[];
    bundle_product_options!: BundleProductOption[];
}

export class MediaGalleryEntry extends DeserializableImpl implements Deserializable {
    id!: number;
    media_type!: string;
    label?: any;
    position!: number;
    disabled!: boolean;
    types!: string[];
    file!: string;
}