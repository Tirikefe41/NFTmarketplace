import * as mm from "./modules/detectmm.js";

window.addEventListener('load', async() => {
  let walletBtn = document.getElementById("mm-connect");
  if(mm.isMetaMaskavailable()) {
    console.log("metamask is available");
    console.log("selected address: " + ethereum.selectedAddress);
    let selectedAddress = ethereum.selectedAddress;
    if(selectedAddress === null) {
      walletBtn.style.backgroundColor="#EC4040";
    } else {
      walletBtn.style.backgroundColor="#40EC40";
    }
  } else {
    console.log("metamask is not available");
  }
})

let walletBtn = document.getElementById("mm-connect");
walletBtn.onclick = async() => {
  mm.connectMetamask();
}