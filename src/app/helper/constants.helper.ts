import { environment } from "src/environments/environment";

export class Constants {
    public static readonly API_SERVER = environment.apiServer;
    public static readonly SOCKET_SERVER = environment.socketServer;

    public static readonly TOKEN_ADDRESS = 'DotdtxnoYiTELUjGnjXorv5Xy2kngLRiaydYrBzUxHNL';
    public static readonly LAMPORTS_PER_TOKEN = 100000;
    public static readonly TOKEN_OWNER_ADDRESS = '2twZL3tWNvRiKwN14BE7kPrsSJZNe8hoL32PMyyBuQyR';
    public static readonly TOKEN_NAME = 'TBIG';
    public static readonly TOKEN_LOGO = 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/GtpmHimJ3oyVPyZg7iZ4edxEE9ejTEikUAQLhoRPw1fR/logo.png';
    public static readonly SOL_NETWORK = 'testnet';
    public static readonly BID_HAMMER_ICON = '/assets/images/bid-hammer-icon.png';

    public static readonly API_PREFIX = '/rest/V1';

    public static readonly CURRENCY_CODE_SIGN: string = '$';
    public static readonly LOCALE_ID: string = 'en-US';
    public static readonly CUSTOMER_SESSION_TOKEN_KEY = 'access_token';
    public static readonly CUSTOMER_SESSION_ID_KEY = 'customer_id';
    public static readonly CUSTOMER_DATA_KEY = 'customer_data';
    public static readonly SOCKET_BID_SEND_KEY = 'new-bid-send';
    public static readonly SOCKET_BID_RECEIVED_KEY = 'new-bid-received-:productID';
    public static readonly SOCKET_COUNTDOWN_KEY = 'countdown-updated-:productID';
    public static readonly SOCKET_AUCTION_REMAINING_TIME_KEY = 'auction-remaining-time-:productID';
    public static readonly SOCKET_BID_CLOSE_KEY = 'bid-closed-:productID';
    public static readonly SOCKET_BID_STATUS_KEY = 'bid-status';

    public static readonly MEDIUM_DIALOG_WIDTH = '460px';
    public static readonly LARGE_DIALOG_WIDTH = '750px';

    public static readonly PRODUCT_MEDIA_PREFIX = '/media/catalog/product';
    public static readonly CUSTOMER_CREATE_API = '/customers';
    public static readonly CUSTOMER_DETAILS_API = '/customers/me';
    public static readonly CUSTOMER_GET_TOKEN_API = '/integration/customer/token';

    public static readonly PRODUCT_LIST_API = '/products-render-info';
    public static readonly PRODUCT_DETAIL_API = '/products/:sku';

    public static readonly CART_QUOTE_API = '/carts/mine';
    public static readonly CART_DETAILS_API = '/carts/mine/items';
    public static readonly CART_ADD_API = '/carts/mine/items';
    public static readonly ORDER_PLACED_API = '/carts/mine/payment-information';
    public static readonly GET_COUNTRIES_API = '/directory/countries';
    public static readonly GET_REGIONS_API = '/directory/countries/:countryID';
    public static readonly SAVE_ADDRESS_API = '/carts/mine/shipping-information';

    public static readonly GET_WALLET_BALANCE_API = '/get-wallet-balance';
    public static readonly WALLET_PAIR_API = '/pair-wallet';
    public static readonly PLAY_PACKAGES_API = '/get-play-packages';
    public static readonly PLAY_PRICE_API = '/get-play-price';
    public static readonly BUY_PLAY_PACKAGES_API = '/buy-play-package';
    public static readonly CONNECT_WALLET_API = '/connect-wallet';
    public static readonly DISCONNECT_WALLET_API = '/disconnect-wallet';
    public static readonly GET_USER_WALLET_API = '/get-user-wallet';
    public static readonly GET_AUCTION_DETAILS_API = '/get-auction-details/:productID';
    public static readonly ENABLE_PRODUCT_VIABLE_API = '/enable-product-viable/:productID';
    public static readonly DISABLE_PRODUCT_VIABLE_API = '/disable-product-viable/:productID';
    public static readonly RESET_AUCTION_API = '/reset-auction/:productID';

    /*
    Product List API Parameters
    */
    public static readonly PAGE_SIZE: number = 5;
    public static readonly CURRENT_PAGE: number = 1;
    public static readonly STORE_ID: number = 1;
    public static readonly CURRENCY_CODE: string = 'USD';
}