const AnimeNFT = artifacts.require("AnimeNFT");
const NFTMarketplace = artifacts.require("NFTMarketplace");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("AnimeNFT", function (accounts) {
  it("should assert true", async function () {
    await AnimeNFT.deployed();
    return assert.isTrue(true);
  });

  it("marketplace address should be the address passed in constructor",async() => {
    let MarketplaceInstance = await NFTMarketplace.deployed();
    let NFTInstance = await AnimeNFT.deployed();
    let nftMarketplaceAddress = await NFTInstance.getMarketplaceAddress.call();
    let marketplaceAddress = MarketplaceInstance.address;
    assert.equal(nftMarketplaceAddress,marketplaceAddress,"marketplace address should be the address passed in constructor");
  });
  
  describe("create token functionality", async() => {
    it('caller owned tokens counter should be 3', async() => {
      let minter = accounts[1];
      let nftInstance = await AnimeNFT.deployed();
      let firstTokenID = await nftInstance.createNFT('MyAnimeNFT',{from: minter});
      let secondTokenID = await nftInstance.createNFT('WWW',{from: minter});
      let ThirdTokenID = await nftInstance.createNFT('GGG',{from: minter});
      let tokenCount = await nftInstance.balanceOf.call(minter);
      assert.equal(tokenCount,3,"minter should have minted 3 tokens");
    });

    it('marketplace should have approval for created tokens', async() => {
      let minter = accounts[2];
      let nftInstance = await AnimeNFT.deployed();
      let TokenID = await nftInstance.createNFT('Gon',{from: minter});
      let MarketplaceInstance = await NFTMarketplace.deployed();
      let marketplaceAddress = MarketplaceInstance.address;
      let approvedAddess = await nftInstance.getApproved(2);
      assert.equal(approvedAddess,marketplaceAddress,"approved address should equal to marketplace address");
    });

    it('token ownership must be passed to callers', async() => {
      let minter = accounts[3];
      let nftInstance = await AnimeNFT.deployed();
      let TokenID = await nftInstance.createNFT('Killua',{from: minter});
      let tokenOwner = await nftInstance.ownerOf.call(5);//4
      assert.equal(tokenOwner,minter,"minter should have minted 2 tokens");
    });
  })

  describe('token uri',async () => {
    it('token uri must equal to passed one', async() => {
      let minter = accounts[3];
      let nftInstance = await AnimeNFT.deployed();
      let TokenID = await nftInstance.createNFT('AnimeART',{from: minter});
      let returnedURI = await nftInstance.tokenURI(6);
      assert.equal(returnedURI,'AnimeART',"uri should be equal");
    })
  })

});

