var http = require('http'),
    _ = require('underscore'),
    unzip = require('unzip'),
    fs = require('fs'),
    request = require('request');

function makeRequest(hostname, path, cb){
  http.request({
    hostname: hostname,
    path: path,
    port: 80,
    method: 'GET'
  }, function(res) {
    res.on('data', cb);
    res.setEncoding('utf8');
  }).end();
}

var i = 0;
for(var pageNumber = 0; pageNumber <= 900; pageNumber += 50){  // runs through each page on fontsquirrel
  var html = '';
  makeRequest('www.fontsquirrel.com', '/fonts/list/find_fonts/' + pageNumber, function(packet){
    html += packet;
    if(packet.indexOf('</html>') != -1){
      var links = html.match(/(\/fonts\/download\/)[-\w"]*[\>][^>]*>/g);  // find all download links
      _.each(links, function(link){
        if(!link.match(/(.*)offsite(.*)/g)){  // don't download fonts offsite
          var path = link.match(/\/fonts\/download\/[\w-]*/g);  // get the download path
          if(path){
            request('http://www.fontsquirrel.com' + path).on('error', function(){
              console.log('error:', path);
            }).pipe(fs.createWriteStream('font' + i++ + '.zip'));  // write to a local zip file
          }
        }
      });
    }
  });
}


