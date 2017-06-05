<template>
  <div v-if="user" class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Prayer Requests ({{prayersCount}})</h1>
      </div>
      <div class="col-md-5">
        <div v-if="!showPrayerRequestForm" role="group" class="btn-group" style="margin-bottom: 1em">
          <button
              @click="$router.push('/prayers'); showPrayerRequestForm = true"
              class="btn btn-primary" type="button"><i class="glyphicon glyphicon-plus"></i> Prayer Request</button>
          <button
              v-if="selectedPrayerBelongsToUser"
              @click="onDeleteSelectedPrayer"
              class="btn btn-danger" type="button"><i class="glyphicon glyphicon-remove"></i> Remove</button>
        </div>

        <prayer-request-form v-else=""
            :prayer="selectedPrayer"
            @dismiss="showPrayerRequestForm = false"></prayer-request-form>
        <prayers-list
            @selected="onPrayerSelected"
            :selected="selectedPrayer ? selectedPrayer.$id : ''"
            :prayersInitialized="prayersInitialized"
            :prayers="prayers" />
      </div>
      <div v-if="selectedPrayer" class="col-md-7">
        <h4>
          <span v-if="selectedPrayerBelongsToUser"><button
              @click="showPrayerRequestForm = true"
              class="btn btn-warning btn-xs" type="button"><i class="glyphicon glyphicon-pencil"></i> Edit</button> &mdash; Your request</span>
          <span v-if="!selectedPrayerBelongsToUser && selectedPrayerPoster">Request by <strong><member-span :member="selectedPrayerPoster"></member-span></strong></span>
          <span v-if="!selectedPrayerPoster">Anonymous prayer request</span>
          &mdash; <small>{{selectedPrayer.createdAt | ts2date}}</small>
        </h4>
        <div id="prayer-content" v-html="selectedPrayer.contentMarked"></div>
        <hr />

        <pray-action
            v-if="!selectedPrayerBelongsToUser"
            :prayerId="selectedPrayer.$id" :userId="user.uid" />

        <p class="help-block" style="margin-top: 0">Do you think that this is not a Prayer request or it contains inappropriate contents? Help use to moderate the content of this Website by <a href="#"><i class="glyphicon glyphicon-flag"></i> flagging</a> this request.</p>

        <hr />
        <h5>Comments</h5>
        <div role="group"
             v-if="!showPrayerCommentsForm"
             class="btn-group" style="margin-bottom: 1em">
          <button
              @click="showPrayerCommentsForm = true"
              class="btn btn-primary" type="button"><i class="glyphicon glyphicon-plus"></i> Comments</button>
          <button v-if="selectedPrayerBelongsToUser && !selectedPrayer.answeredAt"
                  @click="whenGodAnswersThePrayer"
                  class="btn btn-success" type="button"><i class="glyphicon glyphicon-ok"></i> God has answered this Prayer !</button>
        </div>
        <prayer-request-comments-form
            v-else=""
            @dismiss="showPrayerCommentsForm = false"
            :prayer="selectedPrayer" />
        <prayer-comments-list
            :prayer="selectedPrayer"></prayer-comments-list>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import PrayerRequestForm from './forms/PrayerRequestForm.vue'
  import PrayersList from './lists/PrayersList.vue'
  import PrayerRequestCommentsForm from './forms/PrayerRequestCommentsForm.vue'
  import PrayerCommentsList from './lists/PrayerCommentsList.vue'
  import PrayAction from './actions/PrayForARequestAction.vue'
  import {SAuth} from '../stores/auth.js'
  import {SPrayers} from '../stores/prayers'
  import {SMembers} from '../stores/members'
  import firebase from 'firebase'
  import FApp from '../stores/firebase.js'
  import {confirm} from './bootstrap-modal-dialog.js'

  export default {
    name: 'Prayers',

    data() {
      return {
        showPrayerRequestForm: false,
        showPrayerCommentsForm: false,
        incrementViewsTimer: null,
      }
    },

    beforeCreate() {
      SPrayers.fdi()
      SMembers.fdi()
    },

    computed: {
      user() {
        return SAuth.state.user || {}
      },

      selectedPrayer() {
        return SPrayers.getters.selected(this.$route.params.id)
      },

      selectedPrayerPoster() {
        const prayer = this.selectedPrayer
        if (prayer) {
          return SMembers.getters.selected(prayer.poster)
        }
        return ''
      },

      selectedPrayerBelongsToUser() {
        return this.selectedPrayerPoster && this.selectedPrayerPoster.$id === this.user.uid
      },

      prayersInitialized() {
        return SPrayers.state.initialized
      },

      prayers() {
        return SPrayers.state.prayers
      },

      prayersCount() {
        return SPrayers.state.count
      }
    },

    methods: {
      onPrayerSelected(prayer) {
        if (this.incrementViewsTimer) {
          window.clearTimeout(this.incrementViewsTimer)
          this.incrementViewsTimer = null
        }
        if (!prayer) {
          this.$router.push(`/prayers`)
          return
        }

        if (this.selectedPrayer && this.selectedPrayer.$id === prayer.$id)
        // Already selected
          return

        this.showPrayerRequestForm = false
        this.$router.push(`/prayers/${prayer.$id}`)

        // Increment the views
        const currentViews = _.get(this.selectedPrayer, ['views', SAuth.state.user.uid], 0)
        const update = {}; update[SAuth.state.user.uid] = currentViews + 1

        this.incrementViewsTimer = window.setTimeout(() => {
          FApp.database().ref(`/prayers/${prayer.$id}/views`).update(update)
          this.incrementViewsTimer = null // done, clear
          console.log(`Views for prayer request ${this.selectedPrayer.$id} incremented`)
        }, 15000)
      },

      onDeleteSelectedPrayer() {
        confirm('Are you sure?', '<p>Once deleted, your request will be unrecoverable.</p>', () => {
          FApp.database().ref(`/prayers/${this.selectedPrayer.$id}`).remove()
          this.$router.replace('/prayers')
        })
      },

      whenGodAnswersThePrayer() {
        confirm('Not by accident?', '<p>That is a great thing, but we just want to make sure you did not accidentally touched the button.</p><p>Other members will not be praying for this request anymore after this.</p>', () => {
          FApp.database().ref(`/prayers/${this.selectedPrayer.$id}`).update({answeredAt: firebase.database.ServerValue.TIMESTAMP})
        })
      }
    },

    components: {
      PrayerRequestForm,
      PrayersList,
      PrayerRequestCommentsForm,
      PrayerCommentsList,
      PrayAction
    }
  }
</script>

<style scoped>
  div.container {
    padding-bottom: 1em;
  }
</style>