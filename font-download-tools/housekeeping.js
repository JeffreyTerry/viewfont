var fs = require('fs');

fs.appendFile('./fonts.js', '];' , function(err){
  if(err){
    console.log('Error fixing fonts.js: ', err);
  }
});


