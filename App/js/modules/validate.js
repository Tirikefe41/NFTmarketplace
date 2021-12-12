import * as mm from "./detectmm.js";
import {Marketplace, isValidator, NFT, isAdmin, getListingPrice, isMarketplacePaused} from "./smartContracts.js";

let pendingNFTSContainer = document.querySelector('#pendingItems');
let validatorManager = document.querySelector('#validatorsManager');
let listingPriceManager = document.querySelector('#listingPriceManager');
let marketplaceManager = document.querySelector('#marketplaceManager');

window.addEventListener('load', async() => {
  if(mm.isMetaMaskavailable()) {
    if(mm.isMMConnected()) {
      let ispaused = await isMarketplacePaused();
      let validator = await isValidator(mm.getCurrentAccount());
      let admin = await isAdmin(mm.getCurrentAccount());
      if(validator === true && admin === true) {
        if(ispaused) {
          await createListingPriceManager()
          await createMarketplaceManager();
          await updateCurrentMarketplaceState()
        } else {
          let pending = await getPendingMetaData();
          await createValidatorManager();
          await createMarketplaceManager();
          await updateCurrentMarketplaceState()
          await createListingPriceManager()
          await updatecurrentListingPrice()
        }
        
        console.log('you are allowed to validate' + ' and you are the admin')
      } else if(validator === true){
        if(!ispaused) {
          let pending = await getPendingMetaData();
          console.log(pending)
          console.log('you are allowed to validate');
        }
      } else {
        console.log('you are not allowed to validate');
        alert('you have to be a validator to access this page');
        window.location.href = "../html/explore.html";
      }
    }
  }
})

let getPendingNFTS = async () => {
  let pending = await Marketplace.getPendingItems();
  return pending;
}

let getPendingMetaData = async () => {
  let pending = await getPendingNFTS();
  for(let i = 0; i < pending.length; i++) {
    console.log(pending[i]['itemID']);
    console.log(pending[i]);
    let tokenURI = await NFT.getTokenURI(pending[i]['tokenID']);
    getPendingNFTSMetadataFromURI(tokenURI,pending[i]['tokenID'],pending[i]['price'],pending[i]['itemID']);
  }
}

let createValidatorManager = async () => {

  let validatorAddressDiv = createNode('div');
  validatorAddressDiv.setAttribute('id','validatorAddressDiv');

  let validatorAddress = createNode('input');
  validatorAddress.placeholder = 'validator address';
  validatorAddress.setAttribute('id','validatorAddress');

  append(validatorAddressDiv,validatorAddress);

  let actionDiv = createNode('div');
  actionDiv.setAttribute('id','validatorActionDiv');

  let addBtn = createNode('button');
  addBtn.setAttribute("class","acceptBtn");
  addBtn.onclick = addValidator;
  addBtn.innerHTML = "Add Validator";

   
  let removeBtn = createNode('button');
  removeBtn.setAttribute("class","rejectBtn");
  removeBtn.onclick = removeValidator;
  removeBtn.innerHTML = "Remove Validator";

  append(actionDiv,addBtn);
  append(actionDiv,removeBtn);

  append(validatorManager,validatorAddressDiv);
  append(validatorManager,actionDiv);
}

let updatecurrentListingPrice = async () => {
  let current = document.querySelector('#currentListingPrice');
  let web3 = new Web3(window.ethereum);

  let listingPrice = await getListingPrice();

  current.innerHTML = "current listing price: " + web3.utils.fromWei(listingPrice,'ether');
  current.style.alignitems = 'center'
}

let updateCurrentMarketplaceState = async () => {
  let current = document.querySelector('#currentMarketplaceState');
  let res = await isMarketplacePaused();
  if(res) {
    current.innerHTML = "current Marketplace State: Paused";
  } else {
    current.innerHTML = "current Marketplace State: Working";
  }
}



let createListingPriceManager = async () => {

  let changePriceDiv = createNode('div');
  changePriceDiv.setAttribute('id','changePriceDiv');
  
  let listingPrice = createNode('input');
  listingPrice.type =  'number';
  listingPrice.placeholder = 'New Listing Price in ETH';
  listingPrice.setAttribute('id','listingPrice');

  let changeListingPriceBtn = createNode('button');
  changeListingPriceBtn.setAttribute("id","changeListingPriceButton");
  changeListingPriceBtn.onclick = changeListingPrice;
  changeListingPriceBtn.innerHTML = "Change";

  append(changePriceDiv,listingPrice);
  append(changePriceDiv,changeListingPriceBtn);


  append(listingPriceManager,changePriceDiv);
}

