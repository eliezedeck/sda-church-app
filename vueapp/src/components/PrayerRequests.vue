<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h3>Prayer requests</h3>
      </div>
      <div class="col-md-7">
        <div v-if="!showPrayerForm" role="group" class="btn-group" style="margin-bottom: 1em">
          <button @click="showPrayerForm = true, $router.push('/prayer-requests')" class="btn btn-primary" type="button"><i class="glyphicon glyphicon-plus"></i> Prayer Request</button>
        </div>
        <PrayerRequestForm v-if="showPrayerForm" @dismiss="showPrayerForm = false" :editObj="selectedPrayerRequestObj"></PrayerRequestForm>

        <template v-if="selectedPrayerRequestObj && !showPrayerForm">
          <h4 style="margin-top: 0">
            <span v-if="selectedPrayerRequestOwnedByCurrentUser">A request by <strong>You</strong></span>
            <span v-if="!selectedPrayerRequestObj.anonymous && !selectedPrayerRequestOwnedByCurrentUser">A request by ...</span>
            <span v-if="selectedPrayerRequestObj.anonymous">Anonymous prayer request</span>
          </h4>
          <div v-html="marked(selectedPrayerRequestObj.content)"></div>
          
          <div v-if="selectedPrayerRequestOwnedByCurrentUser || auth.isChurchClerk || auth.isZedeck" role="group" class="btn-group" style="margin-top: 1em">
            <button v-if="selectedPrayerRequestOwnedByCurrentUser" @click="showPrayerForm = true" class="btn btn-warning btn-xs" type="button">
              <i class="glyphicon glyphicon-pencil"></i> Edit</button>
            <button v-if="selectedPrayerRequestOwnedByCurrentUser || auth.isChurchClerk || auth.isZedeck" @click="onDeletePrayerRequest(selectedPrayerRequestObj._id)" class="btn btn-danger btn-xs" type="button">
              <i class="glyphicon glyphicon-remove"></i> Remove</button>
          </div>

          <hr style="margin-bottom: 1em" />

          <p v-if="!selectedPrayerRequestOwnedByCurrentUser" class="help-block" style="margin-top: 0">Do you think that this is not a Prayer request or it contains inappropriate contents? Help use to moderate the content of this Website by <a href="#"><i class="glyphicon glyphicon-flag"></i> flagging</a> this request.</p>
          <div role="group" class="btn-group" style="margin-bottom: 1em">
            <button class="btn btn-primary" type="button"><i class="glyphicon glyphicon-plus"></i> Comments</button>
            <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-plus"></i> Testimony</button>
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

    beforeDestroy() {
      if (this._incrementViewTimer)
        clearTimeout(this._incrementViewTimer)
    },

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
        const selectedId = this.$route.params['selectedId']
        if (selectedId) {
          if (this._previouslySelectedId !== selectedId) {
            // Selection has changed
            this._previouslySelectedId = selectedId

            // Clear the previous timer
            if (this._incrementViewTimer)
              clearTimeout(this._incrementViewTimer)

            // Start a new timer
            this._incrementViewTimer = setTimeout(() => {
              // Increment the views for the selected prayer request
              Meteor.call('prayerRequests.incrementViews', {id: selectedId}, (err) => {
                if (err) {
                  console.error(`There was a problem incrementing the views for the prayer request ${selectedId}: ${err.message}`)
                } else {
                  console.log(`Incremented the views count for prayer request ${selectedId}`)
                }
              })
            }, 15000)
          }
        }
        else {
          this._previouslySelectedId = null
          if (this._incrementViewTimer) {
            clearTimeout(this._incrementViewTimer)
            this._incrementViewTimer = null
          }
        }

        return selectedId
      },

      selectedPrayerRequestOwnedByCurrentUser() {
        return !!this.selectedPrayerRequestObj && this.selectedPrayerRequestObj.createdBy === this.auth.userId
      }
    },

    methods: {
      onPrayerRequestSelected(request) {
        this.showPrayerForm = false
        if (request)
          this.$router.push(`/prayer-requests/${request._id}`)
        else
          this.$router.push(`/prayer-requests`)
      },

      onDeletePrayerRequest(id) {
        this.$router.replace(`/prayer-requests`)
        Meteor.call('prayerRequests.delete', {id}, (err) => {
          if (err) {
            window.alert(err.message)
          }
        })
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