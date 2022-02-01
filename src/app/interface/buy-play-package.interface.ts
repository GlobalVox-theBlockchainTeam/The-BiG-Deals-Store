import { WalletType } from '../enum/wallet-type.enum';

export interface BuyPlayPackageInterface {
    play_package_id?: number,
    user_id: number,
    payment_method?: 'big_token' | 'alt_coin',
    big_tokens?: number,
    signature?: string | null,
    wallet_type?: WalletType,
    wallet_address?: string
}