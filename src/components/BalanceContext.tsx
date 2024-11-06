import { flipGameAbi } from "@/utils/flipGameAbi";
import { xrc20ABI } from "@/utils/XRC20ABI";
import { createContext, useEffect, useState } from "react";
import {
  Connector,
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
} from "wagmi";
import Web3 from "web3";

declare type LayoutType = {
  children: React.ReactNode;
};

type MyBalanceContextType = {
  balance: string;
  setBalance: React.Dispatch<React.SetStateAction<string>>;
  gamaSymbol: string;
  setGamaSymbol: React.Dispatch<React.SetStateAction<string>>;
  isConnected: boolean;
  connected: boolean;
  connect: ({
    connector,
    chainId,
  }: {
    connector: Connector;
    chainId?: number;
  }) => void;
  disconnect: () => void;
  chainId: number;
  address?: string;
  injectedConnector: Connector;
  minBet: number;
  rewardValue: number;
};

export const MyBalanceContext = createContext<MyBalanceContextType | null>(
  null
);
function BalanceContext({ children }: LayoutType) {
  const [balance, setBalance] = useState<string>("0");
  const [minBet, setMinBet] = useState<number>(0);
  const [rewardValue, setRewardValue] = useState<number>(0);
  const [gamaSymbol, setGamaSymbol] = useState<string>("");
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState(false);
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const injectedConnector = connectors[0];
  const chainId = useChainId();

  const getWalletBalance = async () => {
    if (!address) return;
    if (!connected) return;
    try {
      const web3 = new Web3(window.web3);

      const testnetContractAddress =
        chainId === 51
          ? import.meta.env.VITE_XDC_TESTNET_CONTRACT_ADDRESS!
          : import.meta.env.VITE_XDC_MAINNET_CONTRACT_ADDRESS!;

      const tokenContract = new web3.eth.Contract(
        xrc20ABI,
        testnetContractAddress
      );

      const symbol: string = await tokenContract.methods.symbol().call();
      setGamaSymbol(symbol);

      const balance = await tokenContract.methods.balanceOf(address).call();

      const getDecimals: number = await tokenContract.methods.decimals().call();
      const decimals = Number(getDecimals);

      const formattedBalance = Number(
        Number(Number(balance) / Math.pow(10, decimals)).toFixed(2)
      );
      setBalance(formattedBalance.toString());

      const testNetCoinAddress =
        chainId === 51
          ? import.meta.env.VITE_XDC_TESTNET_COIN_CONTRACT_ADDRESS!
          : import.meta.env.VITE_XDC_MAINNET_COIN_CONTRACT_ADDRESS!;

      const coinContract = new web3.eth.Contract(
        flipGameAbi,
        testNetCoinAddress
      );

      const minimumBet = await coinContract.methods.minimumBet().call();
      const formattedMinBet = Number(
        Number(Number(minimumBet) / Math.pow(10, decimals)).toFixed(2)
      );
      setMinBet(formattedMinBet);

      const rewardMultiplier = await coinContract.methods
        .rewardMultiplier()
        .call();
      setRewardValue(Number(rewardMultiplier));
    } catch (error) {
      console.error("Error fetching Gama balance:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const provider = await injectedConnector.getProvider();
      window.web3 = provider;
      setConnected(!!provider);
    })();
  }, [injectedConnector]);

  useEffect(() => {
    if (connected) {
      getWalletBalance();
    }
  }, [address, connected, chainId]);

  return (
    <MyBalanceContext.Provider
      value={{
        balance,
        setBalance,
        gamaSymbol,
        setGamaSymbol,
        isConnected,
        connect,
        connected,
        disconnect,
        chainId,
        address,
        injectedConnector,
        minBet,
        rewardValue,
      }}
    >
      {children}
    </MyBalanceContext.Provider>
  );
}

export default BalanceContext;
