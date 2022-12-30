let custom = {};

custom.createRandomString = function(strType, strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    strType = typeof(strType) == 'number' && strType > 0 ? strType : false;
    if(strLength){
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        if(strType == 1){
            possibleCharacters = '0123456789';
        }
        let str = '';
        for(i = 1; i <= strLength; i++) {
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str+=randomCharacter;
        }
        return str;
    } else {
        return false;
    }
  };

module.exports = custom;