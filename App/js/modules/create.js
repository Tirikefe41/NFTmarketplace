let imageInput = document.getElementById('nft_image');

imageInput.onchange = (event) => {
    const [file] = imageInput.files;
    console.log(file);
    console.log(URL.createObjectURL(file));
  if (file) {
    let uploadedImg = document.getElementById('nftImage');
    uploadedImg.src = URL.createObjectURL(file)
  }
}


let createNFTBtn = document.getElementById('createBtn');
createNFTBtn.onclick = () => {
    const [file] = imageInput.files;
    uploadImgToNFTStorage(file);
}

let uploadImgToNFTStorage = async(image) => {
    
}