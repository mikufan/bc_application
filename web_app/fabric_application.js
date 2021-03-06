async function getBlockchainInfo(){
    'use strict';
    const { FileSystemWallet, Gateway } = require('fabric-network');
    const path = require('path');
    const ccpPath = path.resolve(__dirname, '..', '..', 'GitHub','fabric-samples','test-network','organizations', 'peerOrganizations','org1.example.com','connection-org1.json');
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('appuser');
    if (!userExists) {
        console.log('An identity for the user "appuser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'appuser', discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    const channel = network.getChannel();
    const info = channel.queryInfo();
    
    return (await info);
    
}

async function getNodeNumber(){
    'use strict';
    const { FileSystemWallet, Gateway } = require('fabric-network');
    const path = require('path');
    const ccpPath = path.resolve(__dirname, '..', '..', 'GitHub','fabric-samples','test-network','organizations', 'peerOrganizations','org1.example.com','connection-org1.json');
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    const userExists = await wallet.exists('appuser');
    console.log(`Wallet path: ${walletPath}`);
    if (!userExists) {
        console.log('An identity for the user "appuser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'appuser', discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');
    const channel = network.getChannel();
    const ordererList = channel.getOrderers();
    const peerList = channel.getPeers();
    var nodeNum = ordererList.length+peerList.length;
    return nodeNum;
}

async function getQueryBlockInfo(blockId){
    const { FileSystemWallet, Gateway } = require('fabric-network');
    const path = require('path');
    const ccpPath = path.resolve(__dirname, '..', '..', 'GitHub','fabric-samples','test-network','organizations', 'peerOrganizations','org1.example.com','connection-org1.json');
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    const userExists = await wallet.exists('appuser');
    console.log(`Wallet path: ${walletPath}`);
    if (!userExists) {
        console.log('An identity for the user "appuser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'appuser', discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork('mychannel');
    console.log(typeof(blockId))
    console.log('Network connected');
    const channel = network.getChannel();
    var id = parseInt(blockId)
    const info = channel.queryBlock(id);
    //var blockHash = hashUtils.calculateBlockHash((await info).header);
    var data = (await info).data
    console.log(info);
    return info
    //return blockId
}

async function getChainData(){
    'use strict';
    const { FileSystemWallet, Gateway } = require('fabric-network');
    const path = require('path');
    const ccpPath = path.resolve(__dirname, '..', '..', 'GitHub','fabric-samples','test-network','organizations', 'peerOrganizations','org1.example.com','connection-org1.json');
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    const userExists = await wallet.exists('appuser');
    console.log(`Wallet path: ${walletPath}`);
    if (!userExists) {
        console.log('An identity for the user "appuser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'appuser', discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('datacontract');
    const result = await contract.evaluateTransaction('queryAllDataItems');
    //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    console.log(result.toString());
    var resultData = JSON.parse(result.toString())
    console.log(resultData)
    return resultData
}

module.exports.getChainData = getChainData
module.exports.getQueryBlockInfo = getQueryBlockInfo
module.exports.getBlockchainInfo = getBlockchainInfo
module.exports.getNodeNumber = getNodeNumber