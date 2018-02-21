<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1 style="margin-top: 1rem">Welcome</h1>
      </div>

      <div v-if="$route.name === 'Church'" class="col-6">
        <div v-if="!showDepartmentForm" role="group" class="btn-group">
          <button @click="showDepartmentForm = true" class="btn btn-primary" type="button"><i class="fa fa-plus"></i> Add a Department</button>
        </div>

        <DepartmentForm v-if="showDepartmentForm" @dismissed="showDepartmentForm = false"></DepartmentForm>

        <div class="table-responsive" style="margin-top: 1rem">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>Department name ({{departmentsCount}})</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(department) in departments" :key="department.id">
              <td @click="$router.push({name: 'Department', params: {departmentId: department.id}})">{{department.name}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="$route.name === 'Church'" class="col-6">
        <AccountForm v-if="showAccountForm" @dismissed="showAccountForm = false"></AccountForm>
        <div v-else role="group" class="btn-group">
          <button @click="showAccountForm = true" class="btn btn-primary" type="button"><i class="fa fa-plus"></i> Add an <em>Unlinked</em> account</button>
        </div>

        <div class="table-responsive" style="margin-top: 1rem">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>Account name ({{$store.state.gunAccounts.setCount}})</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(account) in $store.state.gunAccounts.set" :key="account.id">
              <td>{{account.name}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <router-view v-if="$route.name === 'Department' && departments !== {}" :department="departments[`department/${$route.params.departmentId}`]"></router-view>
  </div>
</template>

<script>
import DepartmentForm from './forms/DepartmentForm'
import AccountForm from './forms/AccountForm'

export default {
  name: 'Church',

  data () {
    return {
      showDepartmentForm: false,
      showAccountForm: false
    }
  },

  gun: {
    open: {
      'departments': 'departments'
    }
  },

  computed: {
    departmentsCount () {
      return Object.keys(this.departments).length
    }
  },

  components: {
    DepartmentForm,
    AccountForm
  }
}
</script>

<style scoped>

</style>
