'use strict';

const fs = require('fs');
const csvFilePath='./data/site_one.csv';
const csv=require('csvtojson');
const path = require('path');
const isMulti = false;
const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const yaml = require('js-yaml');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'datacontract';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const UserId = 'appUser';


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}
var upload = require('./upload.js')

async function main() {
	try {
    	//read the csv data files and store the data items in json arrays
    	const jsonArray = await csv().fromFile(csvFilePath);
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1(isMulti);

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			  // setup the gateway instance
			  // The user will now be able to create connections to the fabric network and be able to
			  // submit transactions and query. All transactions submitted by this gateway will be
			  // signed by this user using the credentials stored in the wallet.
			  await gateway.connect(ccp, {
				wallet,
				identity: UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);
      		console.log("network connected")
			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
      		console.log("chaincode loaded")
			upload.uploadMain(jsonArray,contract,UserId)

		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();



