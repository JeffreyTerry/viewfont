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

var time = -1;
function yolo(){
  time++;
  console.log('time: ', time);
  var i = 0;
  var html = '';
  makeRequest('www.fontsquirrel.com', '/fonts/list/find_fonts/' + (time * 50), function(packet){
    html += packet;
    if(packet.indexOf('</html>') != -1){
      var links = html.match(/(\/fonts\/download\/)[-\w"]*[\>][^>]*>/g);  // find all download links
      _.each(links, function(link){
        if(!link.match(/(.*)offsite(.*)/g)){  // don't download fonts offsite
          var path = link.match(/\/fonts\/download\/[\w-]*/g);  // get the download path
          if(path){
            request('http://www.fontsquirrel.com' + path).on('error', function(){
              console.log('error:', path);
            }).pipe(fs.createWriteStream('font' + time + i++ + '.zip'));  // write to a local zip file
          }
        }
      });
    }
  });
}

var delay = 30000;
setTimeout(yolo, delay * 0);
setTimeout(yolo, delay * 1);
setTimeout(yolo, delay * 2);
setTimeout(yolo, delay * 3);
setTimeout(yolo, delay * 4);
setTimeout(yolo, delay * 5);
setTimeout(yolo, delay * 6);
setTimeout(yolo, delay * 7);
setTimeout(yolo, delay * 8);
setTimeout(yolo, delay * 9);
setTimeout(yolo, delay * 10);
setTimeout(yolo, delay * 11);
setTimeout(yolo, delay * 12);
setTimeout(yolo, delay * 13);
setTimeout(yolo, delay * 14);
setTimeout(yolo, delay * 15);
setTimeout(yolo, delay * 16);
setTimeout(yolo, delay * 17);
setTimeout(yolo, delay * 18);
