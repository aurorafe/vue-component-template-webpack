<template>
  <div class="vue-schedule-week">
    <table cellpadding="5">
      <thead>
      <tr>
        <td
          v-for="(week, index) in weeks"
          :key="index"
          class="week"
          :class="tables[index] && tables[index]['id'] === selected.id ? 'thead-selected' : ''">
          <span>{{tables[index] && tables[index]['time'] && tables[index]['time']['day']}}</span>
          <span>{{' ' + week}}</span>
        </td>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td
          v-for="(item, key) in tables"
          :key="key"
          :class="{'selected': selected.id === item.id, 'disabled': item.disabled}"
          @click="select(item, $event)">
          <vue-schedule-week-items :item="item"></vue-schedule-week-items>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import { WEEKS } from '../../utils/constants';
  import Timer from '../../utils/date'
  import { getCurrentTime } from '../../utils';
  import VueScheduleWeekItems from './item';
  export default {
    name: 'vue-schedule-week',
    props: {
      value: {
        type: [String, Array, Number, Date],
        default: function () {
          return getCurrentTime()
        }
      },
      weeks: {
        type: Array,
        default: function () {
          return WEEKS
        }
      },
      selected: {
        type: Object,
        default: function () {
          const _time = Timer().startOf('date');
          return {
            id: _time.valueOf(),
            time: _time.toObject()
          }
        }
      },
      scheduleList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        tables: []
      }
    },
    watch: {
      value () {
        this.init()
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        const now = new Date();
        let currentYear = now.getFullYear();
        let currentMonth = now.getMonth();
        let currentDay = now.getDate();
        if (this.value.length > 0) {
          currentYear = parseInt(this.value[0]);
          currentMonth = parseInt(this.value[1]) - 1;
          currentDay = parseInt(this.value[2]);
        }
        const _weeks = Timer(new Date(currentYear, currentMonth, currentDay)).getWeeks();
        this.tables = _weeks.map(_item => {
          _item.selected = _item.order === 'same';
          _item.list = this.scheduleList.filter(list => list.id === _item.id);
          return _item;
        })
      },
      // 选中日期
      select (item, e) {
        if (e !== undefined) e.stopPropagation();
        this.$emit('select', item);
      }
    },
    components: {
      VueScheduleWeekItems
    }
  }
</script>

<style lang="scss" scoped>
  .vue-schedule-week {
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
          font-size: 14px;
          pointer-events: none !important;
          cursor: default !important;
          span:nth-child(1) {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            font-weight: bold;
          }
          span:nth-child(2) {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
          }
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

    .thead-selected {
      span:nth-child(1) {
        background-color: #1e9fff;
        color: #ffffff;
      }
    }

    .selected {
      background-color: #e9f6fe;
      color: #1e9fff;
      .vue-schedule-week-items {
        border: 1px solid #1e9fff;
      }
    }
  }
</style>
