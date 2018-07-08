<template>
  <div class="vue-schedule-week-items">
    <div class="week-items-li">
      <div class="week-items-li-title icon-day">
        上午
      </div>
      <span class="edit-button" @click.stop="editItem(item)"></span>
      <ul class="person-list person-no-list" v-if="!checkHasPerson(item.list, true)">
        <li>无安排</li>
      </ul>
      <ul class="person-list">
        <li
          class="person-list-list"
          v-for="(person, key) in item.list"
          :key="key"
          v-if="person.isDayTour">
          <div>
            <span class="persion">{{person.name}}</span>
            <span>[</span>
            <span class="post">{{person.role}}</span>
            <span class="phone">{{person.phone}}</span>
            <span>]</span>
          </div>
          <div>{{person.unit}}</div>
        </li>
      </ul>
    </div>
    <div class="week-items-li">
      <div class="week-items-li-title icon-night">
        夜晚
      </div>
      <ul class="person-list person-no-list" v-if="!checkHasPerson(item.list, false)">
        <li>无安排</li>
      </ul>
      <ul class="person-list" v-else>
        <li
          class="person-list-list"
          v-for="(person, key) in item.list"
          :key="key"
          v-if="!person.isDayTour">
          <div>
            <span class="persion">{{person.name}}</span>
            <span>[</span>
            <span class="post">{{person.role}}</span>
            <span class="phone">{{person.phone}}</span>
            <span>]</span>
          </div>
          <div>{{person.unit}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'vue-schedule-week-items',
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    watch: {},
    methods: {
      checkHasPerson (items, isDayTour) {
        if (items && Array.isArray(items) && items.length > 0) {
          const _person = items.filter(item => item['isDayTour'] === isDayTour)
          return (_person && _person.length > 0)
        } else {
          return false
        }
      },
      editItem (item) {
        console.table(item)
      }
    }
  }
</script>

<style lang="scss">
  .vue-schedule-week-items {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: hidden;
    box-sizing: border-box;
    .week-items-li {
      height: 50%;
      width: 100%;
      position: relative;
      .edit-button {
        position: absolute;
        top: 5px;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        background: #1e9fff url("../../assets/icons/edit.svg") 6px 6px no-repeat;
        color: #ffffff;
        display: none;
      }
      .icon-day {
        background: url("../../assets/icons/day.svg") 6px 10px no-repeat;
        &:before {
          color: #f5cb37;
        }
      }
      .icon-night {
        background: url("../../assets/icons/night.svg") 6px 10px no-repeat;
        &:before {
          color: #20a0ff;
        }
      }
      .person-list {
        text-align: left;
        position: absolute;
        top: 34px;
        left: 0;
        width: 100%;
        height: calc(100% - 40px);
        padding: 10px;
        box-sizing: border-box;
        list-style: none;
        &-list {
          line-height: 20px;
          height: 48px;
          div {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span.persion {
              font-weight: bold;
            }
          }
        }
      }
      .person-no-list {
        text-align: center;
        li {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          align-content: flex-start;
        }
      }
      &-title {
        text-align: left;
        color: #3b3b3b;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        padding-left: 30px;
        &:before {
          font-size: 18px;
          padding: 0 6px;
        }
      }
    }
    &:hover {
      background-color: #eef1f6;
      color: #1e9fff;
      .edit-button {
        display: block;
      }
    }
  }
</style>
