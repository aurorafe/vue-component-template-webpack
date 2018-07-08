import calendar from './helper'
import {padStart, prettyUnit, isNumber} from '../utils'
import {
  FESTIVAL,
  MILLISECONDS_A_WEEK,
  MILLISECONDS_A_DAY,
  MILLISECONDS_A_HOUR,
  MILLISECONDS_A_MINUTE,
  MILLISECONDS_A_SECOND
} from './constants';

class Timer {
  static getOriginDate (params) {
    let reg;
    if (!params) return new Date();
    if (params instanceof Date) return params;
    reg = String(params).match(/^(\d{4})-?(\d{2})-?(\d{1,2})$/);
    if (reg) {
      return new Date(reg[1], reg[2] - 1, reg[3])
    }
    return new Date(params)
  }

  constructor (arg, festival = FESTIVAL) {
    /**
     * 原始时间戳
     */
    this._date = Timer.getOriginDate(arg);

    /**
     * 是否为夏令时
     * 实际返回的是本地时间与 GMT 时间或 UTC 时间之间相差的分钟数
     * @type {number}
     * @private
     */
    this._zone = this._date.getTimezoneOffset() / 60;
    this._zoneStr = padStart(String(this._zone * -1).replace(/^(.)?(\d)/, '$10$200'), 5, '+')

    /**
     * 年份
     * @type {number}
     * @private
     */
    this._year = this._date.getFullYear();

    /**
     * 月份
     * @type {number}
     */
    this._month = this._date.getMonth();

    /**
     * 日期
     * @type {number}
     * @private
     */
    this._day = this._date.getDate();

    /**
     * week
     * @type {number}
     */
    this._week = this._date.getDay();

    /**
     * hours
     * @type {number}
     */
    this._hours = this._date.getHours();

    /**
     * minutes
     * @type {number}
     */
    this._minutes = this._date.getMinutes();

    /**
     * seconds
     * @type {number}
     */
    this._seconds = this._date.getSeconds();

    /**
     * 毫秒
     * @type {number}
     */
    this._ms = this._date.getMilliseconds();

    /**
     * 定义农历日期
     * @type {{} & {lunar: {"1-1": string, "1-15": string, "2-2": string, "5-5": string, "7-7": string, "7-15": string, "8-15": string, "9-9": string, "10-1": string, "10-15": string, "12-8": string, "12-23": string}, gregorian: {"1-1": string, "2-14": string, "3-8": string, "3-12": string, "4-5": string, "5-1": string, "5-4": string, "6-1": string, "7-1": string, "8-1": string, "9-10": string, "10-1": string, "12-24": string, "12-25": string}}}
     * @private
     */
    this._festival = Object.assign({}, FESTIVAL, festival);
  }

  /**
   * 获取当前天所在周
   * @returns {Array}
   */
  getWeeks () {
    const _weeks = [];
    const _start = this.startOf('week');
    for (let _week = 0; _week < 7; _week++) {
      let _next = _start.add(1 * _week, 'day');
      _weeks.push({
        id: _next.valueOf(),
        time: _next.toObject(),
        week: _next.getWeek(),
        order: _next.isBefore(this.startOf('date'), '') ? 'before' : (_next.isSame(this.startOf('date'), '') ? 'same' : 'after')
      })
    }
    return _weeks;
  }

  /**
   * 获取当前时间所在月份的所有日期
   */
  getMonthDays () {

  }

  /**
   * get year
   * @returns {number}
   */
  getYear () {
    return this._year;
  }

  /**
   * get month
   * @returns {number}
   */
  getMonth () {
    return this._month + 1;
  }

  /**
   * get day
   * @returns {number}
   */
  getDay () {
    return this._day;
  }

  /**
   * get day
   * @returns {number}
   */
  getWeek () {
    return this._week;
  }

  /**
   * get houer
   * @returns {number}
   */
  getHour () {
    return this._hours;
  }

  /**
   * get minutes
   * @returns {number}
   */
  getMinute () {
    return this._minutes;
  }

  /**
   * get second
   * @returns {number}
   */
  getSecond () {
    return this._seconds;
  }

  /**
   * get ms
   * @returns {number}
   */
  getMillisecond () {
    return this._ms;
  }

  /**
   * get unix
   * @returns {number}
   */
  getUnix () {
    return Math.floor(this.valueOf() / 1000)
  }

  /**
   * 获取农历
   * @returns {{lunar: *, isLunarFestival: boolean, isGregorianFestival: boolean}}
   */
  getLunar () {
    const _year = this.getYear();
    const _month = this.getMonth();
    const _day = this.getDay();
    const lunarInfo = calendar.solar2lunar(_year, _month, _day);
    let lunarValue = lunarInfo.IDayCn
    let isLunarFestival = false
    let isGregorianFestival = false
    if (this._festival.lunar[lunarInfo.lMonth + '-' + lunarInfo.lDay] !== undefined) {
      lunarValue = this._festival.lunar[lunarInfo.lMonth + '-' + lunarInfo.lDay];
      isLunarFestival = true
    } else if (this._festival.gregorian[_month + '-' + _day] !== undefined) {
      lunarValue = this._festival.gregorian[_month + '-' + _day];
      isGregorianFestival = true
    }
    return {
      lunar: lunarValue,
      isLunarFestival: isLunarFestival,
      isGregorianFestival: isGregorianFestival
    }
  }

  /**
   * value
   * @returns {number}
   */
  valueOf () {
    return this._date.getTime();
  }

