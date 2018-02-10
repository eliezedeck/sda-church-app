<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center" style="margin-top: 1rem">Choose your church</h1>
        <p>If your church is not listed here, click the button bellow to add it.</p>
      </div>
      <div class="col-12">
        <form v-if="showChurchForm" @submit.prevent.stop="addChurch()">
          <div class="card text-light bg-dark">
            <div class="card-body">
              <h4 class="card-title">Add a church</h4>
              <div class="form-group">
                <label>Church name</label>
                <input v-model="form.name" type="text" autofocus autocomplete="off" class="form-control" />
              </div>

              <p v-if="formError" class="text-danger">{{formError}}</p>

              <div role="group" class="btn-group">
                <button :disabled="formInProgress" class="btn btn-primary" type="submit">Add</button>
                <button @click="showChurchForm = false" class="btn btn-secondary" type="button">Cancel</button>
              </div>
            </div>
          </div>
        </form>
        <div v-if="!showChurchForm" role="group" class="btn-group">
          <button @click="showChurchForm = true" class="btn btn-primary" type="button"> <i class="fa fa-plus"></i> Add your Church</button>
        </div>
        <table class="table table-hover table-responsive" style="margin-top: 1rem">
          <tbody>
          <tr>
            <td>Cell 2</td>
          </tr>
          <tr>
            <td>Cell 3</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {fdb} from '../firebase/db'

export default {
  name: 'hello',

  data () {
    return {
      form: {
        name: ''
      },

      formError: '',
      formInProgress: false,
      showChurchForm: false
    }
  },

  methods: {
    async addChurch () {
      try {
        this.formInProgress = true
        await fdb.collection('churches').add(this.form)

        // Reset the page
        this.formError = ''
        this.showChurchForm = false
        this.form = {
          name: ''
        }
      } catch (e) {
        this.formError = 'Could not add your church: ' + e.message
      } finally {
        this.formInProgress = false
      }
    }
  }
}
</script>

<style>
</style>
