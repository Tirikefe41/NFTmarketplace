const NFTMarketplace = artifacts.require("NFTMarketplace");
const AnimeNFT = artifacts.require("AnimeNFT");
const truffleAssert = require('truffle-assertions');
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("NFTMarketplace", function ( accounts ) {

  it("should assert true", async function () {
    await NFTMarketplace.deployed();
    return assert.isTrue(true);
  });
  
  it("owner should has the admin role", async() => {
    let NFTMarketInstance = await NFTMarketplace.deployed();
    let marketplaceOwner = await NFTMarketInstance.getMarketplaceOwner.call();
    let ADMIN_ROLE = web3.utils.soliditySha3('ADMIN_ROLE');
    let isOwnerAnAdmin = await NFTMarketInstance.hasRole(ADMIN_ROLE,marketplaceOwner);
    assert.equal(isOwnerAnAdmin,true,"Marketplace Owner should be the admin");
  });

  it('had initial listing price of 15000000 gwei', async() => {
    let NFTMarketInstance = await NFTMarketplace.deployed();
    let price = await NFTMarketInstance.getListingPrice.call();
    let listingPrice = web3.utils.toWei(price.toString(),'gwei');
    let expectedPrice = web3.utils.toWei('15000000','gwei');
    assert.equal(listingPrice,expectedPrice,'Listing Price should be 15000000 gwei');
  });
  
  describe('Change Listing Price', async () => {
    it('listing price should be 20000000 gwei',async() => {
      let NFTMarketInstance = await NFTMarketplace.deployed();
      await NFTMarketInstance.Pause({from:accounts[0]});
      let changeListingPrice = await NFTMarketInstance.changeListingPrice(20000000,{from: accounts[0]});
      await NFTMarketInstance.Unpause({from:accounts[0]});
      let price = await NFTMarketInstance.getListingPrice.call();
      let listingPrice = web3.utils.toWei(price.toString(),'gwei');
      let expectedPrice = web3.utils.toWei('20000000','gwei');
      truffleAssert.eventEmitted(changeListingPrice,'logListingPriceChanged',(event) => {
        return (event.newListingPrice == 20000000);
      })
      assert.equal(listingPrice,expectedPrice,'Listing Price should be 20000000 gwei');
    })
  })

  describe('grant and revoke validator role', async () => {
    it('grant validtor role',async () => {
      let NFTMarketInstance = await NFTMarketplace.deployed();
      let validator = accounts[1];
      let admin = await NFTMarketInstance.getMarketplaceOwner.call();
      let VALIDATOR_ROLE = web3.utils.soliditySha3('VALIDATOR_ROLE');
      let grantValidator = await NFTMarketInstance.grantValidator(validator,{from: admin});
      let result = await NFTMarketInstance.hasRole(VALIDATOR_ROLE,validator);
      assert.equal(result,true,`${validator} should granted validator role`)
      truffleAssert.eventEmitted(grantValidator,'RoleGranted',(event) => {
        return (event.role == VALIDATOR_ROLE && event.account == validator && event.sender == admin);
      })
    })

    it('revoke validtor role',async () => {
      let NFTMarketInstance = await NFTMarketplace.deployed();
      let validator = accounts[1];
      let admin = await NFTMarketInstance.getMarketplaceOwner.call();
      let VALIDATOR_ROLE = web3.utils.soliditySha3('VALIDATOR_ROLE');
      let revokeValidator = await NFTMarketInstance.revokeValidator(validator,{from: admin});
      let result = await NFTMarketInstance.hasRole(VALIDATOR_ROLE,validator);
      assert.equal(result,false,`${validator} should revoked validator role`)
      truffleAssert.eventEmitted(revokeValidator,'RoleRevoked',(event) => {
        return (event.role == VALIDATOR_ROLE && event.account == validator && event.sender == admin);
      })
    })
  })
});
