// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AnimeNFT is ERC721, ERC721URIStorage{
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
  address private marketplace;

  constructor(address marketplaceAddress) ERC721("AnimeToken", "ANTK") {
    marketplace = marketplaceAddress;
  }

  function createNFT(string memory uri) public returns(uint256){
    _tokenIdCounter.increment();
    uint256 tokenId = _tokenIdCounter.current();
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, uri);
    approve(marketplace, tokenId);
    return tokenId;
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    require(_exists(tokenId),"ERC721URIStorage: URI query for nonexistent token");
    return super.tokenURI(tokenId);
  }

  function getMarketplaceAddress() public view returns(address) {
    return marketplace;
  }
  
  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    require(_exists(tokenId),"burn nonexistent token");
    super._burn(tokenId);
  }
}