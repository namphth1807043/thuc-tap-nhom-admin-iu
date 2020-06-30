import numeral from 'numeral'
import Vue from 'vue'
import moment from 'moment'

Vue.filter('filterStatus', function (value) {
  return value === 1 ? 'Active' : 'Deactivate'
})

