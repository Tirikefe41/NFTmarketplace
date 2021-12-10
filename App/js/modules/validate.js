import * as mm from "./detectmm.js";
import {Marketplace, isValidator} from "./smartContracts.js";

window.addEventListener('load', async() => {
  if(mm.isMetaMaskavailable()) {
    if(mm.isMMConnected()) {
      let result = await isValidator(mm.getCurrentAccount());
      if(result === true) {
        console.log('you are allowed to validate')
      } else {
        console.log('you are not allowed to validate')
        window.location.href = "../html/index.html";
      }
    }
  }
})
