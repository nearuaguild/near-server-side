import config from "./config";
import verifyConfig from "./config/verify";
verifyConfig();

import cors from "cors";
import express from "express";
import { param, body } from "express-validator";
import * as naj from "near-api-js";
import { getNearConfig } from "./utils";
import { FungibleTokenContract } from "./contracts/fungible_token";
import checkValidationResult from "./middlewares/check_validation_result";
import { BN } from "bn.js";

let contract: FungibleTokenContract;

const app = express();

app.use(cors());
app.use(express.json());

app.get(
  "/balance/:address",
  param("address").notEmpty(),
  param("address").isString(),
  checkValidationResult,
  async (req, res) => {
    const address = req.params.address as string;

    try {
      const balance = await contract.ftBalanceOf({ account_id: address });

      console.log("balance", balance);

      return res.status(200).send(balance);
    } catch {
      return res.status(200).send("0");
    }
  }
);

app.post(
  "/allocate/:address",
  param("address")
    .notEmpty()
    .withMessage(`'address' is missing`)
    .isString()
    .withMessage(`'address' must be a string`),
  body("amount")
    .notEmpty()
    .withMessage(`'amount' is missing`)
    .isInt({ min: 1 })
    .withMessage(`'amount' must be a positive integer`)
    .isInt({ max: 1_000 })
    .withMessage(
      `Allocations for more than 1.000 tokens per time aren't allowed`
    ),
  checkValidationResult,
  async (req, res) => {
    const address = req.params.address as string;
    const amount = req.body.amount as string;

    console.log("address", address);
    console.log("amount", amount);

    try {
      await contract.ftTransfer(
        {
          receiver_id: address,
          amount: amount,
        },
        { attachedDeposit: new BN(1) }
      );

      return res.sendStatus(200);
    } catch {
      return res.sendStatus(500);
    }
  }
);

(async () => {
  const nearConfig = getNearConfig(config.NETWORK);

  console.debug(`[near.network]`, nearConfig.networkId);

  const near = await naj.connect(nearConfig);

  const account = new naj.Account(near.connection, config.CONTRACT_ID);

  contract = new FungibleTokenContract(account, config.CONTRACT_ID);

  app.listen(config.PORT, () => {
    console.log(`App listening on port ${config.PORT}`);
  });
})();
