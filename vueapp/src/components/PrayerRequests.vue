<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h3>Prayer requests</h3></div>
      <div class="col-md-7">
        <div role="group" class="btn-group" style="margin-bottom: 1em">
          <button @click="showPrayerForm = true" class="btn btn-primary" type="button"><i class="glyphicon glyphicon-plus"></i> Prayer Request</button>
          <button class="btn btn-danger" type="button"><i class="glyphicon glyphicon-remove"></i> Remove</button>
        </div>
        <PrayerRequestForm v-if="showPrayerForm" @dismiss="showPrayerForm = false"></PrayerRequestForm>

        <template v-if="selectedPrayerRequestObj">
          <h4>
            <button class="btn btn-warning btn-xs" type="button"><i class="glyphicon glyphicon-pencil"></i> Edit</button> &mdash; Request by ...</h4>
          <div v-html="marked(selectedPrayerRequestObj.content)"></div>

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
                <p class="help-block">Text is in &quot;Markdown&quot; notation</p>
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
                <textarea rows="4" placeholder="Encourage, give information, ..." class="form-control"></textarea>
                <p class="help-block">Text is in &quot;Markdown&quot; notation</p>
              </div>
              <div role="group" class="btn-group">
                <button class="btn btn-primary" type="button">Add my Comments</button>
                <button class="btn btn-default" type="button">Cancel </button>
              </div>
            </form>
          </div>
          <p>I would like to <a href="#">Pray</a> for this request. Thank you for supporting Tiana by praying for his request.</p>
          <div class="table-responsive">
            <table class="table table-striped">
              <tbody>
              <tr>
                <td> <a href="#">Delete this comment</a></td>
                <td>Cell 2</td>
              </tr>
              <tr>
                <td>By sdfjklm</td>
                <td>Cell 4</td>
              </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
      <div class="col-md-5">
        <PrayerRequestsList
            :ready="$subReady['prayerRequests.recent']"
            :list="prayerRequests"
            @selected="onPrayerRequestSelected"
            :selectedId="selectedPrayerRequestId" />
      </div>
    </div>
  </div>
</template>

<script>
  import PrayerRequestForm from './forms/PrayerRequestForm.vue'
  import PrayerRequestsCollection from 'server/collections/prayerRequests'

  import List from './lists/PrayerRequestsList.vue'
  import {MarkedMixin} from '../data/marked.js'

  export default {
    name: 'PrayerRequests',

    mixins: [MarkedMixin],

    data() {
      return {
        showPrayerForm: false
      }
    },

    meteor: {
      $subscribe: {
        'prayerRequests.recent': []
      },

      prayerRequests() {
        // Inherit the sorting order by the server
        return PrayerRequestsCollection.find()
      },

      selectedPrayerRequestObj: {
        params() {
          return {id: this.$route.params['selectedId']}
        },

        update({id}) {
          return PrayerRequestsCollection.findOne(id)
        }
      }
    },

    computed: {
      selectedPrayerRequestId() {
        return this.$route.params['selectedId']
      }
    },

    methods: {
      onPrayerRequestSelected(request) {
        if (request)
          this.$router.push(`/prayer-requests/${request._id}`)
        else
          this.$router.push(`/prayer-requests`)
      }
    },

    components: {
      PrayerRequestForm,
      'PrayerRequestsList': List
    }
  }
</script>

<style>
  h3 {
    margin-top: .5em;
  }
</style>