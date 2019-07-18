
export const COMMON_UTILITIES = {
    isEmpty,
    isEmptyObject,
    onImageErrorHandler,
    timeFormat,
    findObjectByKey,
    getWindowWidth, 
    epochToTime,
    getPosition,
    getCurrentEpochTime,

}


/**
* Description: isEmpty will check the empty value
* @param {string} _param
* @return {boolean}
*/
function isEmpty(_param) {
    return (_param === 'undefined' || _param === undefined || _param === '' || _param === null);
}

/**
* Description: isEmptyObject will check the empty object
* @param {object} _obj
* @return {boolean}
*/
function isEmptyObject(_obj) {
    if (_obj == null) return true;// null and undefined are "empty"
    if (_obj.length > 0) return false;
    if (_obj.length === 0) return true;
    for (var key in _obj) {
        if (hasOwnProperty.call(_obj, key)) return false;
    }
    return true;
}


/**
 * Description: If image source not available or url is not working
 * @param {e}object
 * @return {none}
 */
function onImageErrorHandler(e) {
    e.target.src = 'images/no-image.png';
}

/**
    * Description: Get Hour and Minute
    * @param {time}string
    * @return {string}
    */
function timeFormat(time) {
    if (isEmpty(time)) {
        return false;
    }
    const HR = time[2] + time[3];
    const MIN = time[5] + time[6];
    return (HR * 1) + 'h ' + (MIN * 1) + 'm';
}

/**
    * Description: Get Hour and Minute
    * @param {time}string
    * @return {string}
    */
function epochToTime(time) {
    if (isEmpty(time)) {
        return false;
    }
    let date = new Date(parseFloat(time));
    let convertedTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
return convertedTime;
}

function getCurrentEpochTime(){
    let milliseconds = (new Date).getTime();
    console.log("milliseconds ",milliseconds)
    return milliseconds;
}

/**
 * Description: Get WINDOW WIDTH
 * @return {Number} 
 */
function getWindowWidth() {
    return window.innerWidth;
}


/**
 * Description: Return the Object by searching corresponding an array
 * @param {String} array   // Json Array object
 * @param {String} key     // searching object on behalf of the key
 * @param {String} value   // value of key
 * @return {object}
 */
function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

function getPosition(el) {
    var xPos = 0;
    var yPos = 0;
   
    while (el) {
      if (el.tagName == "BODY") {
        // deal with browser quirks with body/window/document and page scroll
        var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
        var yScroll = el.scrollTop || document.documentElement.scrollTop;
   
        xPos += (el.offsetLeft - xScroll + el.clientLeft);
        yPos += (el.offsetTop - yScroll + el.clientTop);
      } else {
        // for all other non-BODY elements
        xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      }
   
      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos
    };
  }


