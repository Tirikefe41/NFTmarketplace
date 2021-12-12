import {getAllOwnedTokensURIs,Marketplace, NFT} from "./smartContracts.js";
import * as mm from "./detectmm.js";

const ownedNFTS = document.querySelector('.owned');
const purchasedNFTS = document.querySelector('.purchased');
const createdNFTS = document.querySelector('.created');

window.addEventListener('load', async() => {
  await getOwnedNFTS();
  await getPurhasedNFTS();
  await getCreatedNFTS();
})

let getOwnedNFTSMetaDatafromURI = async(metadataURL,id) => {
  fetch(metadataURL).then(function (response) {
    return response.text();
  }).then(function (data) {
    let metadata = JSON.parse(data);
    console.log(metadata);
    
    let nftCard = createNode('div');
    nftCard.setAttribute("class","nftCard");
    

    let cardCover = createNode('div');
    cardCover.setAttribute("class","cardCover");
    let image = createNode('img');
    image.src = metadata.Image;
    image.width = "250";
    image.height = "250";
    append(cardCover,image);

    let cardContent = createNode('div');
    cardContent.setAttribute("class","cardContent");

    let name = createNode('p');
    name.setAttribute("class","nftName");
    name.innerHTML = metadata.Name;

    let description = createNode('p');
    description.setAttribute("class","nftDescription");
    description.innerHTML = metadata.Description;

    let tokenID = createNode('p');
    tokenID.innerHTML = id;
    tokenID.hidden = true;

  
    let sellBtn = document.createElement('button');
    sellBtn.setAttribute("class","sellBtn");
    sellBtn.onclick = goToSellPage;
    sellBtn.innerHTML = "Sell";
  

    append(cardContent,name);
    append(cardContent,description);
    append(cardContent,tokenID);

    append(nftCard,cardCover);
    append(nftCard,cardContent);
    append(nftCard,sellBtn);


  
    append(ownedNFTS,nftCard);

  return data;
  }).catch(function (err) {
    console.warn('Something went wrong.', err);
  });
}

let goToSellPage = (event) => {
  sessionStorage.setItem("nftName",event.target.parentNode.children[1].children[0].lastChild.data);
  sessionStorage.setItem("nftDescription",event.target.parentNode.children[1].children[1].lastChild.data);
  sessionStorage.setItem("nftImage",event.target.parentNode.children[0].lastChild.src);
  sessionStorage.setItem("nftID",event.target.parentNode.children[1].children[2].lastChild.data);

  console.log(event.target.parentNode);
  console.log("image : " + event.target.parentNode.children[0].lastChild.src);
  console.log("Description " + event.target.parentNode.children[1].children[1].lastChild.data);
  console.log("Name "  + event.target.parentNode.children[1].children[0].lastChild.data);
  console.log("ID "  + event.target.parentNode.children[1].children[2].lastChild.data);

  window.location.href = "../html/sell.html";
}


let getPurhasedNFTS = async () => {
  let purchased = await Marketplace.getItemsPurchased();
  console.log(purchased);
  for(let i = 0; i < purchased.length; i++) {
      console.log(purchased[i]['itemID']);
      console.log(purchased[i]);
      console.log(purchased[i]['seller']);
      let tokenURI = await NFT.getTokenURI(purchased[i]['tokenID']);
      getPurchasedMetadataFromURI(tokenURI,purchased[i]['tokenID'],purchased[i]['price'],purchased[i]['itemID']);
  }
}