let createMarketplaceManager = async () => {
  
  let marketStateDiv = createNode('div');
  marketStateDiv.setAttribute('id','marketStateDiv');
  
  let pauseBtn = createNode('button');
  pauseBtn.setAttribute("id","pauseBtn");
  pauseBtn.onclick = pauseMarket;
  pauseBtn.innerHTML = "Pause";

  let unPauseBtn = createNode('button');
  unPauseBtn.setAttribute("id","unpauseBtn");
  unPauseBtn.onclick = unpauseMarket;
  unPauseBtn.innerHTML = "Unpause";

  append(marketStateDiv,pauseBtn);
  append(marketStateDiv,unPauseBtn);


  append(marketplaceManager,marketStateDiv);
}

let addValidator = async () => {
  let address = document.querySelector('#validatorAddress');
  console.log(address.value);
  let web3 = new Web3(window.ethereum);
  let res = web3.utils.isAddress(address.value);
  if(res) {
      let result = await Marketplace.addValidator(address.value);
      if(result !== null) {
        console.log(result);
        alert('the validator is added successfully');
      } else {
        alert('error in removing the validator');
      }
    } else {
      alert('please enter a valid address');
    }
}

let removeValidator = async () => {
  let address = document.querySelector('#validatorAddress');
  console.log(address.value);
  let web3 = new Web3(window.ethereum);
  let res = web3.utils.isAddress(address.value);
  if(res) {
      let result = await Marketplace.removeValidator(address.value);
      if(result !== null) {
        console.log(result);
        alert('the validator is removed successfully');
      } else {
        alert('error in removing the validator');
      }
    } else {
      alert('please enter a valid address');
      return;
    }
  }


let pauseMarket = async () => {
  let result = await Marketplace.pauseMarketplace();
  if(result !== null) {
    console.log(result);
    alert('the marketplace is paused successfully');
  }
}

let unpauseMarket = async () => {
  let result = await Marketplace.unpauseMarketplace();
  if(result !== null) {
    console.log(result);
    alert('the marketplace is unpaused successfully');
  }
}

let changeListingPrice = async () => {
  let listingPrice = document.querySelector('#listingPrice');
  console.log(listingPrice)
  let isMarketPaused = await isMarketplacePaused();
  if(isMarketPaused) {
    let result = await Marketplace.changeListingPrice(listingPrice);
    if(result !== null) {
      console.log(result);
      alert('The listing price is changed successsfully');
    }
  } else {
    alert('the marketplace should paused first in order to change the listing price');
  }
 
}


let getPendingNFTSMetadataFromURI = async(metadataURL,tokenID,price,itemID) => {
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

  
    let acceptBtn = createNode('button');
    acceptBtn.setAttribute("class","acceptBtn");
    acceptBtn.onclick = acceptItem;
    acceptBtn.innerHTML = "Accept";
  
     
    let rejectBtn = createNode('button');
    rejectBtn.setAttribute("class","rejectBtn");
    rejectBtn.onclick = rejectItem;
    rejectBtn.innerHTML = "Reject";

    let ActionDiv = createNode('div');
    ActionDiv.style.display = 'flex';
    ActionDiv.style.flexDirection = 'row';
    ActionDiv.style.justifyContent = 'space-evenly';

    append(ActionDiv,acceptBtn);
    append(ActionDiv,rejectBtn);


    append(cardContent,name);
    append(cardContent,description);
    append(cardContent,itemId);
    append(cardContent,nftPrice);


    append(nftCard,cardCover);
    append(nftCard,cardContent);
    append(nftCard,ActionDiv);

  
    append(pendingNFTSContainer,nftCard);

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

let acceptItem = async (event) => {
  let itemID = event.target.parentNode.parentNode.children[1].children[2].innerHTML;
  console.log(itemID);
  let result = await Marketplace.acceptItem(itemID);
  if(result !== null) {
    console.log(result);
    alert('item accepted successfully');
  }
}

let rejectItem = async (event) => {
  let itemID = event.target.parentNode.parentNode.children[1].children[2].innerHTML;
  let result = await Marketplace.rejectItem(itemID);
  if(result !== null) {
    console.log(result);
    alert('item rejected successfully');
  }
}