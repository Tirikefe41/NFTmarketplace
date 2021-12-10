import * as mm from "./modules/detectmm.js";

window.addEventListener('load', async() => {
  let walletBtn = document.getElementById("mm-connect");
  if(mm.isMetaMaskavailable()) {
    console.log("metamask is available");
    if(mm.isMMConnected()) {
      console.log("selected address: " + mm.getCurrentAccount());
      console.log('chain ID ' + await mm.getChainId())
      walletBtn.style.backgroundColor="#40EC40";
    } else {
      walletBtn.style.backgroundColor="#EC4040";
    }
  } else {
    console.log("metamask is not available");
  }
})

let walletBtn = document.getElementById("mm-connect");
walletBtn.onclick = async() => {
  mm.connectMetamask();
}
