<template>
  <div class="well well-sm">
    <form @submit.prevent.stop="onSubmit">
      <div class="form-group">
        <label class="control-label">Full name</label>
        <input v-model="profile.fullName" class="form-control" type="text" />
      </div>
      <div class="form-group">
        <label class="control-label">Calling name</label>
        <input v-model="profile.displayName" class="form-control" type="text" />
      </div>
      <div class="form-group">
        <label class="control-label">Roles</label>

        <div v-for="(roleName, key) in rolesEnum" v-if="key !== 'zedeck'" class="checkbox">
          <label class="control-label">
            <input v-model="roles.__global_roles__" :value="key" type="checkbox" />{{roleName}}</label>
        </div>
      </div>

      <error-alert :error="error"></error-alert>

      <div role="group" class="btn-group">
        <submit-button :disabled="profile.fullName.length < 2 || profile.displayName.length < 2" :inProgress="inProgress">Save</submit-button>
        <button @click="$emit('dismiss')" class="btn btn-default" type="button">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
  import _ from 'lodash'
  import {Meteor} from 'meteor/meteor'
  import {roles} from '../../data/roles.js'
  import SubmitButton from "../global/SubmitButton";
  
  export default {
    components: {SubmitButton},
    name: 'UserAuthorizationAndProfileForm',

    props: {
      userId: {
        type: String,
        required: true
      }
    },
    
    data() {
      // Get current snapshot of the user
      const user = Meteor.users.findOne(this.userId)
      return _.assign({
        inProgress: false,
        error: null,

        rolesEnum: roles,

        // Data
        profile : {
          displayName: '',
          fullName : ''
        },
        roles: {
          __global_roles__: []
        }
      }, user)
    },

    methods: {
      onSubmit() {
        this.inProgress = true
        const data = {
          profile : {
            displayName: this.profile.displayName,
            fullName : this.profile.fullName
          },
          roles: {
            __global_roles__: this.roles.__global_roles__
          }
        }

        Meteor.call('users.authorizeAndUpdateName', {id: this.userId, doc: data}, (err) => {
          this.inProgress = false
          if (err) {
            this.error = err.message
          } else {
            this.$emit('dismiss')
          }
        })
      }
    }
  }
</script>

<style>
</style>