'use strict';

async function uploadMain(jsonArray,contract,UserId){
  try{
    console.log('Submit data upload transaction.');
    for(var i=0;i<jsonArray.length;i++){
        var oneData = jsonArray[i];
        var dataTime = Object.values(oneData)[0];
        console.log(Object.values(oneData)[0]);
        console.log(JSON.stringify(oneData));
        await contract.submitTransaction('upload',dataTime,JSON.stringify(oneData),UserId);
        
    }
    console.log('Upload transaction complete.');
    
  }catch(error) {
    console.log(`*** Successfully caught the error: \n    ${error}`);
  }
}

module.exports.uploadMain = uploadMain;


