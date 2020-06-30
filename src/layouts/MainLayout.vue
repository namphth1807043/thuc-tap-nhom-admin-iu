<template>
  <q-layout view="lHh LpR lFf">
    <q-header reveal elevated style="background: linear-gradient(145deg, rgb(74, 94, 137) 15%, rgb(30, 75, 131) 70%);">
      <q-toolbar>
        <q-btn @click="left = !left" flat round dense icon="menu" class="q-mr-sm"/>
        <!--          <q-avatar>-->
        <!--            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">-->
        <!--          </q-avatar>-->

        <q-toolbar-title>Undefined Admin</q-toolbar-title>
        <q-btn flat round dense icon="fas fa-sign-out-alt" to="/"/>
      </q-toolbar>
    </q-header>
    <q-drawer class="left-navigation text-white"
              show-if-above v-model="left"
              style="background-image: url(https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg) !important;"
              side="left"
              elevated>
      <div style="height: calc(100% - 117px);padding:10px">
        <q-toolbar>
          <q-toolbar-title>Hoài Nam</q-toolbar-title>
        </q-toolbar>
        <hr/>
        <q-scroll-area style="height:100%;">
          <q-list padding>
            <q-item active-class="tab-active" to="/dashboard" exact class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="dashboard"/>
              </q-item-section>

              <q-item-section>
                Dashboard
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/categories" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="list"/>
              </q-item-section>

              <q-item-section>
                Categories
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/products" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="redeem"/>
              </q-item-section>

              <q-item-section>
                Products
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/orders" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="receipt"/>
              </q-item-section>

              <q-item-section>
                Order
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/news" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="chat"/>
              </q-item-section>

              <q-item-section>
                News
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/coaches" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="sports"/>
              </q-item-section>

              <q-item-section>
                Coaches
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/coaches" class="q-ma-sm navigation-item" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="supervisor_account"/>
              </q-item-section>

              <q-item-section>
                Customer
              </q-item-section>
            </q-item>

            <q-item active-class="tab-active" to="/employee_salary_list" class="q-ma-sm navigation-item" clickable
                    v-ripple>
              <q-item-section avatar>
                <q-icon name="account_box"/>
              </q-item-section>

              <q-item-section>
                Admin
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col">
          <div class="full-height">
            <q-scroll-area class="col q-pr-sm full-height" visible>
              <router-view/>
            </q-scroll-area>
          </div>
        </div>
      </q-page>
    </q-page-container>


  </q-layout>
</template>

<script>
    export default {
        data() {
            return {
                left: false
            }
        }
    }
</script>

<style>
  .q-drawer {
    /*background-image: url(https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg) !important;*/
    background-image: url('/statics/images/lake.jpg') !important;
    background-size: cover !important;
  }

  .q-drawer__content {
    background-color: rgba(1, 1, 1, 0.75);
  }

  .navigation-item {
    border-radius: 5px;
  }

  .tab-active {
    background-color: green;
  }

  body {
    background: #f1f1f1 !important;
  }
</style>
