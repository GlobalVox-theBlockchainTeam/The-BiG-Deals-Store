import { DefineMessage, IMessageSchema } from '@fsms/angular-pubsub';
import { IMessage } from '../interface/imessage.interface';

@DefineMessage<IMessageSchema>()
export class OrderPlacedMessage implements IMessage {
    static messageType = 'Order Placed';
    messageType = OrderPlacedMessage.messageType;
    constructor(public payload?: any) {}
}