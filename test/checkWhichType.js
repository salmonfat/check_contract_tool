const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
//const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const ERC721interface = 0x80ac58cd;
const ERC1155interface = 0xd9b67a26;
const AccessControlinterface = 0x7965db0b;
const fallbackInterface = 0xffffffff;
const notOwnerString = "Ownable: caller is not the owner";
const accessControlSrting ="AccessControl";

async function deployedContract() {
  const [owner, otherAccount] = await ethers.getSigners();
  const _theContract = await ethers.getContractFactory("accessControlWallet"); //合約名稱
  const theContract = await _theContract.deploy(); //部署合約參數
  await theContract.deployed();
  const contractAbi = theContract.interface.format();
  return { theContract, owner, contractAbi, otherAccount };
}

function getExampleValueForType(type) {
  switch (type) {
    case 'address': return "0x8ba1f109551bd432803012645ac136ddd64dba72";
    case 'string': return 'https';
    case 'uint256': return 0;
    case 'bool': return false;
    case 'bytes4': return 0x7985db0b; //
    case 'bytes32': return "0x0000000000000000000000000000000000000000000000000000000000000000"; //N
  }
}

describe("check which type", function () {
  describe("test", function () {
    it("Is ERC721 ?", async function () {
      const { theContract } = await loadFixture(deployedContract);
      let result = false;
      if (await theContract.supportsInterface(ERC721interface)) {
        if (!(await theContract.supportsInterface(fallbackInterface))) {
          result = true;
        }
      }
      expect(result).to.equal(true);
    });

    it("Is ERC1155 ?", async function () {
      const { theContract } = await loadFixture(deployedContract);
      let result = false;
      if (await theContract.supportsInterface(ERC1155interface)) {
        if (!(await theContract.supportsInterface(fallbackInterface))) {
          result = true;
        }
      }
      expect(result).to.equal(true);
    });

    it("Is ERC20/ERC777 ?", async function () { //可能會有的bug，uint256在JS裡的型別是object
      const { theContract } = await loadFixture(deployedContract);
      const name = await theContract.name();
      const symbol = await theContract.symbol();
      const decimals = await theContract.decimals();
      let hasDecimals = false;
      if (typeof decimals == typeof 10) { //一般decimals回傳值是uint8
        hasDecimals = true;
      } else if (typeof decimals == typeof ethers.utils.parseEther("1")) { //有些合約decimals回傳值卻是uint256  像是USDT
        hasDecimals = true;
      }
      expect(typeof name).to.equal(typeof "String");
      expect(typeof symbol).to.equal(typeof "String");
      expect(hasDecimals).to.equal(true);
    });

    it("Is AccessControl ?", async function () {
      const { theContract, otherAccount } = await loadFixture(deployedContract);
      let result = false;
      if (await theContract.supportsInterface(AccessControlinterface)) {
        if (!(await theContract.supportsInterface(fallbackInterface))) {
          result = true;
        }
      }
      expect(result).to.equal(true);
      if (result == true) {
        let funcSig = await getAllFunctionSignature();
        for (let i = 0; i < funcSig.length; i++) {
          const match = funcSig[i].match(/(\w+)\((.*)\)/);
          if (match) {
            const functionName = match[1];
            const paramTypes = match[2].length > 0 ? match[2].split(',') : [];
            const params = paramTypes.map(getExampleValueForType);
            //console.log(functionName, params.length);
            try {
              await theContract.connect(otherAccount)[functionName](...params);
              //console.log("PASS:",functionName);
            } catch (error) {
              //console.log(functionName, error.message);
              const startIndex = error.message.indexOf("reverted with reason string '") + "reverted with reason string '".length;
              const endIndex = error.message.lastIndexOf(":");
              const revertReason = error.message.substring(startIndex, endIndex);
              if (revertReason == accessControlSrting) {
                console.log("access control:",functionName);
              }
            }
          }
        }
      }
    });

    it("Is Ownable ?", async function () {
      const { theContract, owner, otherAccount } = await loadFixture(deployedContract);
      const ownerAdd = await theContract.owner();
      let result = false;
      if (ownerAdd == owner.address) {
        result = true;
      }
      expect(result).to.equal(true);
      if (result == true) {
        let funcSig = await getAllFunctionSignature();
        for (let i = 0; i < funcSig.length; i++) {
          const match = funcSig[i].match(/(\w+)\((.*)\)/);
          if (match) {
            const functionName = match[1];
            const paramTypes = match[2].length > 0 ? match[2].split(',') : [];
            const params = paramTypes.map(getExampleValueForType);
            //console.log(functionName, params.length);
            try {
              await theContract.connect(otherAccount)[functionName](...params);
              //console.log("PASS:",functionName);
            } catch (error) {
              //console.log(functionName, error.message);
              const startIndex = error.message.indexOf("reverted with reason string '") + "reverted with reason string '".length;
              const endIndex = error.message.lastIndexOf("'");
              const revertReason = error.message.substring(startIndex, endIndex);
              if (revertReason == notOwnerString) {
                console.log("onlyOwner:",functionName);
              }
            }
          }
        }
      }
    });
  });
});

async function getAllFunctionSignature() {
  const { contractAbi } = await loadFixture(deployedContract);
  const functionSignatures = contractAbi.filter(item => item.startsWith('function'))
    .map(func => {
      const match = func.match(/function ([^(]*)\(([\w,\s]*)\)/);
      if (match) {
        const name = match[1];
        const inputs = match[2].split(',').map(input => input.trim().split(' ')[0]).join(',');
        return `${name}(${inputs})`;
      }
    });
  return functionSignatures;
}

