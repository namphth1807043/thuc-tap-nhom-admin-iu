<template>
  <q-page class="q-pa-sm">
    <q-table
      title="Orders"
      :data="orders"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="Name"
      :grid="mode==='grid'"
      :filter="filter"
      :pagination.sync="pagination"
      @request="onRequest"
      :loading="isLoading"
    >
      <template v-slot:top-right="props">

        <div class="q-pl-md q-pr-sm" style="width: 200px">
          <div class="q-gutter-md">
            <q-select
              clearable
              dense
              outlined
              v-model="filter.status"
              :options="statuses"
              label="Status"
              emit-value
              map-options
            />
          </div>
        </div>

        <q-btn
          class="q-mr-sm"
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="mode = mode === 'grid' ? 'list' : 'grid';
          separator = mode === 'grid' ? 'none' : 'horizontal'"
          v-if="!props.inFullscreen"
        >
          <q-tooltip
            :disable="$q.platform.is.mobile"
            v-close-popup
          >{{mode==='grid' ? 'List' : 'Grid'}}
          </q-tooltip>
        </q-btn>

        <q-btn
          class="q-mx-none"
          color="primary"
          icon-right="archive"
          label="Export"
          @click="exportTable"
        />
      </template>
      <template v-slot:body-cell-index="props">
        <q-td :props="props">
          {{ index(props.row.Id) }}
        </q-td>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props" class="text-capitalize">
          {{ props.row.CustomerName }}
        </q-td>
      </template>
      <template v-slot:body-cell-total_price="props">
        <q-td :props="props">
          {{ props.row.TotalPrice | formatInteger }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ props.row.CreatedAt | filterDateTime }}
        </q-td>
      </template>
      <template v-slot:body-cell-updated_at="props">
        <q-td :props="props" v-if="props.row.UpdatedAt">
          {{ props.row.UpdatedAt | filterDateTime }}
        </q-td>
        <q-td :props="props" v-else>
          Chưa cập nhật
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="(props.row.Status === 2)?'green':(props.row.Status === 1?'orange':'red')"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
          >{{props.row.Status | filterOrderStatus}}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn dense color="green" icon="check" @click="done(props.row)"/>
            <q-btn dense color="red" icon="clear" @click="cancel(props.row)"/>
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
  import {exportFile} from "quasar";
  import {mapState, mapActions} from 'vuex'
  import '../utils/filter'
  import {Constants} from '../utils/const'
  import DateRangePicker from 'vue2-daterange-picker'
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
  import {saveCategory} from "src/store/category/actions";
  import {httpClient} from "src/api/http";
  import axios from 'axios'

  function wrapCsvValue(val, formatFn) {
    let formatted = formatFn !== void 0 ? formatFn(val) : val;

    formatted =
      formatted === void 0 || formatted === null ? "" : String(formatted);

    formatted = formatted.split('"').join('""');

    return `"${formatted}"`;
  }

  export default {
    data() {
      return {
        dateRange: {},
        new_customer: false,
        my_order: {},
        mode: "list",
        pagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        },
        isEdit: false,
        columns: [
          {
            name: "index",
            align: "left",
            label: "Index",
            field: "index"
          },
          {
            name: "name",
            align: "left",
            label: "Customer Name",
            field: "CustomerName"
          },
          {
            name: "phone",
            align: "left",
            label: "Customer Phone",
            field: "CustomerPhone"
          },
          {
            name: "total_price",
            align: "left",
            label: "Total Price (VND)",
            field: "TotalPrice"
          },
          {
            name: "created_at",
            align: "left",
            label: "Created At",
            field: "CreatedAt"
          },
          {
            name: "updated_at",
            align: "left",
            label: "Updated At",
            field: "UpdatedAt"
          },
          {
            name: "status",
            align: "left",
            label: "Status",
            field: "Status"
          },
          {
            name: "action",
            align: "left",
            label: "Action",
            field: "action"
          }
        ]
      };
    },
    components: {
      DateRangePicker
    },
    watch: {
      isSaving: function (val) {
        if (val === false) {
          this.new_customer = false
          this.onRequest({
            pagination: this.pagination
          })
        }
      }
    },
    computed: {
      ...mapState('order', ['orders', 'paging', 'isLoading', 'filter', 'order', 'isSaving']),
      statuses: function () {
        return Constants.OrderStatus
      },

    },
    mounted() {
      this.onRequest({
        pagination: this.pagination
      })
    },
    methods: {
      ...mapActions({
        loadOrders: 'order/loadOrders',
        saveOrder: 'order/saveOrder',
      }),
      index: function (id) {
        return this.orders.findIndex(x => x.Id === id) + 1;
      },
      exportTable() {
        // naive encoding to csv format
        const content = [this.columns.map(col => wrapCsvValue(col.label))]
          .concat(
            this.orders.map(row =>
              this.columns
                .map(col =>
                  wrapCsvValue(
                    typeof col.field === "function"
                      ? col.field(row)
                      : row[col.field === void 0 ? col.name : col.field],
                    col.format
                  )
                )
                .join(",")
            )
          )
          .join("\r\n");

        const fileStatus = exportFile("quotes.csv", content, "text/csv");

        if (fileStatus !== true) {
          this.$q.notify({
            message: "Browser denied file download...",
            color: "negative",
            icon: "warning"
          });
        }
      },
      onRequest(props) {
        const {page, rowsPerPage} = props.pagination
        this.pagination = this.paging
        this.loadOrders({
          filter: this.filter,
          page: page,
          size: rowsPerPage
        })
      },
      done(order) {
        httpClient.put(`/orders/${order.Id}`, {
          ...order,
          status: 2
        })
        this.onRequest({
          pagination: this.pagination
        })
      },
      cancel(order) {
        httpClient.put(`/orders/${order.Id}`, {
          ...order,
          status: 0
        })
        this.onRequest({
          pagination: this.pagination
        })
      }
    }
  };
</script>
<style>
</style>
