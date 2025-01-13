import { xdc, xdcTestnet } from "viem/chains";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [xdc, xdcTestnet],
  connectors: [injected()],
  transports: {
    [xdc.id]: http(),
    [xdcTestnet.id]: http(),
  },
});
