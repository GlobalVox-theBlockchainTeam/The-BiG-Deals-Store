import { DefineMessage, IMessageSchema } from '@fsms/angular-pubsub';
import { IMessage } from '../interface/imessage.interface';

@DefineMessage<IMessageSchema>()
export class CheckoutMessage implements IMessage {
    static messageType = 'Open Checkout Form';
    messageType = CheckoutMessage.messageType;
    constructor(public payload?: any) {}
}