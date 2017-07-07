<template>
  <div class="container text-center">
    <h1 v-if="auth.user">Bienvenue <strong>{{auth.user.profile.fullName}}</strong> !</h1>
    <h1 v-else="">Bienvenue,</h1>

    <p v-if="!auth.user">Veuillez vous-identifier, cliquez <router-link to="/auth">ici</router-link></p>
    <p v-else="">
      Pour commencer, <strong>utilisez les menus</strong> ... <br>
      Si vous n'arrivez pas à acceder certaines fonctionalités de l'application, veuillez contacter un résponsable.
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
