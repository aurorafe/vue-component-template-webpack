/**
 * 获取当前时间戳
 * @returns {number}
 */
const getCurrentTime = () => {
  return (new Date()).getTime()
};

/**
 * 对齐字符串
 * ```javascript
 *  var string = '12'
 *  padStart(string, 3, '0') // 012
 * ```
 * @param string
 * @param length
 * @param pad
 * @returns {*}
 */
const padStart = (string, length, pad) => {
  if (!string || string.length >= length) return string;
  return `${Array((length + 1) - string.length).join(pad)}${string}`;
};

/**
 * 判断是否为数字
 * @param n
 * @returns {boolean}
 */
const isNumber = n => (!Number.isNaN(parseFloat(n)) && Number.isFinite(n))

const monthDiff = (a, b) => {
  // function from moment.js monthDiff
  const wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month())
  const anchor = a.clone().add(wholeMonthDiff, 'months')
  let anchor2
  let adjust
  if (b - anchor < 0) {
    anchor2 = a.clone().add(wholeMonthDiff - 1, 'months')
    adjust = (b - anchor) / (anchor - anchor2)
  } else {
    anchor2 = a.clone().add(wholeMonthDiff + 1, 'months')
    adjust = (b - anchor) / (anchor2 - anchor)
  }
  return Number(-(wholeMonthDiff + adjust)) || 0
}

/**
 * 取整浮点数
 * @param n
 * @returns {number}
 */
const absFloor = n => (n < 0 ? Math.ceil(n) || 0 : Math.floor(n));

/**
 * 美化单位，全部转为小写
 * @param u
 * @returns {*|string}
 */
const prettyUnit = u => (u && String(u).toLowerCase().replace(/s$/, ''));

export {
  isNumber,
  absFloor,
  padStart,
  monthDiff,
  prettyUnit,
  getCurrentTime
}
