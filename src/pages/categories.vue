<template>
  <q-page class="q-pa-sm">
    <q-table
      title="Categories"
      :data="categories"
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
        <!--        <q-item>-->
        <!--          <date-range-picker-->
        <!--            ref="picker"-->
        <!--            :showWeekNumbers="true"-->
        <!--            :showDropdowns="true"-->
        <!--            :autoApply="false"-->
        <!--            v-model="dateRange"-->
        <!--          >-->
        <!--            <template v-slot:input="picker" style="min-width: 350px;">-->
        <!--              {{ picker.startDate }} - {{ picker.endDate }}-->
        <!--            </template>-->
        <!--          </date-range-picker>-->
        <!--        </q-item>-->

        <q-btn @click="new_customer=true"
               color="primary"
               outline
               label="Add New"
               class="q-mr-md"/>

        <q-input outlined
                 dense
                 v-model="filter.name"
                 label="Name">
        </q-input>

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
          {{ props.row.Name }}
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
            <q-btn dense color="primary" icon="edit" @click="editCategory(props.row)"/>
            <q-btn dense color="red" icon="delete"/>
          </div>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="new_customer">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <div class="text-h6" v-if="isEdit === false">
            Add new category
            <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </div>
          <div class="text-h6" v-else>
            Edit category
            <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Category Name</q-item-label>
                  <q-input dense outlined v-model="my_category.name" label="Category Name" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Save"
                 type="submit"
                 color="primary"
                 @click="doSaveCategory()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
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
        my_category: {},
        mode: "list",
        pagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        },
        isEdit:false,
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
    watch: {
      isSaving: function (val) {
          if (val === false){
            this.new_customer = false
            this.onRequest({
              pagination: this.pagination
            })
          }
      }
    },
    computed: {
      ...mapState('category', ['categories', 'paging', 'isLoading', 'filter', 'category', 'isSaving']),
      statuses: function () {
        return Constants.Status
      },

    },
    mounted() {
      this.onRequest({
        pagination: this.pagination
      })
    },
    methods: {
      ...mapActions({
        loadCategories: 'category/loadCategories',
        saveCategory: 'category/saveCategory',
      }),
      index: function (id) {
        return this.categories.findIndex(x => x.Id === id) + 1;
      },
      exportTable() {
        // naive encoding to csv format
        const content = [this.columns.map(col => wrapCsvValue(col.label))]
          .concat(
            this.categories.map(row =>
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
        this.loadCategories({
          filter: this.filter,
          page: page,
          size: rowsPerPage
        })
      },
      doSaveCategory() {
        this.saveCategory({category : this.my_category})
      },
      editCategory(category){
        this.my_category = category;
        this.isEdit = true
        this.new_customer = true
        // this.saveCategory({category : this.my_category})
      }
    }
  };
</script>
<style>
</style>
