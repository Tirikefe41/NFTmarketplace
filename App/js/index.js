// contracts addresses on Rinkeby:
const nftMarketplaceAddress = '0x77EAe40e83824C8736db06bb594DFA71917F856B'
const nft = '0xD3B4B1C5B24a8ae444a21ca2E78f80bDBBe28f81';
// const adminAddress = '0x92924b15E346B12A9f7a50f7050cb60b653Ec096'

const nftAPI =
[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "marketplaceAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "createNFT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMarketplaceAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
const marketplaceABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_listingPrice",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      }
    ],
    "name": "logListedForSale",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newListingPrice",
        "type": "uint256"
      }
    ],
    "name": "logListingPriceChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "enum NFTMarketplace.State",
        "name": "itemState",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address payable",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address payable",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "nft",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isSold",
        "type": "bool"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "logPending",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPrice",
        "type": "uint256"
      }
    ],
    "name": "logPriceChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      }
    ],
    "name": "logRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "itemId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      }
    ],
    "name": "logSold",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "VALIDATOR_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokenID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "createListingRequest",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "withdrawItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "BuyItem",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "acceptItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      }
    ],
    "name": "rejectItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_itemId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_newPrice",
        "type": "uint256"
      }
    ],
    "name": "changeItemPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumberOfPendingNFTS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumberOfSoldNFTS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumberOfAllNFTS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllListedItems",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenID",
            "type": "uint256"
          },
          {
            "internalType": "enum NFTMarketplace.State",
            "name": "itemState",
            "type": "uint8"
          },
          {
            "internalType": "address payable",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "contract AnimeNFT",
            "name": "nft",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isSold",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "internalType": "struct NFTMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllSoldItems",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenID",
            "type": "uint256"
          },
          {
            "internalType": "enum NFTMarketplace.State",
            "name": "itemState",
            "type": "uint8"
          },
          {
            "internalType": "address payable",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "contract AnimeNFT",
            "name": "nft",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isSold",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "internalType": "struct NFTMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPedningItems",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenID",
            "type": "uint256"
          },
          {
            "internalType": "enum NFTMarketplace.State",
            "name": "itemState",
            "type": "uint8"
          },
          {
            "internalType": "address payable",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "contract AnimeNFT",
            "name": "nft",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isSold",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "internalType": "struct NFTMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllRemovedItems",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenID",
            "type": "uint256"
          },
          {
            "internalType": "enum NFTMarketplace.State",
            "name": "itemState",
            "type": "uint8"
          },
          {
            "internalType": "address payable",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "contract AnimeNFT",
            "name": "nft",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isSold",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "internalType": "struct NFTMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getItemsCreated",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenID",
            "type": "uint256"
          },
          {
            "internalType": "enum NFTMarketplace.State",
            "name": "itemState",
            "type": "uint8"
          },
          {
            "internalType": "address payable",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "contract AnimeNFT",
            "name": "nft",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isSold",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "internalType": "struct NFTMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyNFTS",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "itemID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenID",
            "type": "uint256"
          },
          {
            "internalType": "enum NFTMarketplace.State",
            "name": "itemState",
            "type": "uint8"
          },
          {
            "internalType": "address payable",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "contract AnimeNFT",
            "name": "nft",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isSold",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "internalType": "struct NFTMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newValidator",
        "type": "address"
      }
    ],
    "name": "grantValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ToBeRevokedValidator",
        "type": "address"
      }
    ],
    "name": "revokeValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMarketplaceOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getListingPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "Pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "Unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newListingPrice",
        "type": "uint256"
      }
    ],
    "name": "changeListingPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "onERC721Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
]

// Using the 'load' event listener for Javascript to
// check if window.ethereum is available

window.addEventListener('load', async() => {
  if (typeof window.ethereum !== 'undefined') {
    console.log('window.ethereum is enabled')
    if (window.ethereum.isMetaMask === true) {
      console.log('MetaMask is active')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += 'MetaMask Is Available!'
      // add in web3 here
      let web3 = new Web3(window.ethereum)
    } else {
      console.log('MetaMask is not available')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += 'MetaMask Not Available!'
    }
  } else {
    console.log('window.ethereum is not found')
    let mmDetected = document.getElementById('mm-detected')
    mmDetected.innerHTML += 'MetaMask Not Available!'
  }
})


let web3 = new Web3(window.ethereum)

// Grabbing the button object,  

const mmConnect = document.getElementById('mm-connect');
mmConnect.onclick = async () => {
  await ethereum.request({ method: 'eth_requestAccounts'})
  // grab mm-current-account
  // and populate it with the current address
  var mmCurrentAccount = document.getElementById('mm-current-account');
  mmCurrentAccount.innerHTML = 'Current Account: ' + ethereum.selectedAddress
}

// grab the button for input to a contract:

const ssSubmit = document.getElementById('ss-input-button');

ssSubmit.onclick = async () => {
  // grab value from input
  
  const ssInputValue = document.getElementById('ss-input-box').value;
  console.log(ssInputValue)

  var web3 = new Web3(window.ethereum)

  // instantiate smart contract instance
  
  const simpleStorage = new web3.eth.Contract(ssABI, ssAddress)
  simpleStorage.setProvider(window.ethereum)

  await simpleStorage.methods.store(ssInputValue).send({from: ethereum.selectedAddress})

}

const ssGetValue = document.getElementById('ss-get-value')

ssGetValue.onclick = async () => {

  let web3 = new Web3(window.ethereum)
  // window.ethereum.enable();
  
  const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
  nftMarketplace.setProvider(window.ethereum);

  let value = await nftMarketplace.methods.getMarketplaceOwner().call();

  console.log(value)

  const ssDisplayValue = document.getElementById('ss-display-value')

  ssDisplayValue.innerHTML = 'Current Simple Storage Value: ' + value

}

