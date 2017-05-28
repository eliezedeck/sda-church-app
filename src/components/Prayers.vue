<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Prayers ({{prayers.length}})</h1>
      </div>
      <div class="col-md-5">
        <div v-if="!showPrayerRequestForm" role="group" class="btn-group" style="margin-bottom: 1em">
          <button
              @click="showPrayerRequestForm = true"
              class="btn btn-primary" type="button"><i class="glyphicon glyphicon-plus"></i> Prayer Request</button>
          <button class="btn btn-danger" type="button"><i class="glyphicon glyphicon-remove"></i> Remove </button>
        </div>

        <prayer-request-form v-else=""
            @dismiss="showPrayerRequestForm = false"></prayer-request-form>
        <prayers-list :prayers="prayers"></prayers-list>
      </div>
      <div class="col-md-7">
        <h4>Request by ... - <small>Text</small></h4>
        <p>Details and Contents of the request</p>
        <hr />
        <p class="help-block" style="margin-top: 0">Do you think that this is not a Prayer request or it contains inappropriate contents? Help use to moderate the content of this Website by <a href="#"><i class="glyphicon glyphicon-flag"></i> flagging</a> this request.</p>
        <div role="group"
             class="btn-group" style="margin-bottom: 1em">
          <button class="btn btn-primary" type="button"><i class="glyphicon glyphicon-plus"></i> Comments </button>
          <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-plus"></i> Testimony </button>
          <button class="btn btn-success" type="button"><i class="glyphicon glyphicon-ok"></i> God has answered this Prayer !</button>
        </div>
        <div class="well well-sm">
          <form>
            <div class="form-group">
              <label class="control-label">Your testimony</label>
              <textarea rows="6" class="form-control input-lg"></textarea>
              <p class="help-block">Text is in &quot;Markdown&quot; notation:</p>
            </div>
            <div class="checkbox">
              <label>
                <input type="checkbox" />Make this Testimony also visible in the Testimonies page</label>
            </div>
            <div role="group" class="btn-group">
              <button class="btn btn-primary" type="button">Add my Testimony</button>
              <button class="btn btn-default" type="button">Cancel </button>
            </div>
          </form>
        </div>
        <div class="well well-sm">
          <form>
            <div class="form-group">
              <label class="control-label">Your comments</label>
              <textarea placeholder="Encourage, give information, ..." rows="4" class="form-control"></textarea>
              <p class="help-block">Text is in &quot;Markdown&quot; notation:</p>
            </div>
            <div role="group" class="btn-group">
              <button class="btn btn-primary" type="button">Add my Comments</button>
              <button class="btn btn-default" type="button">Cancel </button>
            </div>
          </form>
        </div>
        <p>I would like to <a href="#">Pray</a> for this request. Thank you for supporting Tiana by praying for his request.</p>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import PrayerRequestForm from './forms/PrayerRequestForm.vue'
  import PrayersList from './lists/PrayersList.vue'
  import {SPrayers} from '../stores/prayers.js'

  export default {
    name: 'Prayers',

    data() {
      return {
        _,
        showPrayerRequestForm: false,
      }
    },

    beforeCreate() {
      SPrayers.fdi()
    },

    computed: {
      prayers() {
        return SPrayers.state.prayers
      }
    },

    components: {
      PrayerRequestForm,
      PrayersList
    }
  }
</script>

<style scoped>
  div.container {
    padding-bottom: 1em;
  }
</style>