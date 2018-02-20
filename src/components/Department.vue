<template>
  <div class="row">
    <div class="col-12">
      <h2 class="text-center"><strong>{{department.name}}</strong> department</h2>
      <div class="text-right">
        <div v-if="!showDepartmentForm" role="group" class="btn-group">
          <button @click="showDepartmentForm = true" class="btn btn-warning" type="button"><i class="fa fa-pencil"></i> Rename this Department</button>
        </div>
      </div>

      <DepartmentForm v-if="showDepartmentForm" @dismissed="showDepartmentForm = false" :department="department"></DepartmentForm>
    </div>
  </div>
</template>

<script>
import DepartmentForm from './forms/DepartmentForm'

export default {
  name: 'Department',

  props: ['department'],

  data () {
    return {
      showDepartmentForm: false
    }
  },

  components: {
    DepartmentForm
  }
}
</script>

<style>
</style>
