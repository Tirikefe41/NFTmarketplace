# A.N.I.M.E NFT Marketplace
Full Stack Niche Fixed Price NFT Marketplace made for anime lovers.


## Deployed version url
https://animenftmarket.netlify.app/app/html/

## screencast link
https://www.youtube.com/watch?v=NNSUfZltc2w

## contracts test
* open new terminal in empty directory
* git clone https://github.com/ramadanWasfi/blockchain-developer-bootcamp-final-project.git
* cd blockchain-developer-bootcamp-final-project
* run npm install to install dependencies
* open new terminal and run ganache-cli
* run truffle test --network development

## how to setup the project to run locally
* you should have nft.storage api key in order to run the project locally
* after you cloned the repo and run npm install
* open new terminal and run ganache-cli
* in a new terminal run truffle migrate --network deveopment
* change nftAddress and nftMarketplaceAddress variables in path App/js/modules/ABIS_and_Addresses.js with the addresses of local ganache-cli deployed addresses
* npm run dev
* in terminal you should enter your nft.storage api key
* make sure that metamask is connected to ganache-cli network with id 1337 and localhost:8545
* npm run start 
 

## User Requirements
* Sell Anime NFT
* Buy Anime NFT
* Explore Anime NFTs
  
## User Sell Workflow
1. Register with metamask
2. Click Create NFT Button
3. Enter NFT Details [*Name* - *Description* - *Image*]
4. Click Submit Button
5. new NFT will be created
6. if the user wants to sell it The user shall go to mynfts page and enter the price then click sell button
8. After that the nft will be in pending state and needed to be validated by a validator or the admin
9. after the nft is validated the nft will be put in the marketplace for sale

