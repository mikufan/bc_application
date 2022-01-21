var co = require('co');
var fabric_application = require('./fabric_application.js')
var express = require('express');
var app = express();
const hashUtils = require('./hashUtils.js')
 
app.use(express.static('public'));
 
 //获取当前区块链长度
app.get('/getchannelheight', function (req, res) {

    co( function * () {

        var blockchaininfo = yield fabric_application.getBlockchainInfo();
        console.log(blockchaininfo)
        res.send( "The height of the blockchain is "+blockchaininfo.height.toString());

    }).catch((err) => {
        res.send(err);
    })

});

//获取网络当前节点数量
app.get('/getnodenumber', function(req, res){

    co(function * (){
        var nodeNum = yield fabric_application.getNodeNumber();
        console.log(nodeNum);
        res.send("The number of nodes in the network is "+ nodeNum.toString());
    }).catch((err) => {
        res.send(err);
    })
})
var server = app.listen(8081, function () {
 
})

//获取区块链哈希值

app.get('/getblockquery', function (req, res) {
  
    co( function * () {    
          
        var blockinfo = yield fabric_application.getQueryBlockInfo(req.query.id);
        var previous_hash = blockinfo.header.previous_hash;
        var current_hash = hashUtils.calculateBlockHash(blockinfo.header)
        res.send("previous block hash is "+previous_hash+" <br><br> current block hash is "+ current_hash);
    
        }).catch((err) => {
            res.send(err);
    })
});

//获取当前所有链上数据
app.get('/getchaindata', function(req, res){
    co( function * () {    
          
        var chainData = yield fabric_application.getChainData();
        res.send(chainData);
    
    }).catch((err) => {
        res.send(err);
    })
});    
    
 
