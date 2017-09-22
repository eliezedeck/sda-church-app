<template>
  <div class="well well-sm">
    <form @submit.prevent.stop="doSubmit">
      <div class="form-group">
        <label class="control-label">Full name</label>
        <input v-model="name" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label class="control-label">Display name</label>
        <input v-model="displayName" type="text" class="form-control" />
      </div>

      <error v-if="error">
        <p>{{error}}</p>
      </error>

      <div class="btn-group" role="group">
        <button :disabled="inProgress || name.length < 2 || displayName.length < 2" class="btn btn-primary" type="submit">Update</button>
        <button @click="$emit('dismiss')" class="btn btn-default" type="button">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
  import _ from 'lodash'
  import FApp from '../../stores/firebase.js'
  import {SAuth} from '../../stores/auth.js'
  import error from './error.vue'

  export default {
    name: 'ProfileForm',

    props: {
      member: {
        type: Object
      }
    },

    beforeCreate() {
      if (!SAuth.state.user)
        SAuth.commit('ASK_TO_LOGIN', {redirectPath: this.$route.path})
    },

    data() {
      let state = {
        error: null,
        inProgress: false,

        name: '',
        displayName: ''
      }

      _.assign(state, this.member)
      return state
    },

    methods: {
      async doSubmit() {
        try {
          this.error = null
          this.inProgress = true

          await FApp.database().ref(`/members/${SAuth.state.user.uid}`).update({
            name: this.name,
            displayName: this.displayName
          })

          // Reload the page to refresh the data which depends on the user identity
          window.setTimeout(() => {
            window.location.reload(false)
          }, 200)

          this.$emit('dismiss')
        }
        catch (e) {
          this.error = e.message
        }
        finally {
          this.inProgress = false
        }
      }
    },

    components: {
      error
    }
  }
</script>

<style>
</style>