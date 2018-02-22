<template>
  <form @submit.prevent.stop="saveInputSession()">
    <div class="card text-light bg-dark">
      <div class="card-body">
        <h4 class="card-title">Start a New session</h4>

        <div class="row">
          <div class="col">
            <div class="form-group">
              <label>Session name</label>
              <input v-model="form.name" type="text" autofocus autocomplete="off" class="form-control" />
            </div>
            <div class="form-group">
              <label>Notes</label>
              <textarea v-model="form.notes" class="form-control"></textarea>
            </div>
          </div>

          <div class="col">
            <div class="form-group">
              <label>Date of the inputs</label>
              <DateTimePicker v-model="form.date" mode="inline" snap-to="day"></DateTimePicker>
            </div>
          </div>
        </div>

        <div role="group" class="btn-group">
          <button class="btn btn-primary" type="submit">Save</button>
          <button @click="$emit('dismissed')" class="btn btn-secondary" type="button">Cancel</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import moment from 'moment'
import uuidv4 from 'uuid/v4'
import DateTimePicker from './widgets/DateTimePicker'

export default {
  name: 'TreasuryInputSessionForm',

  data () {
    return {
      form: {
        name: '',
        date: new Date(),
        notes: '',
        isOpen: true
      }
    }
  },

  methods: {
    saveInputSession () {
      const session = {
        id: uuidv4(),
        ...this.form
      }
      session.date = moment(session.date).utc().valueOf() // GUN hack

      const s = this.$gun.get(`treasuryInputSession/${session.id}`).put(session)
      this.$gun.get('treasuryInputSessions').set(s)

      this.$emit('dismissed')
    }
  },

  components: {
    DateTimePicker
  }
}
</script>

