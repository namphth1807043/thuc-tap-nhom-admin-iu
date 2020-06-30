import Vue from 'vue'
import Vuex from 'vuex'

import category from './category'
import order from './order'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    category,
    order
  },
});

export default function (/* { ssrContext } */) {
  return store
}
