<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1 style="margin-top: 1rem">Welcome</h1>
      </div>
      <div class="col-12">
        <div v-if="!showDepartmentForm" role="group" class="btn-group">
          <button @click="showDepartmentForm = true" class="btn btn-primary" type="button"><i class="fa fa-plus"></i> Add a Department</button>
        </div>

        <DepartmentForm v-if="showDepartmentForm" @dismissed="showDepartmentForm = false"></DepartmentForm>

        <div class="table-responsive" style="margin-top: 1rem">
          <table class="table table-bordered table-hover">
            <thead>
            <tr>
              <th>Department name</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(department) in departments">
              <td>{{department.name}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DepartmentForm from './forms/DepartmentForm'

export default {
  name: 'Church',

  data () {
    return {
      showDepartmentForm: false,

      departments: []
    }
  },

  components: {
    DepartmentForm
  }
}
</script>

<style scoped>

</style>
