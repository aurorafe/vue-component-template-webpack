<template>
  <div class="vue-schedule-month">
    <table cellpadding="5">
      <thead>
      <tr>
        <td v-for="(week, index) in weeks" class="week" :key="index">{{week}}</td>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(day, k1) in days" :key="k1" style="{'animation-delay', (k1*30)+'ms'} ">
          <td
            v-for="(child, k2) in day"
            :key="k2"
            :class="{'selected': child.selected, 'disabled': child.disabled}"
            @click="select(k1, k2, child, $event)">
            <vue-schedule-item :item-key="k2" :item-child="child" :lunar="lunar"></vue-schedule-item>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import calendar from '../../utils/helper.js'
  import VueScheduleItem from './item'
  export default {
    props: {
      // 默认日期
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 是否小于10补零
      zero: {
        type: Boolean,
        default: false
      },
      // 屏蔽的日期
      disabled: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 是否显示农历
      lunar: {
        type: Boolean,
        default: true
      },
      // 自定义星期名称
      weeks: {
        type: Array,
        default: function () {
          return window.navigator.language.toLowerCase() === 'zh-cn' ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }
      },
      // 自定义月份
      months: {
        type: Array,
        default: function () {
          return window.navigator.language.toLowerCase() === 'zh-cn' ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
      }
    },
    data () {
      return {
        days: [],
        today: [],
        festival: {
          lunar: {
            '1-1': '春节',
            '1-15': '元宵节',
            '2-2': '龙头节',
            '5-5': '端午节',
            '7-7': '七夕节',
            '7-15': '中元节',
            '8-15': '中秋节',
            '9-9': '重阳节',
            '10-1': '寒衣节',
            '10-15': '下元节',
            '12-8': '腊八节',
            '12-23': '祭灶节'
          },
          gregorian: {
            '1-1': '元旦',
            '2-14': '情人节',
            '3-8': '妇女节',
            '3-12': '植树节',
            '4-5': '清明节',
            '5-1': '劳动节',
            '5-4': '青年节',
            '6-1': '儿童节',
            '7-1': '建党节',
            '8-1': '建军节',
            '9-10': '教师节',
            '10-1': '国庆节',
            '12-24': '平安夜',
            '12-25': '圣诞节'
          }
        },
        insideYear: 0,
        insideMonth: 0,
        insideDay: 0,
        scheduleList: []
      }
    },
    watch: {
      value () {
        this.init()
      }
    },
    mounted () {
      this.$fetch.queryScheduleList().then(res => {
        if (res.data && res.data.data) {
          this.scheduleList = res.data.data
          this.init()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    methods: {
      init () {
        const now = new Date();
        this.insideYear = now.getFullYear();
        this.insideMonth = now.getMonth();
        this.insideDay = now.getDate();
        if (this.value.length > 0) {
          this.insideYear = parseInt(this.value[0]);
          this.insideMonth = parseInt(this.value[1]) - 1;
          this.insideDay = parseInt(this.value[2]);
        }
        this.render(this.insideYear, this.insideMonth);
      },
      // 渲染日期
      render (y, m) {
        let firstDayOfMonth = new Date(y, m, 1).getDay(); // 当月第一天
        let lastDateOfMonth = new Date(y, m + 1, 0).getDate(); // 当月最后一天
        let lastDayOfLastMonth = new Date(y, m, 0).getDate(); // 最后一月的最后一天
        let seletSplit = this.value
        let [i, line, temp, nextMonthPushDays] = [undefined, 0, [], 1]
        for (i = 1; i <= lastDateOfMonth; i++) {
          let day = new Date(y, m, i).getDay() // 返回星期几（0～6）
          let k
          // 第一行
          if (day === 0) {
            temp[line] = []
          } else if (i === 1) {
            temp[line] = []
            k = lastDayOfLastMonth - firstDayOfMonth + 1
            for (let j = 0; j < firstDayOfMonth; j++) {
              temp[line].push(this.computedItem(this.computedPrevYear(), this.computedPrevMonth(true), k, false, true))
              k++
            }
          }
          let chk = new Date()
          let chkY = chk.getFullYear()
          let chkM = chk.getMonth()
          // 匹配上次选中的日期
          if (parseInt(seletSplit[0]) === this.insideYear && parseInt(seletSplit[1]) - 1 === this.insideMonth && parseInt(seletSplit[2]) === i) {
            temp[line].push(this.computedItem(this.insideYear, this.insideMonth + 1, i, true, false))
            this.today = [line, temp[line].length - 1]
          } else if (chkY === this.insideYear && chkM === this.insideMonth && i === this.insideDay && (!this.value || this.value.length <= 0)) {
            temp[line].push(this.computedItem(this.insideYear, this.insideMonth + 1, i, true, false))
            this.today = [line, temp[line].length - 1]
          } else {
            // 普通日期
            let options = this.computedItem(this.insideYear, this.insideMonth + 1, i, false, false)
            if (this.disabled.length > 0) {
              if (this.disabled.filter(v => {
                return this.insideYear === v[0] && this.insideMonth === v[1] - 1 && i === v[2]
              }).length > 0) {
                options.disabled = true
              }
            }
            temp[line].push(options)
          }
          // 到周六换行
          if (day === 6 && i < lastDateOfMonth) {
            line++
          } else if (i === lastDateOfMonth) {
            // line++
            let k = 1
            for (let d = day; d < 6; d++) {
              temp[line].push(this.computedItem(this.computedNextYear(), this.computedNextMonth(true), k, false, true))
              k++
            }
            // 下个月除了补充的前几天开始的日期
            nextMonthPushDays = k
          }
        } // end for
        // 补充第六行让视觉稳定
        if (line <= 5 && nextMonthPushDays > 0) {
          for (let i = line + 1; i <= 5; i++) {
            temp[i] = []
            let start = nextMonthPushDays + (i - line - 1) * 7
            for (let d = start; d <= start + 6; d++) {
              temp[i].push(this.computedItem(this.computedNextYear(), this.computedNextMonth(true), d, false, true))
            }
          }
        }
        this.days = temp
      },
      // 计算每一项
      computedItem (year, month, day, selected, disabled) {
        const _persons = this.scheduleList.filter(item => item['id'] === String(year) + String(month) + String(day))
        const _addAble = this.computedAbleAdd(year, month, day, _persons)
        return Object.assign(
          {
            day: day,
            disabled: disabled,
            selected: selected,
            persons: (_persons && _persons.length > 0) ? _persons[0]['persons'] : undefined,
            addAble: _addAble
          },
          this.getLunarInfo(year, month, day)
        )
      },
      computedAbleAdd (year, month, day, _persons) {
        const now = new Date()
        const today = now.getDate()
        const toYear = now.getFullYear()
        const toMonth = now.getMonth() + 1
        if (_persons && _persons.length > 0) { // 若已排班，忽略一切情况不可添加
          return false
        } else if (parseInt(year) > toYear) { // 未排班，且年份大于当前允许添加
          return true
        } else if (parseInt(year) === toYear && parseInt(month) > toMonth) { // 未排班，同一年，月份大于当前月
          return true
        } else if (parseInt(year) === toYear && parseInt(month) === toMonth && parseInt(day) >= today) {
          return true
        } else {
          return false
        }
      },
      computedPrevYear () {
        let value = this.insideYear
        if (this.insideMonth - 1 < 0) {
          value--
        }
        return value
      },
      computedPrevMonth (isString) {
        let value = this.insideMonth
        if (this.insideMonth - 1 < 0) {
          value = 11
        } else {
          value--
        }
        // 用于显示目的（一般月份是从0开始的）
        if (isString) {
          return value + 1
        }
        return value
      },
      computedNextYear () {
        let value = this.insideYear
        if (this.insideMonth + 1 > 11) {
          value++
        }
        return value
      },
      computedNextMonth (isString) {
        let value = this.insideMonth
        if (this.insideMonth + 1 > 11) {
          value = 0
        } else {
          value++
        }
        // 用于显示目的（一般月份是从0开始的）
        if (isString) {
          return value + 1
        }
        return value
      },
      // 获取农历信息
      getLunarInfo (y, m, d) {
        let lunarInfo = calendar.solar2lunar(y, m, d)
        let lunarValue = lunarInfo.IDayCn
        // console.log(lunarInfo)
        let isLunarFestival = false
        let isGregorianFestival = false
        if (this.festival.lunar[lunarInfo.lMonth + '-' + lunarInfo.lDay] !== undefined) {
          lunarValue = this.festival.lunar[lunarInfo.lMonth + '-' + lunarInfo.lDay]
          isLunarFestival = true
        } else if (this.festival.gregorian[m + '-' + d] !== undefined) {
          lunarValue = this.festival.gregorian[m + '-' + d]
          isGregorianFestival = true
        }
        return {
          lunar: lunarValue,
          isLunarFestival: isLunarFestival,
          isGregorianFestival: isGregorianFestival
        }
      },
      // 选中日期
      select (k1, k2, child, e) {
        if (e !== undefined) e.stopPropagation()
        // 取消上次选中
        // if (this.today.length > 0) {
        //   this.days.forEach(v => {
        //     v.forEach(vv => {
        //       vv.selected = false
        //     })
        //   })
        // }
        // 设置当前选中天
        // this.days[k1][k2].selected = true
        this.insideDay = this.days[k1][k2].day
        this.today = [k1, k2]
        const clickDay = [this.insideYear, this.zero ? this.zeroPad(this.insideMonth + 1) : this.insideMonth + 1, this.zero ? this.zeroPad(this.days[k1][k2].day) : this.days[k1][k2].day]
        if (child.addAble && (!child.persons || child.persons.length === 0)) { // 只有可添加的才能触发事件
          this.$emit('select', clickDay, child)
        }
      },
      // 返回今天
      setToday () {
        this.render(this.insideYear, this.insideMonth)
        // 遍历当前日找到选中
        this.days.forEach(v => {
          let day = v.find(vv => {
            return vv.day === this.insideDay && !vv.disabled
          })
          if (day !== undefined) {
            day.selected = true
          }
        })
      },
      // 日期补零
      zeroPad (n) {
        return String(n < 10 ? '0' + n : n)
      }
    },
    components: {
      VueScheduleItem
    }
  }
</script>
<style lang="scss">
  .vue-schedule-month {
    margin: auto;
    width: 100%;
    height: calc(100% - 10px);
    min-width: 300px;
    background: #fff;
    font-family: "PingFang SC", "Hiragino Sans GB", "STHeiti", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    user-select: none;
    table {
      clear: both;
      width: 100%;
      height: 100%;
      margin-bottom: 10px;
      border-collapse: collapse;
      color: #444444;
      thead {
        td {
          text-transform: uppercase;
          height: 40px;
          background-color: #eef1f6;
          vertical-align: middle;
        }
      }
      td {
        margin: 2px !important;
        padding: 0px 0;
        width: 14.28571429%;
        height: 44px;
        text-align: center;
        vertical-align: middle;
        font-size: 14px;
        line-height: 125%;
        cursor: pointer;
        position: relative;
        vertical-align: top;
      }
      tbody {
        tr {
          td {
            border: 1px solid #dce1e5;
            .vue-schedule-items {
              border: 1px solid transparent;
              box-sizing: border-box;
            }
          }
        }
      }
    }

    td.week {
      font-size: 10px;
      pointer-events: none !important;
      cursor: default !important;
    }

    td.disabled {
      color: #ccc;
      pointer-events: none !important;
      cursor: default !important;
    }

    td:not(.disabled) span.red {
      color: #ea6151;
    }

    .selected {
      background-color: #e9f6fe;
      color: #1e9fff;
      .vue-schedule-items {
        border: 1px solid #1e9fff;
      }
      .vue-schedule-items-time {
        span:nth-child(1) {
          background-color: #1e9fff;
          color: #ffffff;
        }
        span:nth-child(2) {
          color: #1e9fff;
        }
      }
    }
  }
</style>
