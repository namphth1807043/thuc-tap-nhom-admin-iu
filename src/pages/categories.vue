<template>
  <q-page class="q-pa-sm">
    <q-table
      title="Stations"
      :data="stations"
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
        <q-item>
          <date-range-picker
            ref="picker"
            :showWeekNumbers="true"
            :showDropdowns="true"
            :autoApply="false"
            v-model="dateRange"
          >
            <template v-slot:input="picker" style="min-width: 350px;">
              {{ picker.startDate }} - {{ picker.endDate }}
            </template>
          </date-range-picker>
        </q-item>

        <q-input
                 dense
                 debounce="300"
                 v-model="filter.name"
                 placeholder="Name">
        </q-input>

        <q-btn
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
          dense
          @click="exportTable"
        />
      </template>
      <template v-slot:body-cell-index="props">
        <q-td :props="props">
          {{ index(props.row.Id) }}
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="(props.row.Status === 1)?'green':'red'"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
          >{{props.row.Status | filterStatus}}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn dense color="primary" icon="edit"/>
            <q-btn dense color="red" icon="delete"/>
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
  import DateRangePicker from 'vue2-daterange-picker'
  import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

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
        mode: "list",
        pagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        },
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
            label: "Name",
            field: "Name"
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
    watch: {},
    computed: {
      ...mapState('station', ['stations', 'paging', 'isLoading', 'filter']),
    },
    mounted() {
      this.onRequest({
        pagination: this.pagination
      })
    },
    methods: {
      ...mapActions({
        loadStations: 'station/loadStations'
      }),
      index: function (id) {
        return this.stations.findIndex(x => x.Id === id) + 1;
      },
      exportTable() {
        // naive encoding to csv format
        const content = [this.columns.map(col => wrapCsvValue(col.label))]
          .concat(
            this.stations.map(row =>
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
        this.loadStations({
          filter: this.filter,
          page: page,
          size: rowsPerPage
        })
      }
    }
  };
</script>
<style>
</style>
