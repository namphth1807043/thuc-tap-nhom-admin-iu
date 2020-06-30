import { httpClient } from 'src/api/http';

export async function loadOrders({ commit, dispatch }, { filter, page, size }) {
  commit('fetchOrdersBegin');

  try {
    const queryParams = new URLSearchParams({
      ...filter,
      page: page,
      size: size
    }).toString()
    const response = await httpClient.get(`/orders?${queryParams}`)

    commit('fetchOrdersSuccess', {
      orders: response.Data,
      paging: response.Paging
    })

    if(response.orders && response.orders.length > 0) {
      return response.orders
    } else {
      return null
    }
  } catch (error) {
    commit('fetchOrdersError', error)
    return null
  }
}

export async function saveOrder({ commit }, { order }) {
  commit('saveOrderBegin')

  const data = {
    name: order.name
  }

  try {
    if (order.Id) {
      order = await httpClient.put(`/orders/${order.Id}`, data)
    } else {
      order = await httpClient.post(
        '/orders',
        data
      )
    }

    commit('saveOrderSuccess', {
      category: { ...order },
      isSaved: true
    })
  } catch (error) {
    commit('saveOrderError', error)
  }
}
