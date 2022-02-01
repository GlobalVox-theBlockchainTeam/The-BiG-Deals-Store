
export interface AddressPostInterface {
    addressInformation: {
        billingAddress: AddressData,
        shippingAddress: AddressData,
        shippingCarrierCode: string,
        shippingMethodCode: string
    };
}

export interface AddressData {
    id?: number,
    city?: string,
    company?: string,
    countryId?: string,
    email?: string,
    firstname?: string,
    lastname?: string,
    postcode?: number | string,
    region?: string,
    saveInAddressBook?: number,
    street?: string[],
    telephone?: number | string
}