import * as sc from "./ABIS_and_Addresses.js";
import * as mm from "./detectmm.js";

const createNftContractInstance = () => {
    if(mm.isMetaMaskavailable()) {
        if(mm.isMMConnected()) {
            let web3 = new Web3(window.ethereum);
            const nftContract = new web3.eth.Contract(sc.nftABI,sc.nftAddress);
            nftContract.setProvider(window.ethereum);
            return nftContract;
        }
    }
}

const createMarketplaceContractInstance = () => {
    if(mm.isMetaMaskavailable()) {
        if(mm.isMMConnected()) {
            let web3 = new Web3(window.ethereum);
            const marketplaceContract = new web3.eth.Contract(sc.marketplaceABI,sc.nftMarketplaceAddress);
            marketplaceContract.setProvider(window.ethereum);
            return marketplaceContract;
        }
    }
}
const nftContract = createNftContractInstance();
const marketplaceContract = createMarketplaceContractInstance();

export const NFT = {
    mintNFT: async(metadataUrl) => {
        let tokenID;
        if(metadataUrl !== 'undefined' && metadataUrl !== null) {
            let minter = mm.getCurrentAccount();
            console.log(minter);
            tokenID = await nftContract.methods.createNFT(metadataUrl).send({from: minter}).then().catch(error => console.log(error));

            nftContract.events.Transfer({},(error, event) => {
                console.log(event);
                console.log(error);
            });
        }
        return tokenID;
    },

    getTokenURI: async (tokenId) => {
        let tokenURI;
        try {
            tokenURI = await nftContract.methods.tokenURI(tokenId).call();
        } catch(error) {
            console.log(error);
            return error;
        }
        return tokenURI; 
    },

    getTokenOwner: async (tokenId) => {
        let tokenOwner;
        try {
            tokenOwner = await nftContract.methods.ownerOf(tokenId).call();
        } catch(error) {
            console.log(error);
            return error;
        }
        return tokenOwner;
    },
    
    getTokenCountOfAnOwner: async (owner) => {
        let tokenCount;
        try {
            tokenCount = await nftContract.methods.balanceOf(owner).call();
        } catch(error) {
            console.log(error);
            return error;
        }
        return tokenCount;
    }
};

export let getAllOwnedTokensURIs = async (owner) => {
    let ownedCounter = await NFT.getTokenCountOfAnOwner(owner);
    let ownedTokensURIs = [];
    let tempTokenID = 1;
    while(ownedCounter > 0) {
        let tempOwner;
        try {
            tempOwner = await NFT.getTokenOwner(tempTokenID);
        } catch(error) {
            break;
        }
        if(owner.toLowerCase().toString() === tempOwner.toLowerCase().toString()) {
            let tempURI = await NFT.getTokenURI(tempTokenID);
            ownedTokensURIs.push(tempURI);
            ownedCounter--;
        }
        tempTokenID++;
    }
    if(ownedTokensURIs.length > 0) {
        return ownedTokensURIs;
    } else {
        return "there is no items owned by the caller";
    }
}

