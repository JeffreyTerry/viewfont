var _ = require('underscore');

function removeCharFromString(string, index){
  return string.substring(0, index) + string.substr(index + 1);
}

function isAlphanumeric(character){
  var lower = character.toLowerCase();
  if(lower != character.toUpperCase() || !isNaN(character)) return true;
}

function isSeparator(character, prevChar){
  if(prevChar && isSeparator(prevChar) && isAlphanumeric(character)) return false;  //Don't count letters or numbers if the character preceding them was also a separator
  if(character == '-' || character == '_' || character == ' ' || character == character.toUpperCase() || !isNaN(character)) return true;
  return false;
}

function getFontNameFromPath( path ){
  if(path.indexOf('.') != -1){
    path = path.substring(0, path.lastIndexOf('.'));
  }
  var splitPoints = [0];
  var character;
  var prevChar;
  for(var i = 0; i < path.length; i++){
    character = path.charAt(i);
    if( isSeparator(character, prevChar) ){
      splitPoints.unshift(i);
      if( !isAlphanumeric(character) ){
        path = removeCharFromString(path, i);
      }
    }
    prevChar = character;
  }
  var words = [];
  var word;

  _.each(splitPoints, function(splitIndex){
    word = path.slice(splitIndex);
    word = word.slice(0, 1).toUpperCase() + word.slice(1);  // Capitalize the word
    words.unshift(word);
    path = path.substr(0, splitIndex);
  });

  return words.join(' ').trim();
}

module.exports = {
  parse: getFontNameFromPath
}