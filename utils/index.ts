import * as naj from "near-api-js";
import config from "../config";

export const getNearConfig = (env: string): naj.ConnectConfig => {
  const keyStore = new naj.keyStores.InMemoryKeyStore();

  const keyPair = naj.KeyPair.fromString(config.PRIVATE_KEY);

  switch (env) {
    case "development":
      keyStore.setKey("testnet", config.CONTRACT_ID, keyPair);

      return {
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        keyStore,
        headers: {},
      };
    case "production":
      keyStore.setKey("mainnet", config.CONTRACT_ID, keyPair);

      return {
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        keyStore,
        headers: {},
      };
    default:
      throw new Error(`Invalid env provided for getNearConfig()`);
  }
};
