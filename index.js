'use strict'
let express = require('express'),app = express(),http = require('http').Server(app);
app.use(express.static('public'));
app.listen(3000,()=>{console.log('listening on port#3000:')});
