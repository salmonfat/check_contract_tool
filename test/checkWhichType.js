const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("check which type", function () {
  async function deployedContract() {

    const ERC721interface = 0x80ac58cd;
    const ERC1155interface = 0xd9b67a26;
    const fallbackInterface = 0xffffffff;

    const [owner, otherAccount] = await ethers.getSigners();

    const _theContract = await ethers.getContractFactory("testerc721"); //合約名稱
    const theContract = await _theContract.deploy(); //部署合約參數

    return { theContract, ERC721interface, ERC1155interface, fallbackInterface, owner};
  }

  describe("test", function () {
    it("Is ERC721 ?", async function () {
      const { theContract,ERC721interface,fallbackInterface } = await loadFixture(deployedContract);
      let result =false;
      if (await theContract.supportsInterface(ERC721interface)){
        if (!(await theContract.supportsInterface(fallbackInterface))){
          result=true;
        }
      }
      expect(result).to.equal(true);
    });

    it("Is ERC1155 ?", async function () {
      const { theContract, ERC1155interface,fallbackInterface } = await loadFixture(deployedContract);
      let result =false;
      if (await theContract.supportsInterface(ERC1155interface)){
        if (!(await theContract.supportsInterface(fallbackInterface))){
          result=true;
        }
      }
      expect(result).to.equal(true);
    });

    it("Is ERC20/ERC777 ?", async function () {
      const { theContract } = await loadFixture(deployedContract);
      const name = await theContract.name();
      const symbol= await theContract.symbol();
      const decimals = await theContract.decimals();
      expect(typeof name).to.equal(typeof "String");
      expect(typeof symbol).to.equal(typeof "String");
      expect(typeof decimals).to.equal(typeof 10);
    });

  });
});
