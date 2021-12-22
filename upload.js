'use strict';

const fs = require('fs');
//const csv = require('csv-parser')
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
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';
function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}
exports.uploadMain = async () => {
  try{
    //const ccp = buildCCPOrg1();
    const wallet = await buildWallet(Wallets, walletPath);
    const gateway = new Gateway();
    const jsonArray = await csv().fromFile(csvFilePath);

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org2.yaml', 'utf8'));

    // Set connection options; identity and wallet
    let connectionOptions = {
        identity: userName,
        wallet: wallet,
        discovery: { enabled:true, asLocalhost: true }
    };

    // Access PaperNet network
    console.log('Use network channel: mychannel.');

    const network = await gateway.getNetwork('mychannel');

    // Get addressability to commercial paper contract
    console.log('Use org.datanet.dataupdate smart contract.');

    const contract = await network.getContract('datacontract');

    console.log('Submit data upload transaction.');
      
    for(var i=0;i<jsonArray.length;i++){
        var oneData = jsonArray[i];
        dataTime = Object.values(oneData)[0];
        console.log(Object.values(oneData)[0]);
        const uploadResponse = await contract.submitTransaction(dataTime,dataContent,dataAuthor);
        console.log('Process upload transaction response.'+uploadResponse.dataTime);
        console.log(`${uploadResponse.author} data : ${uploadResponse.dataTime} successfully uploaded`);
        console.log('Transaction complete.');
    }

    
  }catch(error) {
    console.log(`*** Successfully caught the error: \n    ${error}`);
  }finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.');
    gateway.disconnect();

  }
}
uploadMain()


