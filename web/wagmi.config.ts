// generate Cartesi-specific hooks for milkyadverb interaction. will change later to use LayerZero specific hooks

import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";

export default defineConfig({
  out: "src/hooks/generated.ts", // the output file for the hooks
  contracts: [],
  plugins: [
    hardhatDeploy({
      directory: "node_modules/@cartesi/rollups/export/abi",
    }),
    react(),
  ],
});
