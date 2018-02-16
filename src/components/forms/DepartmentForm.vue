<template>
  <form>
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
          <button @click="$emit('dismissed')" class="btn btn-secondary" type="button">Cancel</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import DB from 'baqend/realtime'

export default {
  name: 'DepartmentForm',

  data () {
    return {
      departmentFormError: '',
      departmentFormProgressing: false,
      departmentForm: {
        name: ''
      }
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
        this.$emit('dismissed')

        this.departmentFormProgressing = true
      } catch (e) {
        this.departmentFormProgressing = false
      }
    }
  }
}
</script>
