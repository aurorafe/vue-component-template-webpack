<template>
  <div id="app">
    <vue-schedule-week
      @select="select"
      :selected="selected"
      :schedule-list="scheduleList"></vue-schedule-week>
  </div>
</template>
<script>
import Timer from '../src/utils/date'
export default {
  name: 'App',
  data () {
    const _time = Timer().startOf('date');
    return {
      selected: {
        id: _time.valueOf(),
        time: _time.toObject()
      },
      scheduleList: [
        {
          id: _time.valueOf(),
          isDayTour: true,
          name: 'sakitam-fdd',
          role: '管理员',
          phone: '12345678',
          unit: 'XXX'
        },
        {
          id: _time.valueOf(),
          isDayTour: false,
          name: 'sakitam-fdd',
          role: '管理员',
          phone: '12345678',
          unit: 'XXX'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    select (item) {
      this.selected = item;
    }
  },
  components: {
  }
}
</script>

<style>
  html, body, #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
