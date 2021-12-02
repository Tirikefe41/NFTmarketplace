import {nftMarketplaceAddress, marketplaceABI} from "./ABIS_and_Addresses";

let getMarketplaceOwner = async() => {
    let web3 = new Web3(window.ethereum)
    const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
    nftMarketplace.setProvider(window.ethereum);
    let owner = await nftMarketplace.methods.getMarketplaceOwner().call();
    return owner;
  }

let isValidator = async(address) => {
    let web3 = new Web3(window.ethereum)
    const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
    nftMarketplace.setProvider(window.ethereum);
    let VALIDATOR_ROLE = Web3.utils.soliditySha3('VALIDATOR_ROLE');
    let isValidator = await nftMarketplace.methods.hasRole(VALIDATOR_ROLE,address).call();
    return isValidator;
}

let addValidator = async(address) => {
    let web3 = new Web3(window.ethereum)
    const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
    nftMarketplace.setProvider(window.ethereum);
    let admin = await getMarketplaceOwner();
    if(address !== admin && address.toString !== '0' && admin === ethereum.selectedAddress) {
        await nftMarketplace.methods.grantValidator(address).send({from: ethereum.selectedAddress});
        await nftMarketplace.events.RoleGranted(function(event, error){console.log(event)});
        let result = isValidator(address);
        if(result === true)
            console.log('new validator has been addedd');
        else
            console.log('error in adding validator');
    } else {
        console.log('error in conditions to add validator');
    }
}

let removeValidator = async(address) => {
    let web3 = new Web3(window.ethereum)
    const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
    nftMarketplace.setProvider(window.ethereum);
    let admin = await getMarketplaceOwner();
    if(address !== admin && address.toString !== '0' && admin === ethereum.selectedAddress) {
        await nftMarketplace.methods.revokeValidator(address).send({from: ethereum.selectedAddress});
        nftMarketplace.events.RoleRevoked(function(event, error){console.log(event)});
        let result = isValidator(address);
        if(result === false)
            console.log('new validator has been removed');
        else
            console.log('error in removing validator');
    } else {
        console.log('error in conditions to remove validator');
    }
}

let getAllPendingNFTS = async() => {
  let web3 = new Web3(window.ethereum);
  window.ethereum.enable();
  const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
  nftMarketplace.setProvider(window.ethereum);
  await ethereum.request({ method: 'eth_requestAccounts'})
  let result = isValidator(ethereum.selectedAddress);
  let pendingNFTS;
  if(result === true) {
    pendingNFTS = await nftMarketplace.methods.getAllPedningItems().call();
  } else {
    pendingNFTS = [];
  }
  return pendingNFTS;
}

let getAllRemovedNFTS = async() => {
  let web3 = new Web3(window.ethereum);
  window.ethereum.enable();
  const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
  nftMarketplace.setProvider(window.ethereum);
  await ethereum.request({ method: 'eth_requestAccounts'})
  let result = isValidator(ethereum.selectedAddress);
  let removedNFTS;
  if(result === true) {
    removedNFTS = await nftMarketplace.methods.getAllPedningItems().call();
  } else {
    removedNFTS = [];
  }
  return removedNFTS;
}

let getAllSoldNFTS = async() => {
  let web3 = new Web3(window.ethereum);
  window.ethereum.enable();
  const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
  nftMarketplace.setProvider(window.ethereum);
  await ethereum.request({ method: 'eth_requestAccounts'})
  let result = isValidator(ethereum.selectedAddress);
  let admin = await getMarketplaceOwner();
  let soldNFTS;
  if(result === admin) {
    soldNFTS = await nftMarketplace.methods.getAllSoldItems().call();
  } else {
    soldNFTS = [];
  }
  return soldNFTS;
}

let acceptNFT = async(itemID) => {
  let web3 = new Web3(window.ethereum)
  const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
  nftMarketplace.setProvider(window.ethereum);
  let result = isValidator(ethereum.selectedAddress);
  if(result === true) {
    await nftMarketplace.methods.acceptItem(itemID).send({from: ethereum.selectedAddress});
    await nftMarketplace.events.logListedForSale(function(event, error){console.log(event)});
  } else {
    console.log("you are not allowed to accept the item");
  }
}

let rejectNFT = async(itemID) => {
  let web3 = new Web3(window.ethereum)
  const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
  nftMarketplace.setProvider(window.ethereum);
  let result = isValidator(ethereum.selectedAddress);
  if(result === true) {
    await nftMarketplace.methods.rejectItem(itemID).send({from: ethereum.selectedAddress});
    await nftMarketplace.events.logRemoved(function(event, error){console.log(event)});
  } else {
    console.log("you are not allowed to reject the item");
  }
}

let changeListingPrice = async(newPrice) => {
  let web3 = new Web3(window.ethereum)
  const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
  nftMarketplace.setProvider(window.ethereum);
  let admin = await getMarketplaceOwner();
  let selected = ethereum.selectedAddress;
  if(admin === selected) {
    await nftMarketplace.methods.changeListingPrice(newPrice).send({from: ethereum.selectedAddress});
    await nftMarketplace.events.logListingPriceChanged(function(event, error){console.log(event)});
  } else {
    console.log("you are not allowed to change the listing price");
  }
}
window.addEventListener('load', async() => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('window.ethereum is enabled');
        if (window.ethereum.isMetaMask === true) {
          console.log('MetaMask is active');
          await ethereum.request({ method: 'eth_requestAccounts'});
          let result = await isValidator(ethereum.selectedAddress);
          if(result === true) {
            console.log('you are allowed to validate')
          } else {
            console.log('you are not allowed to validate')
            window.location.href = "../html/index.html";
          }
        } else {
          console.log('MetaMask is not available')
        }
      } else {
        console.log('window.ethereum is not found')
      }
})
