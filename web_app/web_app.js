var co = require('co');
var fabric_application = require('./fabric_application.js')
var express = require('express');
var app = express();
 
app.use(express.static('public'));
 
 //获取当前通道的高度
app.get('/getchannelheight', function (req, res) {

    co( function * () {

        var blockchaininfo = yield fabric_application.getBlockchainInfo();
        console.log(blockchaininfo)
        res.send( "The height of the blockchain is "+blockchaininfo.height.toString());

    }).catch((err) => {
        res.send(err);
    })

});
var server = app.listen(8081, function () {
 
})
