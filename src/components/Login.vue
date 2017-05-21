<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <h1 class="text-center">Login</h1>

        <div class="well well-sm">
          <form @submit.prevent.stop="doSubmit">
            <div v-show="mode === 'send-sms'" class="form-group">
              <label class="control-label">Phone number</label>
              <input v-model="phoneNumber" type="text" placeholder="international format, ex: +261 34 10 234 60" class="form-control" />
            </div>

            <div v-show="mode === 'confirm-code'" class="form-group">
              <label class="control-label">SMS confirmation code</label>
              <input v-model="confirmationCode" type="text" placeholder="check your SMS on the previous number" class="form-control" />
            </div>

            <div v-if="mode === 'send-sms'" id="recaptchaContainer" style="margin-bottom: 1em"></div>

            <div v-if="mode === 'send-sms'" role="group" class="btn-group">
              <button @click.prevent="doSendSMSCode" :disabled="!phoneNumber || phoneNumber.length < 6 || smsSent" class="btn btn-primary" type="submit">Send SMS code</button>
            </div>
            <div v-if="mode === 'confirm-code'" role="group" class="btn-group">
              <button @click.prevent="doBackToSendSMS" class="btn btn-default" type="button"><i class="glyphicon glyphicon-chevron-left"></i>Back</button>
              <button @click.prevent="doSendConfirmationCode" :disabled="!confirmationCode || confirmationCode.length < 6 || codeSent" class="btn btn-primary" type="submit">Confirm confirmation code</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import {SAuth} from '../stores/auth'


  export default {
    name: 'Login',

    data() {
      return {
        phoneNumber: '',
        smsSent: false,
        confirmationCode: '',
        codeSent: false,
        mode: 'send-sms'
      }
    },

    computed: {
      user() {
        return SAuth.state.user
      }
    },

    beforeCreate() {
      if (SAuth.state.user) {
        console.log('User is already logged-in! Redirecting to /')
        this.$router.replace('/')
      }
    },

    mounted() {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptchaContainer')
    },

    methods: {
      async doSubmit() {
        if (this.mode === 'send-sms')
          await this.doSendSMSCode()
        else if (this.mode === 'confirm-code')
          await this.doSendConfirmationCode()
      },

      async doSendSMSCode() {
        if (typeof window.grecaptcha === 'function')
          window.grecaptcha(window.recaptchaVerifier)

        try {
          this.smsSent = true

          window.confirmationResult = await firebase.auth().signInWithPhoneNumber(this.phoneNumber, window.recaptchaVerifier)
          this.mode = 'confirm-code'
        }
        catch (e) {
          window.alert(`Could not send the SMS: ${e.message}`)
        }
        finally {
          this.codeSent = false
        }
      },

      async doSendConfirmationCode() {
        try {
          this.codeSent = true

          await window.confirmationResult.confirm(this.confirmationCode)

          // User signed in successfully.
          this.$router.replace('/')
        }
        catch (e) {
          window.alert(`You could not be logged-in: ${e.message}`)
        }
        finally {
          this.codeSent = false
        }
      },

      doBackToSendSMS() {
        this.smsSent = false
        this.mode = 'send-sms'
      }
    }
  }
</script>

<style>
</style>