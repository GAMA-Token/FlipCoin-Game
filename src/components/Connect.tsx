import { useContext, useState } from "react";
import { BsCopy } from "react-icons/bs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MyBalanceContext } from "./BalanceContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { FaUser, FaWallet } from "react-icons/fa";
import { xdcTestnet, xdc } from "viem/chains";

const DropdownMenuDemo = () => {
  const [toolTip, setToolTip] = useState("Copy To Clipboard");
  const [showTooltip, setShowTooltip] = useState(false);
  const context = useContext(MyBalanceContext);
  const disconnect = context?.disconnect;
  const address = context?.address;
  const formattedAddress = formatAddress(address);
  const chainId = context?.chainId;
  function formatAddress(address?: string) {
    if (!address) return null;
    return `${address.slice(0, 8)}…${address.slice(34, 42)}`;
  }

  const handleCopyText = () => {
    navigator.clipboard
      .writeText(address!)
      .then(() => {
        setToolTip("Copied");
        setShowTooltip(true);
        setTimeout(() => {
          setToolTip("Copy To Clipboard");
          setShowTooltip(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FaUser />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div className="flex justify-between items-center flex-grow">
              <div className="text-sm">{formattedAddress}</div>
              <TooltipProvider>
                <Tooltip open={showTooltip}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCopyText}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => {
                        if (toolTip === "Copy To Clipboard") {
                          setShowTooltip(false);
                        }
                      }}
                    >
                      <BsCopy />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{toolTip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              window.open("https://app.xspswap.finance/#/swap?outputCurrency=0x678adf7955d8f6dcaa9e2fcc1c5ba70bccc464e6", "_blank", "noreferrer");
            }}
          >
            <span>Buy Gama Token</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Networks</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              if (chainId !== xdc.id && context?.injectedConnector.switchChain) {
                console.log("switching chain");
                context?.injectedConnector.switchChain({ chainId: xdc.id });
              }
            }}
            className={`${xdc.id === chainId ? "!bg-blue-400 !text-white" : ""}`}
          >
            <span>{xdc.name}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (chainId !== xdcTestnet.id && context?.injectedConnector.switchChain) {
                console.log("switching chain");

                context?.injectedConnector.switchChain({
                  chainId: xdcTestnet.id,
                });
              }
            }}
            className={`${xdcTestnet.id === chainId ? "!bg-blue-400 !text-white" : ""}`}
          >
            <span>{xdcTestnet.name}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect!()}>
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Connect = () => {
  const context = useContext(MyBalanceContext);
  const balance = context?.balance;
  const gamaSymbol = context?.gamaSymbol;
  const isConnected = context?.isConnected;
  const connected = context?.connected;
  const connect = context?.connect;
  const chainId = context?.chainId;
  const injectedConnector = context?.injectedConnector;

  const formatter = new Intl.NumberFormat("en-US");
  const formattedBalance = formatter.format(Number(balance));

  if (isConnected) {
    return (
      <div className="flex justify-between gap-3">
        <div className="flex justify-between items-center border px-5 rounded-md py-1 gap-3">
          <div className="font-semibold">
            {formattedBalance} {gamaSymbol}
          </div>
          <FaWallet />
        </div>
        <DropdownMenuDemo />
      </div>
    );
  } else {
    return (
      <Button
        disabled={!connected}
        onClick={() => {
          connect!({
            connector: injectedConnector!,
            chainId: xdc.id ? xdc.id : chainId,
          });
        }}
      >
        Connect
      </Button>
    );
  }
};

export default Connect;
