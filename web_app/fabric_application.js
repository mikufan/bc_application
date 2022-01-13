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

module.exports.getBlockchainInfo = getBlockchainInfo