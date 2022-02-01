
import { DefineMessage, IMessageSchema } from '@fsms/angular-pubsub';
import { IMessage } from '../interface/imessage.interface';
import { Customer } from '../model/customer.model';

@DefineMessage<IMessageSchema>()
export class CustomerLoginMessage implements IMessage {
    static messageType = 'Customer Loggedin';
    messageType = CustomerLoginMessage.messageType;
    constructor(public payload?: {customer: Customer}) {}
}