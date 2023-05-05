require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.4.18",
      },
      {
        version: "0.5.12",
      },
      {
        version: "0.6.12",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    bear: {
      url: `${process.env.BN_URL}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    } 
  }
};
