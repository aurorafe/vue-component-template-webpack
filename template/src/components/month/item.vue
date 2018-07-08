<template>
  <div class="vue-schedule-items">
    <div class="vue-schedule-items-time clearfix">
      <span
        class="vue-schedule-items-day"
        :class="{'red': itemKey === 0 || itemKey === 6 || ((itemChild.isLunarFestival || itemChild.isGregorianFestival) && lunar)}">{{itemChild.day}}</span>
      <span
        class="vue-schedule-items-lunar"
        :class="{'isLunarFestival': itemChild.isLunarFestival, 'isGregorianFestival': itemChild.isGregorianFestival}"
        v-if="lunar">{{itemChild.lunar}}
      </span>
    </div>
    <div
      class="vue-schedule-items-persons"
      v-if="itemChild.persons
       && Array.isArray(itemChild.persons)
        && itemChild.persons.length > 0
         && !itemChild.addAble">
      <div v-for="(person, index) in itemChild.persons" v-if="index < 2" :key="index">
        <span class="persion">{{person.name}}</span>
        <span>[</span>
        <span class="post">{{person.role}}</span>
        <span class="phone">{{person.phone}}</span>
        <span>]</span>
      </div>
    </div>
    <div class="vue-schedule-items-no-persons" v-if="!itemChild.addAble && (!itemChild.persons || itemChild.persons.length === 0)">无值班</div>
    <div
      class="vue-schedule-items-add-able iconfont icon-tianjiafankui"
      v-if="itemChild.addAble && (!itemChild.persons || itemChild.persons.length === 0)"></div>
  </div>
</template>

<script>
  export default {
    name: 'vue-schedule-item',
    props: {
      itemKey: {
        type: Number,
        default: NaN
      },
      lunar: {
        type: Boolean,
        default: true
      },
      itemChild: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
        currentScheme: 'day',
        typeIconBtns: [
          {
            label: '排班',
            icon: 'icon-paiban',
            alias: 2,
            closeable: 0
          },
          {
            label: '导出',
            icon: 'icon-daochu1',
            alias: 3,
            closeable: 0
          }
        ],
        dutys: [
          {
            name: '张耀松',
            role: '值班长 ',
            unit: '路网运行处',
            phone: '18678982238'
          },
          {
            name: '钱小样',
            role: '',
            unit: '路网运行处',
            phone: '18678982238'
          },
          {
            name: '张耀松',
            role: '',
            unit: '路网运行处',
            phone: '18678982238'
          }
        ],
        isShowAddScheduling: false
      }
    },
    mounted () {
    },
    watch: {},
    methods: {
    }
  }
</script>

<style lang="scss">
  .vue-schedule-items {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: hidden;
    &-time {
      height: 34px;
      line-height: 34px;
      span {
        color: #9f9f9f;
      }
      span:nth-child(1) {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        float: left;
      }
      span:nth-child(2) {
        float: right;
      }
    }
    &-persons {
      text-align: left;
      position: absolute;
      top: 34px;
      left: 0;
      width: 100%;
      height: calc(100% - 34px);
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      align-content: flex-start;
      div {
        width: 100%;
        height: 28px;
        line-height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span.persion {
          font-weight: bold;
        }
      }
    }
    &-no-persons {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-add-able {
      font-size: 26px;
      color: transparent;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        color: #1e9fff;
      }
    }
    .isGregorianFestival, .isLunarFestival {
      color: #ea6151;
    }
    &:hover {
      background-color: #eef1f6;
      color: #1e9fff;
    }
  }
</style>
