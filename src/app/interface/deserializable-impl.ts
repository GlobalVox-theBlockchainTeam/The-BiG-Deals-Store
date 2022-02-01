import { Deserializable } from './deserializable.interface';
import { serialize } from "class-transformer";

export class DeserializableImpl implements Deserializable {

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
    
    doSerialize() {
        return serialize(this);
    }
}