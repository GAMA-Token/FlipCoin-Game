import { useAccount } from "wagmi";
import { Account } from "../components/Account";
import Step1 from "../assets/step1.png";
import Step2 from "../assets/step2.png";
import StepCard from "@/components/StepCard";
import Connect from "@/components/Connect";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

const Home = () => {
  const { isConnected } = useAccount();
  const [toolTip, setToolTip] = useState("Copy To Clipboard");
  const [showTooltip, setShowTooltip] = useState(false);
  const xinfinAddress = import.meta.env.VITE_XDC_MAINNET_CONTRACT_ADDRESS;

  const handleCopyText = () => {
    navigator.clipboard
      .writeText(xinfinAddress)
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
    <>
      {isConnected ? (
        <Account />
      ) : (
        <div className="flex-grow flex flex-col justify-start py-5 px-10 items-center">
          <h1 className="text-4xl font-bold mb-4">Getting Started!</h1>
          <div className="flex flex-col gap-6 mt-4">
            <StepCard
              stepNumber={1}
              header={
                <div className="w-full md:w-auto flex justify-center ">
                  <div className="relative max-w-52">
                    <img src={Step1} alt={`Step 1`} className="object-contain h-full w-full overflow-hidden " />
                  </div>
                </div>
              }
              description={
                <p className="text-base">
                  If you haven't already installed MetaMask, download the MetaMask extension from its official website or your browser's extension
                  store. Once installed, click the MetaMask icon in your browser's toolbar to open it. Follow the prompts to create a new wallet,
                  ensuring you securely store your seed phrase, or import an existing wallet if you already have one.
                </p>
              }
            />
            <StepCard
              stepNumber={2}
              header={
                <div className="w-full md:w-auto flex justify-center my-4 mx-3">
                  <div className="relative  max-w-52">
                    <img src={Step2} alt={`Step 2`} className="object-contain   h-full w-full overflow-hidden " />
                  </div>
                </div>
              }
              isRtl
              description={
                <p className="text-base">
                  Open MetaMask and click on the network dropdown at the top of the window. Select "Custom RPC" to add a new network, and input the
                  necessary information to connect to the XinFin network, which has a chain ID of 50. Save these settings to switch your MetaMask to
                  the XinFin network seamlessly.
                </p>
              }
            />

            <StepCard
              stepNumber={3}
              header={
                <div className="w-full md:w-auto flex justify-center ">
                  <div className="relative my-4 mx-3 max-w-52">
                    <img
                      src={"https://gamacoin.ai/assets/images/gama-logo.svg"}
                      alt={`Step 1`}
                      className="object-contain h-full w-full overflow-hidden "
                    />
                  </div>
                </div>
              }
              description={
                <p className="text-base">
                  In MetaMask, navigate to the "Assets" tab and select "Add Token" to include the Gama token to your wallet. Enter the contract
                  address{" "}
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
                          <div className="text-sm">{xinfinAddress}</div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{toolTip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>{" "}
                  in the appropriate field. Complete the token addition by saving your changes, which will allow you to manage and view your Gama
                  token balance.
                </p>
              }
            />
            <StepCard
              stepNumber={4}
              header={
                <div className="w-full md:w-auto flex justify-center ">
                  <div className="mx-[38px] my-[46px]">
                    <Connect />
                  </div>
                </div>
              }
              isRtl
              description={
                <p className="text-base">
                  Simply click the Connect Wallet button on the right to link your MetaMask wallet. Approve the connection request in MetaMask, and
                  you’re all set! Get ready to flip the coin, place your bets, and enjoy the excitement of the game!
                </p>
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
