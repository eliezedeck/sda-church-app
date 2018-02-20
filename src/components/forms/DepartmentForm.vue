<template>
  <form @submit.prevent.stop="saveDepartment()">
    <div class="card text-light bg-dark">
      <div class="card-body">
        <h4 v-if="department" class="card-title">Edit a department</h4>
        <h4 v-else class="card-title">Add a department</h4>

        <div class="form-group">
          <label>Department name</label>
          <input v-model.trim="departmentForm.name" class="form-control" type="text" autofocus autocomplete="off" />
        </div>

        <p v-if="departmentFormError" class="text-danger card-text">{{departmentFormError}}</p>

        <div class="btn-group" role="group">
          <button :disabled="departmentForm.name.length < 2 || departmentFormProgressing" class="btn btn-primary" type="submit">Save</button>
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

  props: ['department'],

  data () {
    const data = {
      departmentFormError: '',
      departmentFormProgressing: false,
      departmentForm: {
        name: ''
      }
    }

    if (this.department) {
      data.departmentForm.name = this.department.name
    }

    return data
  },

  methods: {
    async saveDepartment () {
      try {
        this.departmentFormError = ''
        this.departmentFormProgressing = true

        if (this.department) {
          // Do an update
          this.$gun.get(`department/${this.department.id}`).put({name: this.departmentForm.name})
          this.$emit('dismissed')
          return
        }

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
      } catch (e) {
        this.departmentFormError = e.message
      } finally {
        this.departmentFormProgressing = false
      }
    }
  }
}
</script>
