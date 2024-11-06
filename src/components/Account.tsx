import React, { useContext, useState } from "react";
import { xrc20ABI } from "../utils/XRC20ABI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FourSquare } from "react-loading-indicators";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Web3 from "web3";
import { flipGameAbi } from "@/utils/flipGameAbi";
import toast from "react-hot-toast";
import { MyBalanceContext } from "./BalanceContext";
import { NavLink } from "react-router-dom";
import Tweet from "./Tweet";
interface ResultDto {
  0: boolean;
  1: boolean;
  2: bigint;
  3: boolean;
  amount: bigint | number;
  guess: boolean;
  result: boolean;
  won: boolean;
  __length__: number;
}

export function Account() {
  const [selectedSide, setSelectedSide] = useState<string>("Select");
  const [inputBalance, setInputBalance] = useState<string>("");
  const [balanceReplica, setBalanceReplica] = useState<string>("");
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [isAnimationFlipping, setIsAnimationFlipping] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserResultLoader, setIsUserResultLoader] = useState<boolean>(false);
  const [isUserWon, setIsUserWon] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [formattedTransactionHash, setFormattedTransactionHash] =
    useState<string>("");
  const [result, setResult] = useState<ResultDto>();
  const [flipResult, setFlipResult] = useState<string>("Heads");

  const coinSides = ["Select", "Heads", "Tails"];
  let flipIntervalId: NodeJS.Timeout;

  const context = useContext(MyBalanceContext);
  const balance = context?.balance;
  const setBalance = context?.setBalance;
  const gamaSymbol = context?.gamaSymbol;
  const address = context?.address;
  const chainId = context?.chainId;
  const minBet = context?.minBet;
  const rewardValue = context?.rewardValue;

  const message = `🚀 Just scored BIG! I won ${
    Number(balanceReplica) * rewardValue!
  } ${gamaSymbol} tokens on ${window.location.href} 🌟
Dive in and try your luck, you could be the next big winner! 🏆 #WinningStreak #CryptoRewards`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const formValues = Object.fromEntries(formData.entries());

      const web3 = new Web3(window.web3);

      const testnetContractAddress =
        chainId === 51
          ? import.meta.env.VITE_XDC_TESTNET_CONTRACT_ADDRESS!
          : import.meta.env.VITE_XDC_MAINNET_CONTRACT_ADDRESS!;

      const tokenContract = new web3.eth.Contract(
        xrc20ABI,
        testnetContractAddress
      );

      const valueInWei = web3.utils.toWei(
        formValues.balance as string,
        "ether"
      );

      const gasPrice = await web3.eth.getGasPrice();

      const testNetCoinAddress =
        chainId === 51
          ? import.meta.env.VITE_XDC_TESTNET_COIN_CONTRACT_ADDRESS!
          : import.meta.env.VITE_XDC_MAINNET_COIN_CONTRACT_ADDRESS!;

      const approveGasEstimate = await tokenContract.methods
        .approve(testNetCoinAddress, valueInWei)
        .estimateGas({ from: address });

      const approveGasLimit = Math.ceil(
        Number(approveGasEstimate) * 1.5
      ).toString();

      await tokenContract.methods
        .approve(testNetCoinAddress, valueInWei)
        .send({
          from: address,
          gasPrice: gasPrice.toString(),
          gas: approveGasLimit,
        })
        .on("receipt", async () => {
          const coinContract = new web3.eth.Contract(
            flipGameAbi,
            testNetCoinAddress
          );

          const coinBool = selectedSide === "Heads" ? true : false;
          const betGasEstimate = await coinContract.methods
            .placeBet(coinBool, valueInWei)
            .estimateGas({ from: address });

          const betGasLimit = Math.ceil(
            Number(betGasEstimate) * 1.5
          ).toString();
          const sendBet = coinContract.methods
            .placeBet(coinBool, valueInWei)
            .send({
              from: address,
              gasPrice: gasPrice.toString(),
              gas: betGasLimit,
            });

          sendBet
            .on("transactionHash", () => {
              setIsLoading(false);
              flipCoin();
            })
            .on("receipt", async (txs) => {
              const formattedTransaction = formatTransaction(
                txs.transactionHash
              );
              setFormattedTransactionHash(formattedTransaction!);
              setTransactionHash(txs.transactionHash);
              const finalResult: ResultDto = await coinContract.methods
                .lastBetResults(address)
                .call();

              if (finalResult) {
                setResult(finalResult);
              }
              if (finalResult.result === true) {
                stopCoinFlip("Heads", finalResult.won);
              } else {
                stopCoinFlip("Tails", finalResult.won);
              }
            })
            .catch((error: unknown) => {
              if (error instanceof Error) {
                console.log("Error occurred in placeBet:", error);
                setIsLoading(false);
                toast.error(error.message);
              }
            });
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            console.log("Error occurred in approve transaction:", error);
            setIsLoading(false);
            toast.error(error.message);
          }
        });
      setInputBalance("");
      setSelectedSide("Select");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error);
        setIsLoading(false);
        toast.error(error.message);
      }
    }
  };

  function formatTransaction(transaction?: string) {
    if (!transaction) return null;
    return `${transaction.slice(0, 8)}…${transaction.slice(58, 66)}`;
  }

  const flipCoin = () => {
    setIsFlipping(true);
    const flipInterval = 500;

    flipIntervalId = setInterval(() => {
      setFlipResult((prevResult) =>
        prevResult === "Heads" ? "Tails" : "Heads"
      );
    }, flipInterval);
  };

  const stopCoinFlip = (finalResult: string, isWin: boolean) => {
    clearInterval(flipIntervalId);
    setIsAnimationFlipping(true);
    setFlipResult(finalResult);

    setTimeout(() => {
      setIsFlipping(false);
      setIsAnimationFlipping(false);
      setIsUserResultLoader(true);
      setIsUserWon(isWin);
      const parsedNumber = parseFloat(balance!);

      if (isWin) {
        setBalance!(
          (parsedNumber + Number(balanceReplica) * rewardValue!).toString()
        );
        setResultText("Congratulations, You've Won!");
      } else {
        setBalance!((parsedNumber - Number(balanceReplica)).toString());
        setResultText("Oops, You've Lost!");
      }
    }, 2000);
  };

  return (
    <>
      {isUserResultLoader && (
        <Dialog
          open={isUserResultLoader}
          onOpenChange={() => setIsUserResultLoader(!isUserResultLoader)}
        >
          <DialogContent className="sm:max-w-[425px] gap-0">
            <DialogTitle className="mb-3">{resultText}</DialogTitle>
            <div className="flex items-center gap-1 mb-2">
              <Label htmlFor="name">Your transaction hash:</Label>
              <div className="mt-0">
                <NavLink
                  style={{ color: "#0000EE", textDecoration: "underline" }}
                  to={`${
                    chainId === 50
                      ? `https://xdcscan.com/tx/${transactionHash}`
                      : `https://testnet.xdcscan.com/tx/${transactionHash}`
                  }`}
                  target="_blank"
                >
                  {formattedTransactionHash}
                </NavLink>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Label htmlFor="name">Your bet amount:</Label>
              <div className="mt-0">
                {balanceReplica} {gamaSymbol}
              </div>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Label htmlFor="name">{`Your ${
                isUserWon ? "winning" : "loosing"
              } amount:`}</Label>
              <div className="mt-0">
                {isUserWon ? Number(balanceReplica) * 2 : balanceReplica}{" "}
                {gamaSymbol}
              </div>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Label htmlFor="name">Your selected side:</Label>
              <div className="mt-0">
                {result?.guess === true ? "Heads" : "Tails"}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Label htmlFor="name">Final result side:</Label>
              <div className="mt-0">
                {result?.result === true ? "Heads" : "Tails"}
              </div>
            </div>
            {isUserWon && <Tweet content={message} />}
          </DialogContent>
        </Dialog>
      )}
      {isLoading && (
        <div className="overlay">
          <div className="loader">
            <FourSquare color="#fff" size="medium" text="" textColor="" />
          </div>
        </div>
      )}
      <div className={`flex-grow flex flex-col justify-center items-center`}>
        {isFlipping ? (
          <div
            className={`coin-container ${isFlipping ? "animate-flip" : ""} ${
              isAnimationFlipping ? "stop-flip" : ""
            }`}
          >
            <div
              className={`coin ${flipResult ? flipResult.toLowerCase() : ""}`}
            >
              <div className="side heads">
                <span>H</span>
              </div>
              <div className="side tails">
                <span>T</span>
              </div>
            </div>
          </div>
        ) : (
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Toss The Coin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">
                      Select side from head or tail:
                    </Label>
                    <Select
                      name="coin"
                      value={selectedSide}
                      onValueChange={(e) => setSelectedSide(e)}
                    >
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {coinSides.map((val, ind) => (
                          <SelectItem key={ind} value={val}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="balance">Enter balance (GAMA Token):</Label>
                    <div className="flex w-full max-w-sm items-center space-x-2 relative">
                      <Input
                        type="text"
                        id="balance"
                        required
                        pattern="[0-9]*"
                        inputMode="numeric"
                        name="balance"
                        className="relative"
                        value={inputBalance}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setInputBalance(value);
                            setBalanceReplica(value);
                          }
                        }}
                        placeholder="Enter balance"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          setInputBalance(balance!);
                          setBalanceReplica(balance!);
                        }}
                        className="absolute left-auto right-0 rounded-tl-none rounded-bl-none"
                      >
                        Add Max
                      </Button>
                    </div>
                    <Label htmlFor="balance" className="leading-5">
                      If you win, you will receive 2x GAMA tokens.
                    </Label>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={
                        selectedSide === "Select" ||
                        Number(inputBalance)! > Number(parseFloat(balance!)) ||
                        minBet! > Number(inputBalance)
                      }
                    >
                      Toss
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
