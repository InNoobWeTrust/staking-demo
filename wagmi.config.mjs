// @ts-check
import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";

import PartnerAIContract from "./src/utils/abis/Token.json";
import StakingContract from "./src/utils/abis/Staking.json";
import ADDRESSES from './src/utils/constants/ADDRESSES.json'

/** @type {import('@wagmi/cli').Config} */
export default defineConfig({
  out: "src/contract.generated.js",
  contracts: [
    {
      name: "PartnerAIContract",
      abi: PartnerAIContract,
      address: `0x${ADDRESSES.TOKEN_ADDRESS.slice(2)}`,
    },
    {
      name: "StakingContract",
      abi: StakingContract,
      address: `0x${ADDRESSES.STAKING_ADDRESS.slice(2)}`,
    },
  ],
  plugins: [
    actions({
      overridePackageName: '@wagmi/core',
    })
  ],
});
