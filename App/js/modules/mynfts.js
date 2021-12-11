import {getAllOwnedTokensURIs,Marketplace} from "./smartContracts.js";
import * as mm from "./detectmm.js";

const createdNFTS = document.querySelector('.created');
const pendingNFTS = document.querySelector('pending');
const listedNFTS = document.querySelector('.listed');
const removednfts = document.querySelector(".removed");

window.addEventListener('load', async() => {
  await getCreatedNFTS();
})

let getCreatedNFTSMetadataFromURI = async(metadataURL,id) => {
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


  
    append(createdNFTS,nftCard);

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

let getPendingMetadataFromURI = async(metadataURL) => {
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

  
    let sellBtn = document.createElement('button');
    sellBtn.setAttribute("id","sellBtn");
    sellBtn.innerHTML = "Sell";
  

    append(cardContent,name);
    append(cardContent,description);

    append(nftCard,cardCover);
    append(nftCard,cardContent);
    append(nftCard,sellBtn);


  
    append(createdNFTS,nftCard);


  return data;
  }).catch(function (err) {
    console.warn('Something went wrong.', err);
  });
}



let getCreatedNFTS = async () => {
  let created = await getAllOwnedTokensURIs(mm.getCurrentAccount());
  console.log(created)
  Object.keys(created).forEach(key => {
    console.log(key + " " + created[key]);
    getCreatedNFTSMetadataFromURI(created[key],key);
  })
  return created;
}

let createNode = (name) => {
  return document.createElement(name);
}

let append = (parent, child) => {
  return parent.appendChild(child);
}

let getPendingNFTS = async () => {
  let pending = await Marketplace.getPendingItems();
  for(let i = 0; i < pending.length ; i++) {
    getMetadataFromURI(created[i]);
  }
  console.log("created tokens uris: "+ created);
  return created;
}


let getListedNFTS = async () => {

}

let getRemovedNFTS = async () => {

}

