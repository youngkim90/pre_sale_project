const express = require('express');
const app = express();
const router =express.Router();
const path = require('path');

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'../../public/join.html'));
});

router.get('/login', function(req,res){
    // res.render(path.join(__dirname,'../../public/join.html'),{'message':msg});
    res.sendFile(path.join(__dirname,'../../public/main.html'));
});
module.exports = router;
