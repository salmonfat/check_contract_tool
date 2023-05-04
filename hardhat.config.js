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
        version: "0.4.17",
      },
    ],
  },
  networks: {
    bear: {
      url: `${process.env.BN_URL}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    } 
  }
};
