export interface OrderPlacedInterface {
    paymentMethod: {
        method: string
    },
    shippingMethod: {
        method_code: string,
        carrier_code: string,
        additionalProperties: object
    }
}