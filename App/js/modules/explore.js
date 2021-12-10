import * as mm from './detectmm.js';
import {Marketplace} from './smartContracts.js';

window.addEventListener('load', async () => {
    let listedNFTS = await Marketplace.getListedItems();
    console.log(listedNFTS);
})

let createNFT = (item) => {
    let container = document.querySelector('.container');
    let nftContainer = document.querySelector('#nftContainer');
    
    let nftName = createNode('span');
    nftName.innerHTML = item.name;
}

let createNode = (name) => {
    return document.createElement(name);
  }
  
  let append = (parent, child) => {
    return parent.appendChild(child);
  }