  /**
   * 获取起始时间
   * @param units
   * @param isStartOf
   * @returns {*}
   */
  startOf (units, isStartOf = true) {
    const unit = prettyUnit(units);
    const instanceFactory = (d, m, y = this._year) => {
      const ins = new Timer(new Date(y, m, d));
      return isStartOf ? ins : ins.endOf('day');
    };
    const instanceFactorySet = (method, slice) => {
      const argumentStart = [0, 0, 0, 0];
      const argumentEnd = [23, 59, 59, 999];
      return new Timer(this.toDate()[method].apply(
        this.toDate(),
        isStartOf ? argumentStart.slice(slice) : argumentEnd.slice(slice)
      ))
    };
    switch (unit) {
      case 'year':
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11, this._year);
      case 'month':
        return isStartOf ? instanceFactory(1, this._month) : instanceFactory(0, this._month + 1, this._year);
      case 'week':
        return isStartOf ? instanceFactory(this._day - this._week, this._month)
          : instanceFactory(this._day + (6 - this._week), this._month, this._year);
      case 'day':
      case 'date':
        return instanceFactorySet('setHours', 0);
      case 'hour':
        return instanceFactorySet('setMinutes', 1);
      case 'minute':
        return instanceFactorySet('setSeconds', 2);
      case 'second':
        return instanceFactorySet('setMilliseconds', 3);
      default:
        return this.clone()
    }
  }

  /**
   * 获取结束时间
   * @param arg
   * @returns {*}
   */
  endOf (arg) {
    return this.startOf(arg, false)
  }

  /**
   * set time
   * @param units
   * @param int
   * @returns {Timer}
   */
  mSet (units, int) {
    const unit = prettyUnit(units);
    switch (unit) {
      case 'date':
        this._date.setDate(int);
        break;
      case 'month':
        this._date.setMonth(int);
        break;
      case 'year':
        this._date.setFullYear(int);
        break;
      default:
        break
    }
    return this
  }

  /**
   * set string
   * @param string
   * @param int
   * @returns {*}
   */
  set (string, int) {
    if (!isNumber(int)) return this;
    return this.clone().mSet(string, int)
  }

  /**
   * add time
   * @param number
   * @param units
   * @returns {*}
   */
  add (number, units) {
    const unit = (units && units.length === 1) ? units : prettyUnit(units);
    let step;
    switch (unit) {
      case 'month':
        let date = this.set('date', 1).set('month', this._month + number);
        date = date.set('date', Math.min(this._date, date.inMonth()));
        return date;
      case 'year':
        return this.set('year', this._year + number);
      case 'minute':
        step = MILLISECONDS_A_MINUTE;
        break;
      case 'hour':
        step = MILLISECONDS_A_HOUR;
        break;
      case 'day':
        step = MILLISECONDS_A_DAY;
        break;
      case 'week':
        step = MILLISECONDS_A_WEEK;
        break;
      default:
        step = MILLISECONDS_A_SECOND;
        break;
    }
    const nextTimeStamp = this.valueOf() + (number * step);
    return new Timer(nextTimeStamp)
  }

  /**
   * 减少时间
   * @param number
   * @param string
   * @returns {*}
   */
  subtract (number, string) {
    return this.add(number * -1, string)
  }

  /**
   * 是否闰年
   * @returns {boolean}
   */
  isLeapYear () {
    return ((this._year % 4 === 0) && (this._year % 100 !== 0)) || (this._year % 400 === 0);
  }

  /**
   * check is in month
   * @returns {number}
   */
  inMonth () {
    return this.endOf('month')._day;
  }

  /**
   * 判断时间是否相同
   * @param that
   * @param precision
   * @returns {boolean}
   */
  isSame (that, precision) {
    return this.valueOf() === that.valueOf()
  }

  /**
   * 判断是否为之前
   * @param that
   * @param precision
   * @returns {boolean}
   */
  isBefore (that, precision) {
    return this.valueOf() < that.valueOf()
  }

  /**
   * 判断是否之后
   * @param that
   * @param precision
   * @returns {boolean}
   */
  isAfter (that, precision) {
    return this.valueOf() > that.valueOf()
  }

  /**
   * clone time
   * @returns {Timer}
   */
  clone () {
    return new Timer(this)
  }

  /**
   * 获取原始时间戳
   * @returns {Date}
   */
  toDate () {
    return new Date(this._date);
  }

  /**
   * 转化为数组
   * @returns {*[]}
   */
  toArray () {
    return [
      this.getYear(),
      this.getMonth(),
      this.getWeek(),
      this.getDay(),
      this.getHour(),
      this.getMinute(),
      this.getSecond(),
      this.getMillisecond(),
      this.getLunar()
    ]
  }

  /**
   * 转换为JSON
   * @returns {string}
   */
  toJSON () {
    return this._date.toISOString()
  }

  /**
   * 转换为Object
   * @returns {{years: number, months: number, week: number, hours: number, minutes: number, seconds: number, milliseconds: number}}
   */
  toObject () {
    return {
      years: this.getYear(),
      months: this.getMonth(),
      week: this.getWeek(),
      day: this.getDay(),
      hours: this.getHour(),
      minutes: this.getMinute(),
      seconds: this.getSecond(),
      milliseconds: this.getMillisecond(),
      lunar: this.getLunar()
    }
  }

  /**
   * to string
   * @returns {string}
   */
  toString () {
    return this._date.toUTCString();
  }
}

export default params => (new Timer(params))
