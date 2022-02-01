export interface CartItemInterface {
    cartItem: {
        sku: string,
        qty: number,
        quote_id: string,
        product_option: productOption
    }
}

export interface productOption {
    extension_attributes: {
        bundle_options: bundleOption[]
    }
}

export interface bundleOption {
    option_id: number;
    option_qty: number;
    option_selections: number[];
}