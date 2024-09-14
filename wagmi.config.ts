// @ts-check
import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";

import PartnerAIContract from "./src/utils/abis/Token.json";
import StakingContract from "./src/utils/abis/Staking.json";

/** @type {import('@wagmi/cli').Config} */
export default defineConfig({
  out: "src/contract.generated.js",
  contracts: [
    {
      name: "PartnerAIContract",
      abi: PartnerAIContract as any,
    },
    {
      name: "StakingContract",
      abi: StakingContract as any,
    },
  ],
  plugins: [actions(), react()],
});
