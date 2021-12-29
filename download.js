'use strict';

async function downloadMain(jsonArray,contract,UserId){
  try{
    console.log('Submit data upload transaction.');
    for(var i=0;i<jsonArray.length;i++){
        var oneData = jsonArray[i];
        var dataTime = Object.values(oneData)[0];
        console.log(Object.values(oneData)[0]);
        await contract.submitTransaction('upload',dataTime,oneData,UserId);
        //console.log('Process upload transaction response.'+uploadResponse.dataTime);
        //console.log(`${uploadResponse.author} data : ${uploadResponse.dataTime} successfully uploaded`);
        
    }
    console.log('Upload transaction complete.');
    
  }catch(error) {
    console.log(`*** Successfully caught the error: \n    ${error}`);
  }
}

module.exports.uploadMain = uploadMain;



downloadMain()


