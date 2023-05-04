
const hre = require("hardhat");

async function main() {

  const [owner] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("testerc20");
  const contract = await contractFactory.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
  console.log("Contract owner address:", owner.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });