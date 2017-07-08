<template>
  <div class="container text-center">
    <h1 v-if="auth.user">Welcome <strong>{{auth.user.profile.fullName}}</strong> !</h1>
    <h1 v-else="">Welcome,</h1>

    <p v-if="!auth.user">Please log in, click <router-link to="/auth">here</router-link></p>
    <p v-else="">
      To start, <strong>please use the menus</strong> ... <br>
      If you are not able to access some of the Application features, please contact an Administrator.
    </p>
  </div>
</template>

<script>
  export default {
    name: 'Home'
  }
</script>

<style>
</style>
