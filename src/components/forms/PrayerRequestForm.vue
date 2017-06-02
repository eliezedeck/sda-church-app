<template>
  <div class="well well-sm">
    <form @submit.prevent.stop="doSubmit">
      <div class="form-group">
        <label class="control-label" for="content">Your prayer request</label>
        <textarea
            v-model="content"
            id="content"
            rows="6" class="form-control"></textarea>
        <p class="help-block">Text is in &quot;Markdown&quot; notation:</p>
      </div>
      <div class="checkbox">
        <label>
          <input
              v-model="anonymous"
              type="checkbox" />Do not display my name (<em>anonymous</em>, editing will be impossible)</label>
      </div>
      <div role="group" class="btn-group">
        <button v-if="prayer" class="btn btn-primary" type="submit">Update my Prayer Request</button>
        <button v-else="" class="btn btn-primary" type="submit">Add my Prayer Request</button>
        <button
            @click="$emit('dismiss')"
            class="btn btn-default" type="button">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
  import _ from 'lodash'
  import firebase from 'firebase'
  import FApp from '../../stores/firebase.js'
  import {SAuth} from '../../stores/auth.js'

  export default {
    name: 'PrayerRequestForm',

    props: {
      prayer: {
        type: Object
      }
    },

    data() {
      let state = {
        content: '',
        anonymous: false
      }

      if (this.prayer) {
        state = _.assign(state, this.prayer)
      }

      return state
    },

    methods: {
      doSubmit() {
        // Prepare the prayer
        let prayer = {
          content: this.content,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        }
        if (!this.anonymous)
          prayer.poster = SAuth.state.user.uid

        if (this.prayer) {
          // Editing
          delete prayer.$id
          delete prayer.contentMarked
          delete prayer.createdAt

          FApp.database().ref(`/prayers/${this.prayer.$id}`).update(prayer)
        } else {
          // New
          FApp.database().ref('/prayers').push(prayer)
        }

        this.$emit('dismiss')
      }
    }
  }
</script>

<style>
</style>