let getPurchasedMetadataFromURI = async (metadataURL,tokenID,price,itemID) => {
  fetch(metadataURL).then(function (response) {
    return response.text();
  }).then(function (data) {
    let metadata = JSON.parse(data);
    console.log(metadata);
    
    let nftCard = createNode('div');
    nftCard.setAttribute("class","nftCard");
    
    let cardCover = createNode('div');
    cardCover.setAttribute("class","cardCover");
    let image = createNode('img');
    image.src = metadata.Image;
    image.width = "250";
    image.height = "250";
    append(cardCover,image);

    let cardContent = createNode('div');
    cardContent.setAttribute("class","cardContent");

    let name = createNode('p');
    name.setAttribute("class","nftName");
    name.innerHTML = metadata.Name;

    let description = createNode('p');
    description.setAttribute("class","nftDescription");
    description.innerHTML = metadata.Description;

    let itemId = createNode('p');
    itemId.innerHTML = itemID;
    itemId.hidden = true;

    let tokenId = createNode('p');
    tokenId.innerHTML = tokenID;
    tokenId.hidden = true;

    let nftPrice = createNode('p');
    let web3 = new Web3(window.ethereum);
    nftPrice.innerHTML = "Price:  " + web3.utils.fromWei(price,'ether') + "  ETH";

    append(cardContent,name);
    append(cardContent,description);
    append(cardContent,itemId);
    append(cardContent,nftPrice);

    append(nftCard,cardCover);
    append(nftCard,cardContent);

    append(purchasedNFTS,nftCard);

  return data;
  }).catch(function (err) {
    console.warn('Something went wrong.', err);
  });
}


let getCreatedNFTS = async () => {
  let created = await Marketplace.getItemListedByCaller();
  console.log(created);
  for(let i = 0; i < created.length; i++) {
      console.log(created[i]['itemID']);
      console.log(created[i]);
      console.log(created[i]['seller']);
      let tokenURI = await NFT.getTokenURI(created[i]['tokenID']);
      getCreatedMetadatafromURI(tokenURI,created[i]['tokenID'],created[i]['price'],created[i]['itemID'],created[i]['itemState']);
  }
}

let getCreatedMetadatafromURI = async (metadataURL,tokenID,price,itemID,state) => {
  fetch(metadataURL).then(function (response) {
    return response.text();
  }).then(function (data) {
    let metadata = JSON.parse(data);
    console.log(metadata);
    
    let nftCard = createNode('div');
    nftCard.setAttribute("class","nftCard");
    
    let cardCover = createNode('div');
    cardCover.setAttribute("class","cardCover");
    let image = createNode('img');
    image.src = metadata.Image;
    image.width = "250";
    image.height = "250";
    append(cardCover,image);

    let cardContent = createNode('div');
    cardContent.setAttribute("class","cardContent");

    let name = createNode('p');
    name.setAttribute("class","nftName");
    name.innerHTML = metadata.Name;

    let description = createNode('p');
    description.setAttribute("class","nftDescription");
    description.innerHTML = metadata.Description;

    let itemId = createNode('p');
    itemId.innerHTML = itemID;
    itemId.hidden = true;

    let tokenId = createNode('p');
    tokenId.innerHTML = tokenID;
    tokenId.hidden = true;


    let itemState = createNode('p');
    if(state == 0) {
      itemState.innerHTML = "State : Pending";
    } else if (state == 1) {
      itemState.innerHTML = "State : Listed For Sale";
    } else if (state == 2) {
      itemState.innerHTML = "State : Sold";
    } else if (state == 3) {
      itemState.innerHTML = "State : Removed";
    }
    
    let nftPrice = createNode('p');
    let web3 = new Web3(window.ethereum);
    nftPrice.innerHTML = "Price:  " + web3.utils.fromWei(price,'ether') + "  ETH";

    append(cardContent,name);
    append(cardContent,description);
    append(cardContent,itemId);
    append(cardContent,itemState);
    append(cardContent,nftPrice);

    append(nftCard,cardCover);
    append(nftCard,cardContent);

    append(createdNFTS,nftCard);

  return data;
  }).catch(function (err) {
    console.warn('Something went wrong.', err);
  });
}


let getOwnedNFTS = async () => {
  let created = await getAllOwnedTokensURIs(mm.getCurrentAccount());
  console.log(created)
  Object.keys(created).forEach(key => {
    console.log(key + " " + created[key]);
    getOwnedNFTSMetaDatafromURI(created[key],key);
  })
  return created;
}

let createNode = (name) => {
  return document.createElement(name);
}

let append = (parent, child) => {
  return parent.appendChild(child);
}
