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

  if(isMetaMaskavailable() === true) {
    await ethereum.request({ method: 'eth_requestAccounts'})
    .then(handleAccountsChanged)
    .catch((error) => {
      if (error.code === 4001) {
        console.log('Please connect to MetaMask.');
        alert('Please connect to MetaMask.');
      } else {
        console.error(error);
      }
    });
    if(isMMConnected()) {
      alert('metamask is connected successfully with address ' + getCurrentAccount());
    }
    ethereum.on('accountsChanged', handleAccountsChanged);
    let walletBtn = document.getElementById("mm-connect");
    walletBtn.style.backgroundColor="#32CD32";
  } else {
    console.log('metamask is not available');
  }
}

export let isMMConnected = () => {
  if(isMetaMaskavailable()) {
    return ethereum.selectedAddress !== null;
  }
}


export let getChainId = async () => {
  let result = await ethereum.request({ method: 'eth_chainId' });
  let chainId = parseInt(result, 16);
  return chainId;
}

export let getCurrentAccount = () => {
  if(isMMConnected()) {
    return ethereum.selectedAddress;
  } else {
    connectMetamask();
  }
}

let handleAccountsChanged = (accounts) => {
  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== getCurrentAccount()) {
    currentAccount = accounts[0];
  }
}