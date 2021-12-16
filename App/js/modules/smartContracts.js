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

            await nftContract.methods.createNFT(metadataUrl).send({from: minter})
            .then((res) => {
                tokenID = res;
                console.log(res);
                alert('Congratulations, new item is created successfully');
            }).catch(error => {
                console.log(error);
                alert('falied to create new item');
            });

            await nftContract.events.Transfer({},(error, event) => {
                console.log(event);
                console.log(error);
            }).on('data', async(event) => {
                console.log(event);
            }).on('error', async(error) => {
                console.log(error);
            })
        }
        if(tokenID !== 'undefined') {
            return tokenID;
        }
    },

    getTokenURI: async (tokenId) => {
        let tokenURI;

        await nftContract.methods.tokenURI(tokenId).call()
        .then((res) => {
            console.log(res);
            tokenURI = res;
        }).catch((error) => {
            console.log(error);
            console.log('failed to get token uri')
        });
        
        if(tokenURI !== 'undefined') {
            return tokenURI;
        }
    },

    getTokenOwner: async (tokenId) => {
        let tokenOwner;

        await nftContract.methods.ownerOf(tokenId).call()
        .then((res) => {
            console.log(res);
            tokenOwner = res;    
        })
        .catch((error) => {
            console.log(error);
            alert('failed to get token owner');
        });

        if(tokenOwner !== 'undefined') {
            return tokenOwner;
        }
    },
    
    getTokenCountOfAnOwner: async (owner) => {
        let tokenCount;

        await nftContract.methods.balanceOf(owner).call()
        .then((res) => {
            console.log(res);
            tokenCount = res;
        })
        .catch((error) => {
            console.log(error);
            alert('failed to get token count');
        });

        if(tokenCount !== 'undefined') {
            return tokenCount;
        }
    },

    getApproved: async (tokenID) => {
        let isApproved;
        
        await nftContract.methods.getApproved(tokenID).call()
        .then((res) => {
            isApproved = res;
        })
        .catch((error) => {
            console.log(error);
            alert('faile to get approved address of the NFT');
        });

        if(isApproved !== 'undefined') {
            return isApproved;
        }
    },

    setApproved: async (tokenID) => {
        let currentAccount = await mm.getCurrentAccount();
        let marketplace = sc.nftMarketplaceAddress;

        await nftContract.methods.approve(marketplace,tokenID).send({from: currentAccount})
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
            alert('failed to approve address')
        });
    }
};

export let getListingPrice = async () => {
    let isPaused = await isMarketplacePaused();
    let listingPrice;
    if(isPaused === false) {
        await marketplaceContract.methods.getListingPrice().call()
        .then((res) => {
            listingPrice = res;
        })
        .catch((error) => {
            console.log(error);
            console.log('failed to get listing price');
        }); 
    }
    if(listingPrice !== 'undefined') {
        return listingPrice;
    } 
}

export let getAllOwnedTokensURIs = async (owner) => {
    let ownedCounter = await NFT.getTokenCountOfAnOwner(owner);
    let ownedTokensURIs = {};
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
            ownedTokensURIs[tempTokenID] = tempURI;
            ownedCounter--;
        }
        tempTokenID++;
    }
    return ownedTokensURIs;
}


