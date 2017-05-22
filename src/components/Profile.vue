<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Your profile </h1></div>
      <div class="col-md-6">
        <div v-if="showProfileForm">
          <profile-form
              :member="member"
              @dismiss="showProfileForm = false"></profile-form>
        </div>

        <div v-show="!showProfileForm">
          <div role="group" class="btn-group" style="margin-bottom: 1em">
            <button @click="showProfileForm = true" class="btn btn-success" type="button"><i class="glyphicon glyphicon-pencil"></i> Update your profile</button>
          </div>
          <div v-if="member" class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <tbody>
              <tr>
                <td>Name</td>
                <td>{{member.name}}</td>
              </tr>
              <tr>
                <td>Display name</td>
                <td>{{member.displayName}}</td>
              </tr>
              <tr>
                <td>Phone number</td>
                <td>{{user.phoneNumber}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <p><strong>Name</strong> is your full name. This includes your family name.</p>
        <p>Your <strong>Display name</strong> is what is used on this application to quickly identify you among all other Church members. This is not a fancy/weird username that you are acustomed to using with Facebook and Twitter.</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {SAuth} from '../stores/auth.js'
  import Form from './forms/ProfileForm.vue'

  export default {
    name: 'Profile',

    data() {
      return {
        showProfileForm: false,
      }
    },

    computed: {
      member() {
        return SAuth.state.memberProfile
      },

      user() {
        return SAuth.state.user
      }
    },

    components: {
      'profile-form': Form
    }
  }
</script>

<style>
</style>