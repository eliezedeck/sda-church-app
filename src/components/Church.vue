<template>
  <div class="container">
    <div v-if="church === null">
      <h1 style="margin-top: 1rem">Loading ...</h1>
    </div>

    <div v-if="church !== null" class="row">
      <div class="col-12">
        <h1 style="margin-top: 1rem">{{church.name}}</h1>
      </div>
      <div class="col-12">
        <div role="group" class="btn-group">
          <button class="btn btn-primary" type="button"><i class="fa fa-plus"></i> Add a Department</button>
        </div>

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
import {fdb} from '../firebase/db'

export default {
  name: 'Church',

  data () {
    return {
      church: null,
      departments: []
    }
  },

  firestore () {
    return {
      church: fdb.collection('churches').doc(this.$route.params.churchId),
      departments: fdb.collection('churches').doc(this.$route.params.churchId).collection('departments').orderBy('name')
    }
  }
}
</script>

<style scoped>

</style>
