const AnimeNFT = artifacts.require("AnimeNFT");
const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = function (deployer,accounts) {
  deployer.deploy(AnimeNFT,NFTMarketplace.address);
};
