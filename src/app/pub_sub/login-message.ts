import { DefineMessage, IMessageSchema } from '@fsms/angular-pubsub';
import { IMessage } from '../interface/imessage.interface';

@DefineMessage<IMessageSchema>()
export class LoginMessage implements IMessage {
    static messageType = 'Open Login Form';
    messageType = LoginMessage.messageType;
    constructor(public payload?: any) {}
}