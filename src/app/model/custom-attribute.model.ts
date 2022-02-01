import { Deserializable } from '../interface/deserializable.interface';

export class CustomAttribute implements Deserializable {
    attribute_code!: string;
    value!: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}