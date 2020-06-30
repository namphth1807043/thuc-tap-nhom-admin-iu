<template>
  <q-page class="q-pa-sm">
    <q-table
      title="Employee Salary List"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="name"
      :grid="mode=='grid'"
      :filter="filter"
      :pagination.sync="pagination"
    >
      <template v-slot:top-right="props">
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
          v-if="!props.inFullscreen"
        >
          <q-tooltip
            :disable="$q.platform.is.mobile"
            v-close-popup
          >{{mode==='grid' ? 'List' : 'Grid'}}</q-tooltip>
        </q-btn>

        <q-btn @click="new_customer=true"
               color="green"
               icon="add"
               dense
               class="q-mr-sm"/>

        <q-btn
          color="primary"
          icon-right="archive"
          no-caps
          dense
          @click="exportTable"
        />
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn @click="employee_dialog=true"
                   dense
                   color="secondary"
                   icon="pageview" />
            <q-btn dense color="primary" icon="edit" />
            <q-btn dense color="red" icon="delete" />
          </div>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="employee_dialog">
      <q-card class="my-card" flat bordered>
          <q-card-section>
            <div class="text-h6">
              Employee Details
              <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
            </div>
          </q-card-section>
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-overline">US Region</div>
              <div class="text-h5 q-mt-sm q-mb-xs">Mayank Patel</div>
              <div class="text-caption text-grey">
                Sales and Marketing Executive | Graduate and past committee | Keynote speaker on Selling and Recruiting
                Topics
              </div>
            </q-card-section>

            <q-card-section class="col-5 flex flex-center">
              <q-img
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/boy-avatar.png"
              />
            </q-card-section>
          </q-card-section>

          <q-separator/>

          <q-card-section>
            Assessing clients needs and present suitable promoted products. Liaising with and persuading targeted doctors to prescribe our products utilizing effective sales skills.
          </q-card-section>
        </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { exportFile } from "quasar";

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
      filter: "",
      mode: "list",
      invoice: {},
      employee_dialog: false,
      columns: [
        {
          name: "index",
          align: "left",
          label: "Index",
          field: "index"
        },
        {
          name: "id",
          required: true,
          label: "Product Id",
          align: "left",
          field: "Id"
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
          label: "Price",
          field: "Price"
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
      ],
      data: [
        {
          index: "01",
          Id: "P001",
          Name: "Gói thể hình 1 tháng",
          Price: "1000000",
          CreatedAt: "30/06/2020",
          UpdatedAt: "30/06/2020",
          Status: 1
        },
        {
          index: "01",
          Id: "P001",
          Name: "Gói thể hình 1 tháng",
          Price: "1000000",
          CreatedAt: "30/06/2020",
          UpdatedAt: "30/06/2020",
          Status: 1
        },
        {
          index: "01",
          Id: "P001",
          Name: "Gói thể hình 1 tháng",
          Price: "1000000",
          CreatedAt: "30/06/2020",
          UpdatedAt: "30/06/2020",
          Status: 1
        },
        {
          index: "01",
          Id: "P001",
          Name: "Gói thể hình 1 tháng",
          Price: "1000000",
          CreatedAt: "30/06/2020",
          UpdatedAt: "30/06/2020",
          Status: 1
        }
      ],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  methods: {
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
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

      const status = exportFile("employee_salary_list.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>
<style>
.q-chip__content {
  display: block;
  text-align: center;
}
</style>
