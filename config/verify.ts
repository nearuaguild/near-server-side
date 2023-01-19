import config from "../config";

const verifyConfig = (): void => {
  if (!config.CONTRACT_ID)
    throw new Error(`'CONTRACT_ID' must be provided in your .env`);
  if (!config.PRIVATE_KEY)
    throw new Error(`'PRIVATE_KEY' must be provided in your .env`);
};

export default verifyConfig;