export const Marketplace = {
    createItemListingRequest : async (nft,tokenId,price) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            try {
                await marketplaceContract.methods.createListingRequest(nft,tokenId,price).send({from: currentAccount}).then().catch(error => console.log(error));
                await marketplaceContract.events.logPending({},function(error, event){console.log(event)});
                return "request has been made" 
            } catch(error) {
                console.log(error);
                return "ERROR request is not made"
            }
        } else {
            return "marketplace should be working in order to request item for listing"
        }
    },
    withdrawItemFromMarketplace : async (itemId) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            try {
                await marketplaceContract.methods.withdrawItem(itemId).send({from: currentAccount}).then().catch(error => console.log(error));
                await marketplaceContract.events.logRemoved({},function(error, event){console.log(event)});
                return "Item has been removed" 
            } catch(error) {
                console.log(error);
                return "ERROR Item is not removed"
            }
        } else {
            return "marketplace should be working and you should be the owner to withdrw the item"
        }
    },
    buyItem : async (itemId) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            try {
                await marketplaceContract.methods.BuyItem(itemId).send({from: currentAccount}).then().catch(error => console.log(error));
                await marketplaceContract.events.logSold({},function(error, event){console.log(event)});
                return "Item has been bought" 
            } catch(error) {
                console.log(error);
                return "ERROR Item is not bought"
            }
        } else {
            return "marketplace should be working and you should be a send the price of the items in order to buy it"
        }
    },
    acceptItem : async (itemId) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        let VALIDATOR_ROLE = Web3.utils.soliditySha3('VALIDATOR_ROLE');
        let isValidator = await marketplaceContract.methods.hasRole(VALIDATOR_ROLE,currentAccount).call();
        if(isPaused === false && isValidator === true) {
            try {
                await marketplaceContract.methods.acceptItem(itemId).send({from: currentAccount}).then().catch(error => console.log(error));
                await marketplaceContract.events.logListedForSale({},function(error, event){console.log(event)});
                return "Item has been accepted" 
            } catch(error) {
                console.log(error);
                return "ERROR Item is not accepted"
            }
        } else {
            return "marketplace should be working and you should be a validator in order to accept items"
        }
    },
    rejectItem : async (itemId) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        let VALIDATOR_ROLE = Web3.utils.soliditySha3('VALIDATOR_ROLE');
        let isValidator = await marketplaceContract.methods.hasRole(VALIDATOR_ROLE,currentAccount).call();
        if(isPaused === false && isValidator === true) {
            try {
                await marketplaceContract.methods.rejectItem(itemId).send({from: currentAccount}).then().catch(error => console.log(error));
                await marketplaceContract.events.logRemoved({},function(error, event){console.log(event)});
                return "Item has been rejected" 
            } catch(error) {
                console.log(error);
                return "ERROR Item is not rejected"
            }
        } else {
            return "marketplace should be working and you should be a validator in order to reject items"
        }
    },
    changeItemPrice : async (itemId,newPrice) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            try {
                await marketplaceContract.methods.changeItemPrice(itemId,newPrice).send({from: currentAccount}).then().catch(error => console.log(error));
                await marketplaceContract.events.logPriceChanged({},function(error, event){console.log(event)});
                return "Item price has been changed successfully" 
            } catch(error) {
                console.log(error);
                return "ERROR Item price is not changed"
            }
        } else {
            return "marketplace should be working and you should be the item owner to change the item price"
        }
    },
    getNumOfPendingItems: async () => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let pendingCount;
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === false) {
                try {
                    pendingCount = await marketplaceContract.methods.getNumberOfPendingNFTS().call();
                } catch (err) {
                    console.log(err);
                    return "ERROR: couldn't get number of pending nfts";
                }
            } else {
                return "the marketplace should be working to get the number of pending nfts";
            }
        }
        if(pendingCount !== 'undefined') {
            return pendingCount;
        } else {
            return "there is no pending items"
        }
    },
    getPendingItems : async () => {
        let currentAccount = mm.getCurrentAccount();
        let pendingItems;
        let isPaused = await marketplaceContract.methods.paused().call();
        let VALIDATOR_ROLE = Web3.utils.soliditySha3('VALIDATOR_ROLE');
        let isValidator = await marketplaceContract.methods.hasRole(VALIDATOR_ROLE,currentAccount).call();
        if(isPaused === false && isValidator === true) {
            try {
                pendingItems = await marketplaceContract.methods.getAllPedningItems().call();
            } catch(error) {
                console.log(error);
                return "ERROR Item is not accepted"
            }
        } else {
            return "marketplace should be working and you should be a validator in order to accept items"
        }
        if(pendingItems !== 'undefined') {
            return pendingItems;
        } else {
            return "there is no pending items"
        }
    },
    getNumberOfSoldItems : async () => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let soldCount;
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === false) {
                try {
                    soldCount = await marketplaceContract.methods.getNumberOfSoldNFTS().call();
                } catch (err) {
                    console.log(err);
                    return "ERROR: couldn't get number of sold nfts";
                }
            } else {
                return "the marketplace should be working to get the number of sold nfts";
            }
        }
        if(soldCount !== 'undefined') {
            return soldCount;
        } else {
            return "there is no sold items"
        }
    },
    getSoldItems : async () => {
        let soldItems;
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === false) {
                try {
                    soldItems = await marketplaceContract.methods.getAllSoldItems().call();
                } catch (err) {
                    console.log(err);
                    return "ERROR: getting sold items";
                }
            } else {
                return "the marketplace should be working to get the sold items";
            }
        }
        if(soldItems !== 'undefined') {
            return soldItems;
        } else {
            return "there is no sold items"
        }
    },
    getNumberOfAllItems : async () => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let itemsCount;
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === false) {
                try {
                    itemsCount = await marketplaceContract.methods.getNumberOfAllNFTS().call();
                } catch (err) {
                    console.log(err);
                    return "ERROR: couldn't get number of all nfts";
                }
            } else {
                return "the marketplace should be working to get the number of all nfts";
            }
        }
        if(itemsCount !== 'undefined') {
            return itemsCount;
        } else {
            return "there is no items in the marketplace"
        }
    },
    getListedItems : async () => {
        let listedItems;
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            try {
                listedItems = await marketplaceContract.methods.getAllListedItems().call();
            } catch(error) {
                console.log(error);
                return "ERROR in getting listed items"
            }
        } else {
            return "marketplace should be working in order to retrieve listed items"
        }
        if(listedItems !== 'undefind') {
            return listedItems;
        } else {
            return "no items is listed in the marketplace"
        }
    }, 
    getRemovedItems : async () => {
        let currentAccount = mm.getCurrentAccount();
        let removedItems;
        let isPaused = await marketplaceContract.methods.paused().call();
        let VALIDATOR_ROLE = Web3.utils.soliditySha3('VALIDATOR_ROLE');
        let isValidator = await marketplaceContract.methods.hasRole(VALIDATOR_ROLE,currentAccount).call();
        if(isPaused === false && isValidator === true) {
            try {
                removedItems = await marketplaceContract.methods.getAllRemovedItems().call();
            } catch(error) {
                console.log(error);
                return "ERROR getting removed items"
            }
        } else {
            return "marketplace should be working to get the removed items"
        }
        if(removedItems !== 'undefined') {
            return removedItems;
        } else {
            return "there is no removed items"
        }
    },
    getItemListedByCaller : async () => { //getItemscreated
        let createdItems;
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            try {
                createdItems = await marketplaceContract.methods.getItemsCreated().call();
            } catch(error) {
                console.log(error);
                return "ERROR in getting created items"
            }
        } else {
            return "marketplace should be working in order to retrieve created items"
        }
        if(createdItems !== 'undefind') {
            return createdItems;
        } else {
            return "no items is created by the caller"
        }
    },
    getItemsPurchased : async () => { //getMyNFTS
        let purchasedItems;
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            try {
                purchasedItems = await marketplaceContract.methods.getMyNFTS().call();
            } catch(error) {
                console.log(error);
                return "ERROR in getting purchased items"
            }
        } else {
            return "marketplace should be working in order to retrieve purchased items"
        }
        if(purchasedItems !== 'undefind') {
            return purchasedItems;
        } else {
            return "no items is purchased by the caller"
        }
    },
    addValidator : async (validator) => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString() &&
           validator !== marketplaceOwner && validator.toString !== '0' ) {
            if(isPaused === false) {
                try {
                    await marketplaceContract.methods.grantValidator(validator).send({from: currentAccount}).then().catch(error => console.log(error));
                    let VALIDATOR_ROLE = Web3.utils.soliditySha3('VALIDATOR_ROLE');
                    let isValidator = await marketplaceContract.methods.hasRole(VALIDATOR_ROLE,validator).call();
                    await nftMarketplace.events.RoleGranted({},function(error, event){console.log(event)});
                    if(isValidator === true) {
                        return "validator is added successfully"
                    } else {
                        return 'error in adding validator';
                    }
                } catch(err) {
                    console.log(error);
                    return "ERROR in adding the validator"
                }
            } else {
                return "you should the marketplace owner in order to add a new validator"
            }
        }
    },
    removeValidator : async (validator) => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString() &&
           validator !== marketplaceOwner && validator.toString !== '0' ) {
            if(isPaused === false) {
                try {
                    await marketplaceContract.methods.revokeValidator(validator).send({from: currentAccount}).then().catch(error => console.log(error));
                    let VALIDATOR_ROLE = Web3.utils.soliditySha3('VALIDATOR_ROLE');
                    let isValidator = await marketplaceContract.methods.hasRole(VALIDATOR_ROLE,validator).call();
                    await nftMarketplace.events.RoleRevoked({},function(error, event){console.log(event)});
                    if(isValidator === false) {
                        return "validator is removed successfully"
                    } else {
                        return 'error in removing validator';
                    }
                } catch(err) {
                    console.log(error);
                    return "ERROR in removing the validator"
                }
            } else {
                return "you should the marketplace owner in order to remove a validator"
            }
        }
    },
    getListingPrice: async () => {
        let isPaused = await marketplaceContract.methods.paused().call();
        let listingPrice;
        if(isPaused === false) {
            try {
                listingPrice = await marketplaceContract.methods.getListingPrice().call(); 
            } catch(err) {
                console.log(err);
            }
        }
        if(listingPrice !== 'undefined') {
            return listingPrice;
        } else {
            return "couldn't get listing price"
        }
    },
    changeListingPrice : async (newListingPrice) => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === true) {
                try {
                    let result = await marketplaceContract.methods.changeListingPrice(newListingPrice).send({from: currentAccount}).then().catch(error => console.log(error));
                    console.log(result);
                    await marketplaceContract.events.logListingPriceChanged({},(error, event) => {
                        console.log(event);
                        console.log(error);
                    })
                    return "marketplace listing price changed successfully"
                } catch(err) {
                    console.log(error);
                    return "ERROR in changing marketplace listing price"
                }
            } else {
                return "you should pause the marketplace first in order to change the listing price"
            }
        }
    },
    pauseMarketplace: async () => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === false) {
                try {
                    await marketplaceContract.methods.Pause().send({from: currentAccount}).then().catch(error => console.log(error));
                    return "Marketplace Paused successfully";
                } catch (err) {
                    console.log(err);
                    return "ERROR: couldn't Paused successfully";
                }
            } else {
                return "the marketplace should be unpaused in order to pause it";
            }
        }
    },
    unpauseMarketplace : async () => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === true) {
                try {
                    await marketplaceContract.methods.Unpause().send({from: currentAccount}).then().catch(error => console.log(error));
                    return "Marketplace unpaused successfully";
                } catch (err) {
                    console.log(err);
                    return "ERROR: couldn't unpaused successfully";
                }
            } else {
                return "the marketplace should be paused in order to unpause it"
            }
        }
    },
    getOwnerAddress: async () => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        return marketplaceOwner;
    }
    
}
export let isValidator = async (address) => {
    let VALIDATOR_ROLE = Web3.utils.soliditySha3('VALIDATOR_ROLE');
    let isValidator;
    try {
        isValidator = await marketplaceContract.methods.hasRole(VALIDATOR_ROLE,address).call();
    } catch (err) {
        console.log(err);
    }
    return isValidator;
}