export const Marketplace = {
    createItemListingRequest : async (nft,tokenId,price) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await isMarketplacePaused();
        let listingPrice = await getListingPrice();
        if(isPaused === false) {
            console.log('not paused');
            await marketplaceContract.methods.createListingRequest(nft,tokenId,price).send({from: currentAccount, value: listingPrice})
            .then((res) => {
                alert('listing request is created successfully');
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
                alert('failed to create listing request');
            });

            await marketplaceContract.events.logPending({},async (error, event) => {console.log(event)})
            .then((res) => {
                console.log(res);
                alert('listing request is created successfully');
            })
            .catch((error) => {
                console.log(error);
                alert('failed to fetch create listing request event');
            });
        }
    },

    withdrawItemFromMarketplace : async (itemId) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            try {
                await marketplaceContract.methods.withdrawItem(itemId).send({from: currentAccount}).then().catch(error => console.log(error));
                await marketplaceContract.events.logRemoved({},function(error, event){console.log(event)}).on('data', async (evnt) => {
                    console.log(evnt);
                    return evnt;
                }).on('error', async (err) => {
                    return err;
                })
                return "Item has been removed" 
            } catch(error) {
                console.log(error);
                return "ERROR Item is not removed"
            }
        } else {
            return "marketplace should be working and you should be the owner to withdrw the item"
        }
    },
    buyItem : async (itemId, price) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await isMarketplacePaused();
        if(isPaused === false) {
            await marketplaceContract.methods.BuyItem(itemId).send({from: currentAccount, value: price})
            .then((res) => {
                console.log(res);
                alert('Congratulations new item has been added to your NFTS');
            })
            .catch((error) => {
                console.log(error);
                alert('failed to buy the item');
            });
            
            await marketplaceContract.events.logSold({},async(error, event) => {console.log(event)})
            .on('data', async (evnt) => {
                    console.log(evnt);
            }).on('error', async (err) => {
            })
        }
    },
    acceptItem : async (itemId) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false && await isValidator(currentAccount)) {
            await marketplaceContract.methods.acceptItem(itemId).send({from: currentAccount})
            .then((res) => {
                console.log(res);
                alert('item is accepted');
            })
            .catch((error) => {
                console.log(error);
                alert('failed to accept the item');
            });
            await marketplaceContract.events.logListedForSale({},async(error, event) => {console.log(event)})
            .on('data', async (evnt) => {
                    console.log(evnt);
            }).on('error', async (err) => {
                    console.log(err);
            })
        }
    },
    rejectItem : async (itemId) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false && isValidator(currentAccount)) {
            await marketplaceContract.methods.rejectItem(itemId).send({from: currentAccount})
            .then((res) => {
                console.log(res);
                alert('item rejected');
            })
            .catch((error) => {
                console.log(error);
                alert('failed to reject the item');
            });
            await marketplaceContract.events.logRemoved({},async(error, event) => {console.log(event)})
            .on('data', async (evnt) => {
                    console.log(evnt);
                    return evnt;
            }).on('error', async (err) => {
                    return err;
            })
        }
    },
    changeItemPrice : async (itemId,newPrice) => {
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            try {
                await marketplaceContract.methods.changeItemPrice(itemId,newPrice).send({from: currentAccount}).then().catch(error => console.log(error));
                await marketplaceContract.events.logPriceChanged({},async (error, event) => {console.log(event)}).on('data', async (evnt) => {
                    console.log(evnt);
                    return evnt;
                }).on('error', async (err) => {
                    return err;
                })
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
                    pendingCount = await marketplaceContract.methods.getNumberOfPendingNFTS().call({from: mm.getCurrentAccount()});
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
            await marketplaceContract.methods.getAllPedningItems().call({from: mm.getCurrentAccount()})
            .then((res) => {
                pendingItems = res;
            })
            .catch((error) => {
                console.log(error);
                alert('failed to get pending items');
            });
        }
        if(pendingItems !== 'undefined') {
            return pendingItems;
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
                    soldCount = await marketplaceContract.methods.getNumberOfSoldNFTS().call({from: mm.getCurrentAccount()});
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
                    soldItems = await marketplaceContract.methods.getAllSoldItems().call({from: mm.getCurrentAccount()});
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
                    itemsCount = await marketplaceContract.methods.getNumberOfAllNFTS().call({from: mm.getCurrentAccount()});
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
            await marketplaceContract.methods.getAllListedItems().call({from: mm.getCurrentAccount()})
            .then((res) => {
                listedItems = res;
            })
            .catch((error) => {
                console.log(error);
                alert('failed to get listed items');
            });
        }
        if(listedItems !== 'undefind') {
            return listedItems;
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
                removedItems = await marketplaceContract.methods.getAllRemovedItems().call({from: mm.getCurrentAccount()});
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
            await marketplaceContract.methods.getItemsCreated().call({from: mm.getCurrentAccount()})
            .then((res) => {
                createdItems = res;
            })
            .catch((error) => {
                console.log(error);
                alert('failed to get items Listed');
            });
        } else {
            console.log('marketplace should be working to get the items listed');
        }
        if(createdItems !== 'undefind') {
            return createdItems;
        }
    },
    getItemsPurchased : async () => { //getMyNFTS
        let purchasedItems;
        let isPaused = await marketplaceContract.methods.paused().call();
        if(isPaused === false) {
            await marketplaceContract.methods.getMyNFTS().call({from: mm.getCurrentAccount()})
            .then((res) => {
                console.log(res);
                purchasedItems = res;
            })
            .catch((error) => {
                console.log(error);
                alert('failed to get purchased items');
            });
        } else {
            console.log("marketplace should be paused to get purchased items");
        }
        if(purchasedItems !== 'undefind') {
            return purchasedItems;
        }
    },
    addValidator : async (validator) => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString() &&
           validator !== marketplaceOwner && validator.toString !== '0' ) {
            if(isPaused === false) {
                await marketplaceContract.methods.grantValidator(validator).send({from: currentAccount})
                .then((res) => {
                    console.log(res);
                    alert('a new validator is added');
                })
                .catch((error) => {
                    console.log(error);
                    alert('failed to add new validator');
                });

                await nftMarketplace.events.RoleGranted({},async (error, event) => {console.log(event)}).on('data', async (evnt) => {
                        console.log(evnt);
                }).on('error', async (err) => {
                        console.log(err);
                })
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
                await marketplaceContract.methods.revokeValidator(validator).send({from: currentAccount})
                .then((res) => {
                    console.log(res);
                    alert('the validator is revoked successfully');
                })
                .catch((error) => {
                    console.log(error);
                    alert('failed to remove the validatro');
                });
                await nftMarketplace.events.RoleRevoked({},async (error, event) => {console.log(event)}).on('data', async (evnt) => {
                    console.log(evnt);
                }).on('error', async (err) => {
                    console.log(err);
                })
            }
        }
    },
    changeListingPrice : async (newListingPrice) => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === true) {
                await marketplaceContract.methods.changeListingPrice(newListingPrice).send({from: currentAccount})
                .then((res) => {
                    console.log(res);
                    alert('listing price is changed successfully');
                })
                .catch((error) => {
                    console.log(error);
                    alert('failed to change listing pirce');
                });
                    
                await marketplaceContract.events.logListingPriceChanged({},async (error, event) => {
                        console.log(event);
                        console.log(error);
                    }).on('data', async (evnt) => {
                        console.log(evnt);
                        return evnt;
                    }).on('error', async (err) => {
                        return err;
                    })
                } else {
                    console.log('you should pause the marketplace in order to change listing price');
                }
            } 
        },
    pauseMarketplace: async () => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await isMarketplacePaused();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === false) {
                await marketplaceContract.methods.Pause().send({from: currentAccount})
                .then((res) => {
                    console.log(res);
                    alert('marketplace is paused successfully');
                })
                .catch((error) => {
                    console.log(error)
                    alert('failed to pause the marketplace');
                });
            } else {
               console.log("the marketplace should be unpaused in order to pause it");
            }
        }
    },
    unpauseMarketplace : async () => {
        let marketplaceOwner = await marketplaceContract.methods.getMarketplaceOwner().call();
        let currentAccount = mm.getCurrentAccount();
        let isPaused = await marketplaceContract.methods.paused().call();
        if(currentAccount.toLowerCase().toString() === marketplaceOwner.toLowerCase().toString()) {
            if(isPaused === true) {
                await marketplaceContract.methods.Unpause().send({from: currentAccount})
                .then((res) => {
                    console.log(res);
                    alert('the marketplace is unpaused successfully');
                })
                .catch((error) => {
                    console.log(error);
                    alert('failed to unpause the marketplace');
                });
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
    await marketplaceContract.methods.hasRole(VALIDATOR_ROLE,address).call()
    .then((res) => {
        isValidator = res;
    }).catch((error) => {
        console.log(error);
        alert('failed to check validator role');
    });
    
    if(isValidator !== 'undefined') {
        return isValidator;
    }
}

export let isAdmin = async (address) => {
    let ADMIN_ROLE = Web3.utils.soliditySha3('ADMIN_ROLE');
    let isAdmin;
    await marketplaceContract.methods.hasRole(ADMIN_ROLE,address).call()
    .then((res) => {
        isAdmin = res;
    })
    .catch((error) => {
        console.log(error);
        alert('failed to check admin role');
    });

    if(isAdmin !== 'undefined') {
        return isAdmin;
    }
}

export let isMarketplacePaused = async () => {
    let isPaused;
    
    await marketplaceContract.methods.paused().call()
    .then((res) => {
        isPaused = res;
    })
    .catch((error) => {
        console.log(error);
        alert('failed to get marketplace state');
    });

    if(isPaused !== 'undefined') {
        return isPaused;
    }
}