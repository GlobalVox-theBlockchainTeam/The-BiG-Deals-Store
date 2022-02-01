
import { DefineMessage, IMessageSchema } from '@fsms/angular-pubsub';
import { IMessage } from '../interface/imessage.interface';

@DefineMessage<IMessageSchema>()
export class WalletTransactionMessage implements IMessage {
    static messageType = 'Wallet Transacrion';
    messageType = WalletTransactionMessage.messageType;
    constructor(public payload?: any) {}
}