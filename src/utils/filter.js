import numeral from 'numeral'
import Vue from 'vue'
import moment from 'moment'
import { Constants } from '../utils/const'

Vue.filter('filterStatus', function (value) {
  let status = Constants.Status
  for(let item of status){
    if (item.value === value){
      return item.label
    }
  }
})
Vue.filter('filterOrderStatus', function (value) {
  let status = Constants.OrderStatus
  for(let item of status){
    if (item.value === value){
      return item.label
    }
  }
})
Vue.filter('filterDateTime', function (value) {
  return moment(value).format('DD/MM/YYYY HH:mm:ss')
})

Vue.filter('formatInteger', function (value) {
  return value ? numeral(value).format('0,0') : ''
})


