<template>
  <div class="well well-sm">
    <form @submit.prevent.stop="onSubmit">
      <div class="form-group">
        <label class="control-label">Your comments</label>
        <textarea v-focus v-model="content" rows="4" placeholder="Encourage, post updates, ..." class="form-control"></textarea>
        <p class="help-block">Text is in &quot;Markdown&quot; notation</p>
      </div>

      <error-alert :error="error"></error-alert>

      <div role="group" class="btn-group">
        <submit-button>Add my Comments</submit-button>
        <button @click="$emit('dismiss')" class="btn btn-default" type="button">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
  import {getFormHelperMixin} from '../../data/form.js'

  export default {
    name: 'PrayerRequestCommentForm',

    props: {
      prayerRequestId: {
        type: String,
        required: true
      }
    },

    mixins: [
      getFormHelperMixin({
        base: {
          content: ''
        },
        insertMethod: 'prayerRequestComments.add',
        insertDataModifier(data) {
          data.doc.prayerRequestId = this.prayerRequestId
        }
      })
    ]
  }
</script>

<style>
</style>