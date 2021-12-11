import { nftAddress } from './ABIS_and_Addresses.js';
import {Marketplace} from './smartContracts.js';

window.addEventListener('load', () => {
    retrieveNFTData();
})

let createNode = (name) => {
    return document.createElement(name);
  }
  
  let append = (parent, child) => {
    return parent.appendChild(child);
  }
  let requestForSell = async () => {
      let price = document.getElementById('nftPrice').value;
      let web3 = new Web3(window.ethereum);
      let nftPrice = web3.utils.toWei(price);
      console.log("to sell " + price + "   " + nftPrice);
      let tokenId = document.getElementById('tokenID').innerHTML;
      console.log('token id ' + tokenId);
      Marketplace.createItemListingRequest(nftAddress,tokenId,nftPrice)
  }
  
  let retrieveNFTData = () => {
    let main = document.getElementById('main');
    main.style.backgroundColor = "#ffffff";
    main.style.margin = "10px";
    main.style.padding = "10px";
    main.style.borderRadius = "1.5rem";
    main.style.textAlign = "center";


    let nftCard = createNode('div');
    nftCard.style.display = "flex";
    nftCard.style.flexDirection = "column";
    nftCard.style.borderRadius = "1.5rem"
    nftCard.style.margin = "10px 0 10px 0"
    nftCard.style.padding = "10px"
    nftCard.style.flexDirection = "column"
    nftCard.style.justifyContent = "space-between"
   


    let cardCover = createNode('div');
    cardCover.style.padding = "10px";
    
    let image = createNode('img');
    image.src = sessionStorage.getItem("nftImage");
    image.width = "250";
    image.height = "250";
    image.style.borderRadius = "1.5rem";
    append(cardCover,image);

    let cardContent = createNode('div');
    cardContent.style.padding = "0 10px 0 10px";

    let name = createNode('p');
    name.innerHTML = sessionStorage.getItem("nftName");

    let description = createNode('p');
    description.innerHTML = sessionStorage.getItem("nftDescription");

    let tokenID = document.createElement('p');
    tokenID.innerHTML = sessionStorage.getItem('nftID');
    tokenID.setAttribute('id','tokenID');
    tokenID.hidden = true;
    
    let sellBtn = document.createElement('button');
    sellBtn.setAttribute("class","sellBtn");
    sellBtn.onclick = requestForSell;
    sellBtn.innerHTML = "Sell";
    sellBtn.style.marginTop = '25px';
  

    let price = document.createElement('input');
    price.style.padding = "10px";
    price.style.marginRight = "5px"
    price.type = 'number';
    price.id = 'nftPrice';
    price.placeholder = "NFT Price in ETH";

    // price.oninput = convertPrice;

    let priceType = document.createElement('select');
    priceType.id = 'priceType';
    priceType.name = priceType;
    priceType.disabled = true;
    
    let option = document.createElement('option');
    option.value = 'ETH'
    option.innerHTML = 'ETH';
    

    let option2 = document.createElement('option');
    option2.value = 'USD'
    option2.innerHTML = 'USD';

    append(priceType,option);
    append(priceType,option2);

    let priceDiv = document.createElement('div');
    priceDiv.style.display = 'flex';
    priceDiv.style.flexDirection = 'row';
    priceDiv.style.justifyContent = "center";

    append(priceDiv,price);
    append(priceDiv,priceType)

    append(cardContent,name);
    append(cardContent,description);
    append(cardContent,tokenID)

    append(nftCard,cardCover);
    append(nftCard,cardContent);


    append(main,nftCard);
    append(main,priceDiv);
    append(main,sellBtn);
    sellBtn.style.width = "15%";
    sellBtn.style.textAlign = "center";
  }

  /*
//   let convertPrice = () => {
//       let priceType = document.getElementById('priceType');
//       let selectedValue = priceType.options[priceType.selectedIndex].value;
//       if(selectedValue.toString() === "ETH") {
//       } else if (selectedValue.toString() === "USD") {
//         console.log("USD Selected");
//       }
//   }
*/