import Vue from 'vue'
import Vuex from 'vuex'

import station from './station'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    station
  },
});

export default function (/* { ssrContext } */) {
  return store
}
