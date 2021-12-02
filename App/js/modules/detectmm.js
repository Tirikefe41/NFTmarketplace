export let isMetaMaskavailable = () => {
    if (typeof window.ethereum !== 'undefined') {
        if (window.ethereum.isMetaMask === true) {
          return true;
        } else {
          return false;
        }
      } else {
          return false;
      }
}

export let connectMetamask = async() => {
  let result = isMetaMaskavailable();
  if(result === true) {
    await ethereum.request({ method: 'eth_requestAccounts'});
    let connectedAddress = ethereum.selectedAddress;
    alert('metamask is connected successfully with address ' + connectedAddress);
    let walletBtn = document.getElementById("mm-connect");
    walletBtn.style.backgroundColor="#32CD32";
  } else {
    console.log('metamask is not available');
  }
}


  