// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/* 權限樹狀圖

                                      owner
                                      /   \
                                     /     \
                                  admin     admin
                                  /   |    |    \
                                 /    |    |     \
                            token  token  token   token 
*/

contract accessControlWallet is AccessControl, Ownable, ReentrancyGuard{
    bytes32 public constant adminRole=keccak256("adminRole"); //有指派角色的權利
    bytes32 public constant transferToken=keccak256("transferToken"); //有轉移代幣權限

    /**
     * @dev 監控代幣轉移
     * @param token 代幣地址，如果是address(0) 則代表原生代幣
     */
    event TransferOut(address indexed token, address indexed to, uint256 value);

    /**
     * @dev 監控誰轉原生代幣進來
     */
    event receiveCoin(address indexed from, uint256 value);

    
    constructor(){
        _setRoleAdmin(transferToken, adminRole);
        _grantRole(adminRole,owner());
        _grantRole(transferToken,owner());
    }

    /**
     * @dev 指派admin,只有owner可以使用
     * @param account 新管理者的地址
     * @param _switch true是新增管理者，false是撤銷管理者
     */
    function setAdmin(address account, bool _switch)external onlyOwner{
        if(_switch){
            _grantRole(adminRole, account);
        }
        else{
            _revokeRole(adminRole, account);
        }
    }

    /**
     * @dev 傳送ERC20代幣   像是USDT
     * @param token 代幣地址
     * @param to 轉給誰
     * @param amount 轉的數量(尚未計算decimals)
     */
    function transferERC20(address token, address to, uint amount)external onlyRole(transferToken) nonReentrant{
        IERC20 theToken=IERC20(token);
        theToken.transfer(to,amount);
        emit TransferOut(token,to,amount);
    }

    /**
     * @dev 傳送原生代幣  像是ETH
     * @param to 轉給誰
     * @param amount 轉的數量(尚未計算decimals)
     */
    function transferCoin(address to, uint amount)external onlyRole(transferToken) nonReentrant{
        (bool success,)=payable(to).call{value: amount}("");
        require(success,"transfer fail");
        emit TransferOut(address(0),to,amount);
    }

    /**
     * @dev 複寫transferOwnership，在轉移前撤銷舊owner所有權限，轉移後新增新owner所有權限
     * @param newOwner 新owner
     */
    function transferOwnership(address newOwner) public override onlyOwner{
        renounceRole(adminRole,owner());
        renounceRole(transferToken,owner());
        super.transferOwnership(newOwner);
        _grantRole(adminRole,owner());
        _grantRole(transferToken,owner());
    }

    fallback()external payable{
        emit receiveCoin(msg.sender, msg.value);
    }
}
