// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./AnimeNFT.sol";

/// @title Fixed Price NFT Marketplace
/// @author Ramadan Wasfi
/// @notice You can use this contract for only the most basic 
contract NFTMarketplace is IERC721Receiver, AccessControl, ReentrancyGuard, Pausable{
  using Counters for Counters.Counter;
   
  enum State {
    Pending, ListedForSale, Sold, Removed
  }

  struct MarketItem {
    uint256 itemID;
    uint256 tokenID;
    State itemState;
    address payable buyer;
    address payable seller;
    AnimeNFT nft;
    bool isSold;
    uint256 price;
  }

  Counters.Counter private _itemIdCounter;
  Counters.Counter private _itemsSoldCounter;
  Counters.Counter private _pendingItemsCounter;

  address payable private _owner;
  uint256 private listingPrice;

  bytes32 public constant  VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
  bytes32 public constant  ADMIN_ROLE = keccak256("ADMIN_ROLE");

  mapping(uint256 => MarketItem) private marketItems;


  /* * * * * * * * *  * * * *
   * * * * *  Events * * * * 
   * * * * * * * * * * * * */


  /// @notice the item is pending and need to be validated first to be listed
  /// @dev notify the user that the item is pending and need to be validated first to be listed
  /// @param itemID the id of the nft in the marketplace
  /// @param tokenID the actual Id of the nft
  /// @param itemState the state of the nft 'pending - listed for sale - sold - removed'
  /// @param buyer the address of the buyer of the nft
  /// @param seller the address of the owner or seller of the nft
  /// @param nft the address of the nft 
  /// @param isSold boolean to check whether the nft has been sold or not
  /// @param price the price of the nft
  event logPending(uint256 itemID,
    uint256 tokenID,
    State indexed itemState,
    address payable buyer,
    address payable seller,
    address nft,
    bool isSold,
    uint256 indexed price);

  /// @notice the item is listed for sale
  /// @dev notify the user that the item is listed for sale
  /// @param itemId the id of the nft in the marketplace
  /// @param price the price of the nft
  /// @param seller the address of the seller of nft 
  event logListedForSale(uint256 itemId, uint256 price, address seller);

  /// @notice the nft is sold 
  /// @dev notify the user that the item is sold by whom with how much
  /// @param itemId the id of the nft that has been sold
  /// @param price the price of the nft
  /// @param seller the address of the seller of nft 
  /// @param buyer the address of the buyer of the nft
  event logSold(uint256 itemId, uint256 price, address buyer, address seller);

  /// @notice the nft has been removed from the marketplace
  /// @dev notify the validator that the item has been removed from the marketplace
  /// @param itemId the id of the nft which has been removed from the marketplace
  event logRemoved(uint256 itemId); 

  /// @notice change the price of an nft in 
  /// @param itemId the ID of the item which the caller want to change its price
  ///@param newPrice the new price of the nft
  event logPriceChanged(uint256 itemId, uint256 newPrice);

  /// @notice change the listing price 
  ///@param newListingPrice the new price of listing an nft
  event logListingPriceChanged(uint256 newListingPrice);


  /* * * * * * * * *  * * * *
   * * * * * Modifiers * * * * 
   * * * * * * * * * * * * */


  modifier pending(uint256 itemId) {
    require (marketItems[itemId].itemState == State.Pending && marketItems[itemId].buyer == address(0));
    _;
  }

  modifier listedForSale(uint256 itemId) {
    require (marketItems[itemId].itemState == State.ListedForSale && marketItems[itemId].isSold == false);
    _;
  }

  modifier sold(uint256 itemId) {
    require (marketItems[itemId].itemState == State.Sold && marketItems[itemId].buyer != address(0) && marketItems[itemId].isSold == true);
    _;
  }

  modifier removed(uint256 itemId) {
    require (marketItems[itemId].itemState == State.Removed);
    _;
  }


  modifier paidEnough() { 
    require(msg.value >= listingPrice); 
    _;
  }

  modifier checkBuyingPrice(uint256 itemID) {
    _;
    uint256 price = marketItems[itemID].price;
    uint256 amountToRefund = msg.value - price;
    (bool success, ) = marketItems[itemID].buyer.call{value:amountToRefund}("");
    require(success, "Transfer failed.");
  }

  modifier checkListingPrice() {
    _;
    uint256 amountToRefund = msg.value - listingPrice;
    (bool success, ) = msg.sender.call{value:amountToRefund}("");
    require(success, "Transfer failed.");
  }

  modifier isAdminOrValidator() {
    require(hasRole(VALIDATOR_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender));
    _;
  }

  modifier itemExists(uint _itemID) {
    require(_itemID > 0 && _itemID <= _itemIdCounter.current());
    _;
  }

  modifier notZeroAddress(address caller) {
    require(caller != address(0));
    _;
  }

  modifier notAdminAddress(address caller) {
    require(caller != _owner);
    _;
  }


  /* * * * * * * * *  * * * *
   * * * * * Functions * * * * 
   * * * * * * * * * * * * */


  constructor(uint256 _listingPrice){
    _owner = payable(msg.sender);
    listingPrice = _listingPrice;
    _setupRole(ADMIN_ROLE, _owner);
    _setupRole(VALIDATOR_ROLE, _owner);
    _setRoleAdmin(VALIDATOR_ROLE,ADMIN_ROLE);  
  }

  receive() external payable {
    revert();
  }

  fallback() external payable {
    revert();
  }

  /// @notice create a request for listing a token in the marketplace
  /// @param nftContract the address of the nft the sender want to list for sale 
  /// @param _tokenID the ID of the nft the sender want to list for sale
  /// @param _price the price of the nft the sender want to list for sale
  /// @return the ID of the item that contain nft and it's info in the marketplace
  function createListingRequest(address nftContract, uint256 _tokenID,uint256 _price) public payable whenNotPaused nonReentrant checkListingPrice() paidEnough() returns(uint256) {
    require(_price > 0);
    require(AnimeNFT(nftContract).getApproved(_tokenID) == address(this));
    require(AnimeNFT(nftContract).ownerOf(_tokenID) == msg.sender);
    _itemIdCounter.increment();
    uint256 _itemID = _itemIdCounter.current();

    marketItems[_itemID] = MarketItem(
      _itemID,
      _tokenID,
      State.Pending,
      payable(address(0)),
      payable(msg.sender),
      AnimeNFT(nftContract),
      false,
      _price 
    );

    marketItems[_itemID].nft.safeTransferFrom(msg.sender,address(this),_tokenID);
    (bool success, ) = _owner.call{value:listingPrice}("");
    require(success, "Transfer failed.");

    _pendingItemsCounter.increment();
    emit logPending(_itemID,_tokenID,State.Pending,payable(address(0)),payable(msg.sender),nftContract,false,_price);
    return _itemID;
  }

  /// @notice withdraw an item from the marketplace,
  /// @dev it checks if the caller is the owner of item or not
  /// @param _itemId the ID of the item that contain nft and it's info in the marketplace
  function withdrawItem(uint256 _itemId) public whenNotPaused nonReentrant itemExists(_itemId) pending(_itemId) {
    require(msg.sender == marketItems[_itemId].seller);
    marketItems[_itemId].nft.safeTransferFrom(address(this),marketItems[_itemId].seller,marketItems[_itemId].tokenID);
    marketItems[_itemId].itemState = State.Removed;
    _pendingItemsCounter.decrement();
    emit logRemoved(_itemId);
  }
 
  /// @notice buying a token which listed for sale at fixed price,
  /// @dev it check for enough funds and transfer the nft to buyer and money to seller
  /// @param _itemId the ID of the item that contain nft and it's info in the marketplace
  function BuyItem(uint256 _itemId) public payable nonReentrant whenNotPaused itemExists(_itemId) listedForSale(_itemId) checkBuyingPrice(_itemId) {
    MarketItem storage itemToBuy = marketItems[_itemId];
    require(msg.sender != itemToBuy.seller);
    require(msg.value >= itemToBuy.price);

    (bool success, ) = itemToBuy.seller.call{value:itemToBuy.price}("");
    require(success, "Transfer failed.");

    itemToBuy.nft.safeTransferFrom(address(this),msg.sender,itemToBuy.tokenID);
    itemToBuy.isSold = true;
    itemToBuy.itemState = State.Sold;
    itemToBuy.buyer = payable(msg.sender);
    _itemsSoldCounter.increment();
    emit logSold(_itemId,itemToBuy.price,itemToBuy.buyer,itemToBuy.seller);
  }

  /// @notice accept nft to be listed for sale
  /// @dev it changes the state of the item from pending to listedForSale and notify the validator
  /// @param _itemId the ID of the item that contain nft and it's info in the marketplace
  function acceptItem(uint256 _itemId) public whenNotPaused nonReentrant itemExists(_itemId) pending(_itemId)  isAdminOrValidator()  {
    marketItems[_itemId].itemState = State.ListedForSale;
    _pendingItemsCounter.decrement();
    emit logListedForSale(_itemId,marketItems[_itemId].price,marketItems[_itemId].seller);
  }

  /// @notice reject nft so that it isn't listed for sale
  /// @dev it changes the state of the item from pending to remove and send the nft back to it's owner notify the validator
  /// @param _itemId the ID of the item that contain nft and it's info in the marketplace
  function rejectItem(uint256 _itemId) public whenNotPaused nonReentrant itemExists(_itemId)  pending(_itemId)   isAdminOrValidator()  {
    marketItems[_itemId].nft.safeTransferFrom(address(this),marketItems[_itemId].seller,marketItems[_itemId].tokenID);
    marketItems[_itemId].itemState = State.Removed;
    _pendingItemsCounter.decrement();
    emit logRemoved(_itemId);
  }

  /// @notice change the price of an owned nft
  /// @dev change the price of an nft in case the caller is the owner of the nft and that nft isn't sold
  /// @param _itemId the ID of the item which the caller want to change its price
  /// @param _newPrice the new price of the nft
  function changeItemPrice(uint256 _itemId,uint256 _newPrice) public whenNotPaused nonReentrant itemExists(_itemId){
    require(_newPrice != marketItems[_itemId].price && _newPrice > 0);
    require(marketItems[_itemId].isSold == false);
    require(marketItems[_itemId].seller == msg.sender);
    marketItems[_itemId].price = _newPrice;
    emit logPriceChanged(_itemId,_newPrice);
  }

  /// @notice return the number of pending nfts in the marketplace
  /// @return PendingItemsCounter 
  function getNumberOfPendingNFTS() public view  whenNotPaused onlyRole(ADMIN_ROLE) returns(uint256) {
    return _pendingItemsCounter.current();
  }

  /// @notice return the number of Sold nfts in the marketplace
  /// @return SoldNFTCounter 
  function getNumberOfSoldNFTS() public view whenNotPaused onlyRole(ADMIN_ROLE) returns(uint256) {
    return _itemsSoldCounter.current();
  }

  /// @notice return the number of all nfts in the marketplace
  /// @return allnftsCounter  
  function getNumberOfAllNFTS() public view whenNotPaused onlyRole(ADMIN_ROLE) returns(uint256)  {
    return _itemIdCounter.current();
  }

  
  /// @notice return the unsold nfts
  /// @return array contains all market items that listed for sale
  function getAllListedItems() public view whenNotPaused returns (MarketItem[] memory) {
    uint itemCount = _itemIdCounter.current();
    uint unsoldItemCount = _itemIdCounter.current() - _itemsSoldCounter.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (marketItems[i + 1].itemState == State.ListedForSale && marketItems[i + 1].buyer == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = marketItems[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /// @notice the sold nfts
  /// @return array contains all sold market items
  function getAllSoldItems() public view whenNotPaused onlyRole(ADMIN_ROLE) returns (MarketItem[] memory) {
    uint itemCount = _itemIdCounter.current();
    uint unsoldItemCount = _itemIdCounter.current() - _itemsSoldCounter.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (marketItems[i + 1].itemState == State.Sold || marketItems[i + 1].buyer != address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = marketItems[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /// @notice pending nfts
  /// @return array contains all the pending market items
  function getAllPedningItems() public view whenNotPaused isAdminOrValidator() returns (MarketItem[] memory) {
    uint itemCount = _itemIdCounter.current();
    uint unsoldItemCount = _itemIdCounter.current() - _itemsSoldCounter.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (marketItems[i + 1].itemState == State.Pending) {
        uint currentId = i + 1;
        MarketItem storage currentItem = marketItems[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /// @notice pending nfts
  /// @return array contains all the pending market items
  function getAllRemovedItems() public view whenNotPaused isAdminOrValidator() returns (MarketItem[] memory) {
    uint itemCount = _itemIdCounter.current();
    uint unsoldItemCount = _itemIdCounter.current() - _itemsSoldCounter.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (marketItems[i + 1].itemState == State.Removed) {
        uint currentId = i + 1;
        MarketItem storage currentItem = marketItems[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /// @notice all items created
  /// @return array contains all the created items by msg.sender 
  function getItemsCreated() public view whenNotPaused returns(MarketItem[] memory) {
    uint totalItemCount = _itemIdCounter.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (marketItems[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (marketItems[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = marketItems[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /// @notice all items sender has purchased
  /// @return array contains all the market items which has been bought by caller
  function getMyNFTS() public view whenNotPaused returns(MarketItem[] memory) {
    uint totalItemCount = _itemIdCounter.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (marketItems[i + 1].buyer == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (marketItems[i + 1].buyer == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = marketItems[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /// @notice make a new validator to a the valid
  /// @dev this function is called by the admin only although it prevents the admin from granting the role himself as he is already a validator
  /// @param newValidator the address of the person the admin want to make him a validator
  function grantValidator(address newValidator) public whenNotPaused onlyRole(ADMIN_ROLE) notZeroAddress(newValidator) notAdminAddress(newValidator) {
      grantRole(VALIDATOR_ROLE,newValidator);
  }

  /// @notice remove dishonest validator from the validation proccess
  /// @dev this function is called by the admin only also it prevents the admin from revoking the role himself
  /// @param ToBeRevokedValidator the address of the person the admin want to remove him from validation
  function revokeValidator(address ToBeRevokedValidator) public whenNotPaused onlyRole(ADMIN_ROLE) notZeroAddress(ToBeRevokedValidator) notAdminAddress(ToBeRevokedValidator){
      revokeRole(VALIDATOR_ROLE,ToBeRevokedValidator);
  }

  /// @notice return the owner of the marketplace
  /// @return the address of the marketplace owner
  function getMarketplaceOwner() public view returns(address) {
    return _owner;
  }

  /// @notice return the listing price of the marketplace
  /// @return the price of listing an nft for sale
  function getListingPrice() public view whenNotPaused returns(uint256) {
    return listingPrice;
  }

  /// @notice pause the marketplace
  function Pause() public whenNotPaused onlyRole(ADMIN_ROLE) {
    _pause();
  }

  /// @notice continue the marketplace
  function Unpause() public whenPaused onlyRole(ADMIN_ROLE) {
    _unpause();
  }

  /// @notice change the price of listing of nft
  /// @dev you have to pause the contract first to call this function to notify the customers of the new listing price
  /// @param newListingPrice the new price of listing nft in the marketplace
  function changeListingPrice(uint256 newListingPrice) public whenPaused onlyRole(ADMIN_ROLE)  {
    require(newListingPrice > 0 && newListingPrice != listingPrice,'Value must be greater than zero and not equal to the old listing price');
    listingPrice = newListingPrice;
    emit logListingPriceChanged(listingPrice);
  }
  
  // to check if the contract is a able to deal with nfts or not
  //should be implemented to accept safeTransferFrom function in ERC721Enumerable
   function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure returns (bytes4) {
      return IERC721Receiver.onERC721Received.selector;
    }
}
