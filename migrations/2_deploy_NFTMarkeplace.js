const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = function (deployer,accounts) {
  deployer.deploy(NFTMarketplace,15000000);
};
