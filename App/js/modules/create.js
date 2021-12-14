import {NFT} from "./smartContracts.js";
import * as mm from "./detectmm.js";
import {API_KEY} from './config.js';

let apiKey = API_KEY;

let imageURL;
let metadataURL;
let imageInput = document.getElementById('nft_image');

imageInput.onchange = (event) => {
    const [file] = imageInput.files;
  if (file) {
    let uploadedImg = document.getElementById('nftImage');
    uploadedImg.src = URL.createObjectURL(file)
  }
}

let createNFTBtn = document.getElementById('createBtn');

createNFTBtn.onclick = async() => {
  let nftName = document.getElementById('nft_name').value;
  let nftDescription = document.getElementById('nft_description').value;
  let file = imageInput.files[0];
  if(nftName === '' || nftDescription === '') {
    alert('please provide Item data');
  } else {
    if(file) {
      if(mm.isMMConnected()) {
        if(await getChainId() === 4) { // check for rinkeby network
          console.log(await getChainId());
          console.log(file);
          await CreateNft(file);
        } else {
          alert('please connect to rinkeby network');
        }
      } else {
        alert('please connect metamask');
      }
    } else {
      alert('please provide Item data');
    }
  }
}

let getMetadataURL = () => {
  if(metadataURL !== 'undefined')
    return metadataURL;
}

let getImageURL = () => {
  if(imageURL !== 'undefined')
    return imageURL;
}

let CreateNft = async(image) => {
  // get data from input fields
  let nftName = document.getElementById('nft_name').value;
  let nftDescription = document.getElementById('nft_description').value;

  // upload image first to nft.storage decentralized stroage
  fetch('https://api.nft.storage/upload',{
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${apiKey}`
    },
    body: image
  }
  ).then( response => response.json())
  .then(success => {console.log(success)
    
    imageURL = "https://" +success.value.cid + ".ipfs.dweb.link";

    console.log("Image URL: " + imageURL);

    // construce nft data in JSON format
    let info = {
      "Name": nftName,
      "Description": nftDescription,
      "Image": imageURL
    }
    let data = JSON.stringify(info);

    console.log(data);

    // upload the image with the data to nft.storage decentralized storage
    fetch('https://api.nft.storage/upload',{
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      body: data
    }
    ).then( response => response.json())
    .then(success => {console.log(success)
      
      metadataURL = "https://" +success.value.cid + ".ipfs.dweb.link";
      console.log("metadata URL: " + metadataURL);
    }).then( async () => {

      // create NFT in etheruem blockchain with the url of the image and data 
      let tokenID =  await NFT.mintNFT(metadataURL);
      console.log(tokenID);

      // clear input fields 
      metadataURL = 'undefined';
      imageURL = 'undefined';
      imageInput.value = null;
      let nftName = document.getElementById('nft_name');
      let nftDescription = document.getElementById('nft_description');
      nftName.value = '';
      nftDescription.value = '';

    }).catch(error => console.log(error));
    
  }).catch(error => console.log(error));
}
