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

        <form v-if="showDepartmentForm">
          <div class="card text-light bg-dark">
            <div class="card-body">
              <h4 class="card-title">Add a department</h4>
              <div class="form-group">
                <label>Department name</label>
                <input v-model="departmentForm.name" class="form-control" type="text" autofocus autocomplete="off" />
              </div>

              <p v-if="departmentFormError" class="text-danger card-text">{{departmentFormError}}</p>

              <div class="btn-group" role="group">
                <button @click="saveDepartment()" :disabled="departmentForm.name.length < 2 || departmentFormProgressing" class="btn btn-primary" type="button">Add</button>
                <button @click="showDepartmentForm = false" class="btn btn-secondary" type="button">Cancel</button>
              </div>
            </div>
          </div>
        </form>

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
import DB from 'baqend/realtime'

export default {
  name: 'Church',

  data () {
    return {
      showDepartmentForm: false,
      departmentFormError: '',
      departmentFormProgressing: false,
      departmentForm: {
        name: ''
      },

      departments: []
    }
  },

  methods: {
    async saveDepartment () {
      try {
        const department = new DB.Department(this.departmentForm)
        department.account = new DB.Account({
          name: this.departmentForm.name,
          currentBalance: 0,
          isDepartmentAccount: true,
          department
        })

        await department.save({depth: true})

        this.departmentFormProgressing = true
      } catch (e) {
        this.departmentFormProgressing = false
      }
    }
  }
}
</script>

<style scoped>

</style>
