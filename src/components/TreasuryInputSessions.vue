<template>
  <div class="row">
    <div class="col-12">
      <h3>Input sessions</h3>

      <div class="row">
        <div class="col">
          <div v-if="!showSessionForm" role="group" class="btn-group">
            <button @click="showSessionForm = true" class="btn btn-primary" type="button"><i class="fa fa-plus"></i> New session</button>
          </div>
          <TreasuryInputSessionForm v-if="showSessionForm" @dismissed="showSessionForm = false"></TreasuryInputSessionForm>
        </div>
      </div>

      <div class="row" style="margin-top: 1rem">
        <div class="col">
          <div class="table-responsive">
            <table class="table">
              <thead>
              <tr>
                <th>Session name</th>
                <th>Total inputted</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
                <td>Cell 2</td>
                <td>Closed</td>
              </tr>
              <tr>
                <td>Cell 3</td>
                <td>Cell 2</td>
                <td>Cell 4</td>
                <td>Open</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreasuryInputSessionForm from './forms/TreasuryInputSessionForm'

export default {
  name: 'TreasuryInputSessions',

  data () {
    return {
      showSessionForm: false
    }
  },

  components: {
    TreasuryInputSessionForm
  }
}
</script>
