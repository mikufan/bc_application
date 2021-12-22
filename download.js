'use strict';

const fs = require('fs');
const csvFilePath='site_one.csv'
const csv=require('csvtojson')

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const yaml = require('js-yaml');
//const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
//const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');
const channelName = 'mychannel';
const chaincodeName = 'basic';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';
function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}
exports.downloadMain = async(csvData, network,contract)=> {
  try{

    console.log('Submit data upload transaction.');
      
   
    const downloadResponse = await contract.evaluateTransaction(dataTime,dataContent,dataAuthor);
    console.log(`${uploadResponse.author} data : ${uploadResponse.dataTime} successfully uploaded`);
    console.log('Transaction complete.');

    for(var i=0;i<downloadResponse.length;i++){
        var oneData = [i];
        dataTime = Object.values(oneData)[0];
        console.log(Object.values(oneData)[0]);
        
    }

    
  }catch(error) {
    console.log(`*** Successfully caught the error: \n    ${error}`);
  }finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.');
    gateway.disconnect();

  }
}
main()


