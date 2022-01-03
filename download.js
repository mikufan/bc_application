'use strict';

async function downloadMain(){
  try{
    console.log('Submit data download transaction.');
    await contract.evaluateTransaction('DownloadAll')
    
    console.log('Download transaction complete.');
    
  }catch(error) {
    console.log(`*** Successfully caught the error: \n    ${error}`);
  }
}

module.exports.downloadMain = downloadMain;






