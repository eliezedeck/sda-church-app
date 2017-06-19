<template>
  <div class="well well-sm">
    <form @submit.prevent.stop="onSubmit">
      <div class="form-group">
        <label class="control-label">Your comments</label>
        <textarea
            v-model="content"
            placeholder="Testimonies, encouragement, information, etc..." rows="4" class="form-control"></textarea>
        <p class="help-block">Text is in &quot;Markdown&quot; notation:</p>
      </div>
      <div role="group" class="btn-group">
        <button class="btn btn-primary" type="submit">Add my Comments</button>
        <button
            @click="$emit('dismiss')"
            class="btn btn-default" type="button">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
  import FApp, {firebase} from '../../stores/firebase.js'
  import {SAuth} from '../../stores/auth.js'

  export default {
    name: 'PrayerRequestCommentsForm',

    props: {
      prayer: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        content: ''
      }
    },

    methods: {
      onSubmit() {
        FApp.database().ref(`/prayerComments/${this.prayer.$id}`).push({
          content: this.content,
          createdBy: SAuth.state.user.uid,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        })

        this.$emit('dismiss')
      }
    }
  }
</script>

<style>
</style>