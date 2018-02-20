<template>
  <form @submit.prevent.stop="saveDepartment()">
    <div class="card text-light bg-dark">
      <div class="card-body">
        <h4 class="card-title">Add a department</h4>
        <div class="form-group">
          <label>Department name</label>
          <input v-model="departmentForm.name" class="form-control" type="text" autofocus autocomplete="off" />
        </div>

        <p v-if="departmentFormError" class="text-danger card-text">{{departmentFormError}}</p>

        <div class="btn-group" role="group">
          <button :disabled="departmentForm.name.length < 2 || departmentFormProgressing" class="btn btn-primary" type="submit">Add</button>
          <button @click="$emit('dismissed')" class="btn btn-secondary" type="button">Cancel</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import uuidv4 from 'uuid/v4'

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
        this.departmentFormError = ''

        const department = {
          id: uuidv4(),
          ...this.departmentForm
          // account: linked to `account` below
        }

        const account = {
          id: uuidv4(),
          name: this.departmentForm.name,
          currentBalance: 0,
          isDepartmentAccount: true
          // department: linked to `department`
        }

        const d = this.$gun.get(`department/${department.id}`).put(department)
        const a = this.$gun.get(`account/${account.id}`).put(account)

        // Link
        this.$gun.get('department').get(department.id).get('account').put(a)
        this.$gun.get('account').get(account.id).get('department').put(d)
        // List
        this.$gun.get('departments').set(d)
        this.$gun.get('accounts').set(a)

        this.$emit('dismissed')

        this.departmentFormProgressing = true
      } catch (e) {
        this.departmentFormProgressing = false
        this.departmentFormError = e.message
      }
    }
  }
}
</script>
