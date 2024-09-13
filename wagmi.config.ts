// @ts-check
import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";

import Token from "./src/utils/abis/Token.json";
import Staking from "./src/utils/abis/Staking.json";

/** @type {import('@wagmi/cli').Config} */
export default defineConfig({
  out: "src/generated.js",
  contracts: [
    {
      name: "Token",
      abi: Token as any,
    },
    {
      name: "Staking",
      abi: Staking as any,
    },
  ],
  plugins: [actions(), react()],
});
