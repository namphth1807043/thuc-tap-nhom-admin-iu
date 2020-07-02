<template>
  <q-page class="q-pa-sm">
    <q-table
      title="Orders Details"
      :data="orderDetail"
      :columns="cols"
      row-key="Name"
    >
      <template v-slot:body-cell-index="props">
        <q-td :props="props">
          {{ index(props.row.Id) }}
        </q-td>
      </template>
      <template v-slot:body-cell-img="props">
        <q-td :props="props">
          <q-avatar></q-avatar>
          <q-img
            :src="props.row.Img"
            style="width: 120px"
            class="rounded-borders"
            :ratio="1"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-price="props">
        <q-td :props="props">
          {{ props.row.Price | formatInteger }}
        </q-td>
      </template>
      <template v-slot:body-cell-unit_price="props">
        <q-td :props="props">
          {{ props.row.UnitPrice | formatInteger }}
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import '../utils/filter'
  import {Constants} from '../utils/const'
  import {httpClient} from "src/api/http";
  import axios from 'axios'

  export default {
    data() {
      return {
        cols: [
          {
            name: "index",
            align: "left",
            label: "Index",
            field: "index"
          },
          {
            name: "img",
            align: "left",
            label: "Product Image",
            field: "Img"
          },
          {
            name: "name",
            align: "left",
            label: "Product Name",
            field: "Name"
          },
          {
            name: "price",
            align: "left",
            label: "Product Price (VND)",
            field: "Price"
          },
          {
            name: "quantity",
            align: "left",
            label: "Quantity",
            field: "Quantity"
          },
          {
            name: "unit_price",
            align: "left",
            label: "Unit Price (VND)",
            field: "UnitPrice"
          }
        ]
      };
    },
    props: ['orderId'],
    computed: {
      ...mapState('order', ['orderDetail']),
    },
    created () {
      this.loadOrderDetail({
        orderId : this.orderId
      }) //prints out an empty string
    },
    methods: {
      ...mapActions({
        loadOrderDetail: 'order/loadOrderDetail'
      }),
      index: function (id) {
        return this.orderDetail.findIndex(x => x.Id === id) + 1;
      }
    }
  };
</script>
<style>
</style>
