import { CustomAttribute } from './custom-attribute.model';
import { Deserializable } from '../interface/deserializable.interface';

export class Address implements Deserializable {
    id!: number;
    customer_id!: number;
    region!: Region;
    region_id!: number;
    country_id!: string;
    street!: string[];
    company!: string;
    telephone!: string;
    fax!: string;
    postcode!: string;
    city!: string;
    firstname!: string;
    lastname!: string;
    middlename!: string;
    prefix!: string;
    suffix!: string;
    vat_id!: string;
    default_shipping!: boolean;
    default_billing!: boolean;
    custom_attributes!: CustomAttribute[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class Region implements Deserializable {
    region_code!: string;
    region!: string;
    region_id!: number;
    extension_attributes!: RegionAttribute;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class CountryRegion implements Deserializable {
    id!: string;
    code!: string;
    name!: number;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

export class Country implements Deserializable {
    id!: string;
    two_letter_abbreviation!: string;
    three_letter_abbreviation!: string;
    full_name_locale!: string;
    full_name_english!: string;
    available_regions!: CountryRegion[];
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}

class RegionAttribute { }