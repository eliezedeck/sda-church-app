<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <h3 v-if="mode === 'registration'" class="text-center">Registration</h3>
        <h3 v-else="" class="text-center">Sign-in</h3>
        <div class="well well-sm">
          <form @submit.prevent.stop="onSubmit">
            <div class="form-group">
              <label class="control-label">Username / Pseudo</label>
              <input v-focus v-model="username" name="username" type="text" placeholder="(lower case preferred)" class="form-control" />
            </div>
            <div v-if="mode === 'registration'" class="form-group">
              <label class="control-label">Your full name</label>
              <input v-model="fullName" type="text" placeholder="(ex: RAMANISATELO Efatra)" class="form-control" />
            </div>
            <div v-if="mode === 'registration'" class="form-group">
              <label class="control-label">Calling name</label>
              <input v-model="displayName" type="text" placeholder="(displayed throughout the application)" class="form-control" />
            </div>
            <div class="form-group">
              <label class="control-label">Password</label>
              <input v-model="password" name="password" type="password" placeholder="(must be 8 characters or more)" class="form-control" />
            </div>
            <div v-if="mode === 'registration'" class="form-group">
              <label class="control-label">Repeat the password</label>
              <input v-model="passwordRepeated" type="password" placeholder="(mandatory)" class="form-control" />
            </div>

            <error-alert :error="error"></error-alert>

            <div role="group" class="btn-group">
              <submit-button
                  :inProgress="inProgress"
                  :disabled="fullName.length < 2 || displayName.length < 2 || username.length < 2 || password.length < 8 || passwordRepeated !== password"
                  v-if="mode === 'registration'">Create your account</submit-button>
              <submit-button
                  :inProgress="inProgress"
                  :disabled="username.length < 2 || password.length < 8"
                  v-else="">Sign-in</submit-button>
            </div>
          </form>
        </div>
        <p v-if="mode === 'login'" class="text-center">If you have never created an account before click <a @click.prevent="mode = 'registration'" href="#">here</a> to create one in order to use the application.</p>
        <p v-else="" class="text-center">To sign-in, click <a @click.prevent="mode = 'login'" href="#">here</a></p>
      </div>
    </div>
  </div>
</template>

<script>
  import {Meteor} from 'meteor/meteor'
  import {Accounts} from 'meteor/accounts-base'

  export default {
    data() {
      return {
        error: null,
        inProgress: false,
        mode: 'login', // or 'registration'

        fullName: '',
        displayName: '',
        username: '',
        password: '',
        passwordRepeated: ''
      }
    },

    methods: {
      onSubmit() {
        this.error = null
        this.inProgress = true

        if (this.mode === 'registration') {
          const data = {
            profile: {
              fullName: this.fullName,
              displayName: this.displayName
            },
            username: this.username,
            password: this.password
          }

          Accounts.createUser(data, (error) => {
            this.inProgress = false
            if (error) {
              this.error = error.message
            }
            else {
              if (this.mode === 'registration') {
                this.$emit('registered')
                this.$router.push('/auth/registered')
              }
            }
          })
        }
        else {
          Meteor.loginWithPassword(this.username, this.password, (error) => {
            this.inProgress = false
            if (error) {
              this.error = error.message
            } else {
              this.$emit('signedIn')
              this.$router.push('/')
            }
          })
        }
      }
    }
  }
</script>

<style>
</style>