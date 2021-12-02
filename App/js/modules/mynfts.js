import {marketplaceABI, nftMarketplaceAddress} from "./ABIS_and_Addresses";

window.addEventListener('load', async() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('window.ethereum is enabled')
      if (window.ethereum.isMetaMask === true) {
        console.log('MetaMask is active')
        await ethereum.request({ method: 'eth_requestAccounts'})
        let myCreatedNFTS = await getCreatedNFTS();
        let myPurchasedNFTS = await getPurchasedNFTS();
        console.log(myCreatedNFTS);
        console.log(myPurchasedNFTS);
        console.log(ethereum.selectedAddress);
      } else {
        console.log('MetaMask is not available')
      }
    } else {
      console.log('window.ethereum is not found')
    }
})

let getCreatedNFTS = async() => {
    let web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
    nftMarketplace.setProvider(window.ethereum);
    await ethereum.request({ method: 'eth_requestAccounts'})
    let createdNFTS = await nftMarketplace.methods.getItemsCreated().call();
    return createdNFTS;
}

let getPurchasedNFTS = async() => {
    let web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    const nftMarketplace = new web3.eth.Contract(marketplaceABI,nftMarketplaceAddress);
    nftMarketplace.setProvider(window.ethereum);
    await ethereum.request({ method: 'eth_requestAccounts'})
    let purchasedNFTS = await nftMarketplace.methods.getMyNFTS().call();
    return purchasedNFTS;
}
