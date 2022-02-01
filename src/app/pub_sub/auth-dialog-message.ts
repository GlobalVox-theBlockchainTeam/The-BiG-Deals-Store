import { DefineMessage, IMessageSchema } from '@fsms/angular-pubsub';
import { IMessage } from '../interface/imessage.interface';

@DefineMessage<IMessageSchema>()
export class AuthDialogMessage implements IMessage {
    static messageType = 'Switch Auth Form';
    messageType = AuthDialogMessage.messageType;
    constructor(public payload?: AuthDialogMessagePayload) {}
}

interface AuthDialogMessagePayload {
    form: 'login'|'register';
    action: 'open'|'close';
}