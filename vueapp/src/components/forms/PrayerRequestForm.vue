<template>
  <div class="well well-sm">
    <form @submit.prevent.stop="onSubmit">
      <div class="form-group">
        <label class="control-label">Your prayer request</label>
        <textarea v-model="content" rows="6" class="form-control input"></textarea>
        <p class="help-block">Text is in &quot;Markdown&quot; notation</p>
      </div>
      <div class="checkbox">
        <label>
          <input v-model="anonymous" type="checkbox" />Do not display my name (anonymous)</label>
      </div>

      <error-alert :error="error"></error-alert>

      <div role="group" class="btn-group">
        <submit-button
            :disabled="content.length < 4 || content.length > 4096"
            :inProgress="inProgress"
        >
          Post my Prayer Request
        </submit-button>
        <button @click="$emit('dismiss')" class="btn btn-default" type="button">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
  import {getFormHelperMixin} from '../../data/form'


  export default {
    name: 'PrayerRequestForm',

    mixins: [
      getFormHelperMixin({
        base: {
          content: '',
          anonymous: false
        },
        overwritePropsKey: 'editObj',
        insertMethod: 'prayerRequests.add',
        updateMethod: 'prayerRequests.update'
      })
    ]
  }
</script>

<style>
</style>