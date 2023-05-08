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
    const AccessControlinterface = 0x7965db0b;
    const fallbackInterface = 0xffffffff;

    const [owner, otherAccount] = await ethers.getSigners();

    const _theContract = await ethers.getContractFactory("Zapper_NFT_V2_0_1"); //合約名稱
    const theContract = await _theContract.deploy("s","s","s",owner.address,owner.address,10); //部署合約參數

    return { theContract, ERC721interface, ERC1155interface, AccessControlinterface, fallbackInterface, owner};
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

    it("Is ERC20/ERC777 ?", async function () { //可能會有的bug，uint256在JS裡的型別是object
      const { theContract } = await loadFixture(deployedContract);
      const name = await theContract.name();
      const symbol= await theContract.symbol();
      const decimals = await theContract.decimals();
      let hasDecimals = false;
      if(typeof decimals == typeof 10){ //一般decimals回傳值是uint8
        hasDecimals = true;
      }else if(typeof decimals== typeof ethers.utils.parseEther("1")){ //有些合約decimals回傳值卻是uint256
        hasDecimals = true;
      }
      expect(typeof name).to.equal(typeof "String");
      expect(typeof symbol).to.equal(typeof "String");
      expect(hasDecimals).to.equal(true);
    });

    it("Is AccessControl ?", async function () {
      const { theContract, AccessControlinterface,fallbackInterface } = await loadFixture(deployedContract);
      let result =false;
      if (await theContract.supportsInterface(AccessControlinterface)){
        if (!(await theContract.supportsInterface(fallbackInterface))){
          result=true;
        }
      }
      expect(result).to.equal(true);
    });

    it("Is Ownable ?", async function () {
      const { theContract,owner} = await loadFixture(deployedContract);
      const ownerAdd= await theContract.owner();
      expect(ownerAdd).to.equal(owner.address);
    });

  });
});
