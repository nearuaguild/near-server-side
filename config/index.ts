import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: 8080,
  PRIVATE_KEY: process.env.PRIVATE_KEY as string,
  CONTRACT_ID: process.env.CONTRACT_ID as string,
  NETWORK: process.env.NETWORK || "development",
};
