<template>
  <form @submit.prevent.stop="saveAccount()">
    <div class="card text-light bg-dark">
      <div class="card-body">
        <h4 class="card-title">Add an account</h4>
        <div class="form-group">
          <label>Account name</label>
          <input v-model="form.name" type="text" autofocus autocomplete="off" class="form-control" />
        </div>
        <div class="form-check">
          <input v-model="form.isDepartmentAccount" :true-value="false" :false-value="true" disabled type="checkbox" class="form-check-input" id="formCheck-1" />
          <label for="formCheck-1" class="form-check-label">Account is not linked to a department</label>
        </div>
        <div role="group" class="btn-group" style="margin-top: 1rem">
          <button class="btn btn-primary" type="submit">Save</button>
          <button @click="$emit('dismissed')" class="btn btn-secondary" type="button">Cancel</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'AccountForm',

  data () {
    return {
      form: {
        name: '',
        isDepartmentAccount: false
      }
    }
  },

  methods: {
    saveAccount () {
      this.$emit('dismissed')
    }
  }
}
</script>

<style scoped>

</style>
