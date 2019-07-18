/**
 * Summary: Helper
 * Description: common methods added at Helper utility
 * @author Abhishek Shrivastava
 * @date  21.01.2019
 */
const Helper = (function() {
  /**
   * Description: Add itme at array
   * @param {Array}  _items
   * @param {Object} _item
   */
  const addItem = (_items, _item) => {
    _items.push(_item);
    //console.log(_items);
  };

  /**
   * Description: remove the item from array by position
   * @param {Array} _items
   * @param {Number} _position
   * @param {Number} _length
   */
  const removeItemByPosition = (_items, _position, _length) => {
    _items.splice(_position, _length);
    //console.log(_items);
  };

  /**
   * Description: remove the item from array by position
   * @param {Array} _items
   * @param {Object} _item
   * @return {Array}
   */
  const removeItemByKey = (_items, _item, _key) => {
    console.log(_items.length);
    let items = _items.filter(item => {
      return item[_key] != _item[_key];
    });
    return items;
    //console.log(_items);
  };

  /**
   * Description: check item is available or not
   * @param {Array} _items
   * @param {Object} _item
   * @return {Number}
   */
  const isAvailable = (_items, _item, _key) => {
    let items = _items.filter(item => {
      return item[_key] == _item[_key];
    });
    return items.length;
    //console.log(_items);
  };

  /**
   * Description: remove the item from array by position
   * @param {Array} _items
   * @param {Number} _position
   * @param {Number} _length
   */
  const convertMS = _milliseconds => {
    var days, hours, minutes, seconds;
    seconds = Math.floor(_milliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    days = Math.floor(hours / 24);
    hours = hours % 24;
    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  };

  /**
   * Description: show data in days hours minutes seconds
   * @param {Array} _data
   * @return {Object}
   */
  const format = _data => {
    var format = "";
    var { days, hours, minutes, seconds } = _data;
    days =
      days < 10 ? "00" + days : days >= 10 && days < 100 ? "0" + days : days;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    format = minutes + ":" + seconds;
    format = hours != 0 ? hours + ":" + format : format;
    format = days != 0 ? days + ":" + format : format;
    return format;
  };

  /**
   * Description: remove the item from array by position
   * @param {Number} _milliseconds
   * @return {String}
   */
  const getTime = _milliseconds => {
    return format(convertMS(_milliseconds));
  };

  return {
    addItem: addItem,
    removeItemByPosition: removeItemByPosition,
    removeItemByKey: removeItemByKey,
    isAvailable: isAvailable,
    getTime: getTime
  };
})();

export default Helper;
