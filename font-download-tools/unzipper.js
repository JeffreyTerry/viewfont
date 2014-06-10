var unzip = require('unzip'),
    fs = require('fs'),
    _ = require('underscore'),
    fnparser = require('./filenameparser');


// console.log( getFontNameFromPath('veteran_typewriter.ttf') );
// console.log( getFontNameFromPath('qarmic_sans_abridged.ttf') );
// console.log( getFontNameFromPath('PAETRRG_.ttf') );
// console.log( getFontNameFromPath('Arsenal-Regular.otf') );
// console.log( getFontNameFromPath('PrintClearly.otf') );
// console.log( getFontNameFromPath('Qarmic_sans_Abridged.ttf') );
// console.log( getFontNameFromPath('PrintersOrnamentsOne.ttf') );
// console.log( getFontNameFromPath('Quantico-Regular.otf') );
// console.log( getFontNameFromPath('Quattrocento-Regular.otf') );
// console.log( getFontNameFromPath('QuattrocentoSans-Regular.otf') );
// console.log( getFontNameFromPath('Questrial-Regular.otf') );
// console.log( getFontNameFromPath('quick_end_jerk.ttf') );

function getFontFaceTemplate(fontName, fontPath){
  return '@font-face{font-family:"' + fontName + '";src:url("../fonts/' + fontPath + '");}'
}

// Creates a master CSS file containing all fonts
var fontsToAppend = [];

function addFontCSS(path){
  font = {
    name: fnparser.parse( path.substring( 0, path.lastIndexOf('.') ) ),
    path: path
  };
  fontsToAppend.push(font);
  appendNextFontCSS();
}

var firstFont = true;
var inProgress = false;
function appendNextFontCSS(){
  if(inProgress || fontsToAppend.length === 0) return;
  inProgress = true;
  var font = fontsToAppend.shift();
  fs.appendFile('fonts.css', getFontFaceTemplate(font.name, font.path), function(err){
    console.log( getFontFaceTemplate(font.name, font.path) );
    if(err){
      console.log('Error writing CSS: ', err);
    }
    var objectToAppend;
    if(firstFont){
      objectToAppend = JSON.stringify(font);
      firstFont = false;
    }else{
      objectToAppend = ',' + JSON.stringify(font);
    }
    console.log(objectToAppend);
    fs.appendFile('fonts.js', objectToAppend, function(err){
      if(err){
        console.log('Error writing JS: ', err);
      }
      inProgress = false;
      appendNextFontCSS();
    });
  });
}

// // Puts each font in its own CSS file NOT FINISHED
// var fonts = [];  // Will be used to create a javascript file containing all of the font objects in the system.

// function addFontCSS(path){
//   font = {
//     name: fnparser.parse( path.substring( 0, path.lastIndexOf('.') ) ),
//     path: path
//   };
//   fs.writeFile(path, getFontFaceTemplate(font.name, font.path), function(err){
//     inProgress = false;
//     console.log( getFontFaceTemplate(font.name, font.path) );
//     if(err){
//       console.log('Error writing CSS: ', err);
//     }
//   });
// }

function unzipFolder(path){
  fs.createReadStream(path)
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      var extension = fileName.substr( fileName.lastIndexOf('.') + 1 );
      if (extension == 'woff' || extension == 'ttf' || extension == 'otf' || extension == 'eot' || extension == 'svg'){
        entry.pipe(fs.createWriteStream('fonts/' + fileName));
        addFontCSS(fileName);
      }else{
        entry.autodrain();
      }
    });
}


fs.readdir('./', function(err, files){
  if(err){
    console.log('Error reading files: ', err);
    return;
  }
  files = _.filter(files, function(file){
    return file.substr(file.length - 3) === 'zip';
  });
  fs.writeFile('fonts.js', 'var fonts=[', function(err){
    if(err){
      console.log('Error creating fonts.js: ', err);
    }
  });
  _.each(files, function(file){
    unzipFolder(file);
  });
});

