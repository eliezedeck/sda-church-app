<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <h1 class="text-center">Login</h1>

        <div class="well well-sm">
          <form>
            <div class="form-group">
              <label class="control-label">Phone number</label>
              <input type="text" placeholder="international format, ex: +261 34 10 234 60" class="form-control" />
            </div>
            <div class="form-group">
              <label class="control-label">SMS confirmation code</label>
              <input type="text" placeholder="check your SMS on the previous number" class="form-control" />
            </div>
            <div role="group" class="btn-group">
              <button class="btn btn-primary" type="button">Send SMS code</button>
            </div>
          </form>
          <div role="group" class="btn-group">
            <button class="btn btn-default" type="button"><i class="glyphicon glyphicon-chevron-left"></i>Back</button>
            <button class="btn btn-primary" type="button">Confirm confirmation code</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {SAuth} from '../stores/auth'


  export default {
    name: 'Login',

    computed: {
      user() {
        return SAuth.state.user
      }
    },

    beforeCreate() {
      if (this.user) {
        console.log('User is already logged-in! Redirecting to /')
        this.$router.replace('/')
      }
    }
  }
</script>

<style>
</style>