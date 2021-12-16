const readline = require("readline");
const fs = require('fs');

let APIPhrase = "export const API_KEY = ";
let APIKey;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("What is your nft.storage API Key? ", (apikey) => {
    console.log(apikey);
    APIKey = apikey;
    console.log(APIPhrase);
    APIPhrase += "'" + APIKey + "'"; 
    console.log(APIPhrase);

    fs.writeFile('./js/modules/config.js',APIPhrase, function (err) {
        if (err) throw err;
        console.log('config File is created successfully.');
      });

    rl.close();
});


 

