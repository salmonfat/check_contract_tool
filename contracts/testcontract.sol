pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract testerc20 is ERC20{
    constructor()ERC20("ff","dd"){

    }
    function mint()external{
        _mint(msg.sender,100);
    }
}

contract testerc721 is ERC721{
    constructor()ERC721("ff","dd"){

    }
    function mint()external{
        _mint(msg.sender,1);
    }
}

contract testerc1155 is ERC1155{
    constructor()ERC1155("ff"){

    }
    function mint()external{
        _mint(msg.sender,1,1,"");
    }
}