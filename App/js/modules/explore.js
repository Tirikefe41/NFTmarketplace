import {Marketplace,NFT} from './smartContracts.js';
import * as mm from './detectmm.js';

let listedContainer = document.querySelector('#listedNftsContainer');

window.addEventListener('load', async () => {
  await createNftsFromURI();
})

let createNftsFromURI = async () => {
  if(mm.isMMConnected()) {
    if(await mm.getChainId() === 4) {
      let listedItems = await Marketplace.getListedItems();
      console.log(listedItems);
      for(let i = 0; i < listedItems.length; i++) {
        if(listedItems[i]['itemID'] == 0) {
        console.log("invalid item");
        } else {
          if(listedItems[i]['seller'].toLowerCase().toString() === mm.getCurrentAccount().toLowerCase().toString()) {
          console.log('invalid items');
          } else {
            let tokenURI = await NFT.getTokenURI(listedItems[i]['tokenID']);
            console.log(tokenURI);
            getMetadataFromURI(tokenURI,listedItems[i]['tokenID'],listedItems[i]['price'],listedItems[i]['itemID']);
          }
        }
      }
    } else {
      alert('please connect to rinkeby network');
    }
  } else {
    alert('please connect metamask');
  }
}


let getMetadataFromURI = async (tokenURI,tokenID,price,itemID) => {
  fetch(tokenURI).then(function (response) {
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

    let cardContent = createNode('div');
    cardContent.setAttribute("class","cardContent");

    append(cardCover,image);

 

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
    nftPrice.innerHTML = "Price: " + web3.utils.fromWei(price,'ether') + " ETH";
    nftPrice.value = web3.utils.fromWei(price,'ether');
  
    let buyBtn = createNode('button');
    buyBtn.setAttribute("id","buyBtn");
    buyBtn.onclick = buyItem;
    buyBtn.innerHTML = "Buy";
  

    append(cardContent,name);
    append(cardContent,description);
    append(cardContent,itemId);
    append(cardContent,nftPrice);
    append(cardContent,buyBtn);


    append(nftCard,cardCover);
    append(nftCard,cardContent);

  
    append(listedContainer,nftCard);

  return data;
  }).catch(function (err) {
    console.warn('Something went wrong.', err);
  });
}


let createNode = (name) => {
    return document.createElement(name);
  }
  
  let append = (parent, child) => {
    return parent.appendChild(child);
  }

  let buyItem = async (event) => {
    let itemID = event.target.parentNode.children[2].innerHTML;
    let result = event.target.parentNode.children[3].value;
    let web3 = new Web3(window.ethereum);
    console.log(result);
    console.log(itemID);
    console.log(typeof result);
    console.log(typeof itemID);

    let price = web3.utils.toWei(result,'ether');
    console.log(price);

    console.log(typeof price);
    itemID = parseInt(itemID);
    console.log(typeof itemID);

    
    let res = await Marketplace.buyItem(itemID,price);
  }