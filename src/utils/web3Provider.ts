import Web3, { WebSocketProvider } from "web3";

const mainnetRpc = import.meta.env.VITE_XDC_MAINNET_WS_RPC!;

const mainnetHttpProvider = new WebSocketProvider(mainnetRpc);
export const mainnetWeb3 = new Web3(mainnetHttpProvider);

const testnetRpc = import.meta.env.VITE_XDC_TESTNET_WS_RPC!;
const testnetHttpProvider = new WebSocketProvider(testnetRpc);
export const testnetWeb3 = new Web3(testnetHttpProvider);
