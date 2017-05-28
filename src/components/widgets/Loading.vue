<template>
  <div class="text-center">
    <i class="glyphicon glyphicon-refresh glyphicon-loading-animate"></i>&nbsp;&nbsp;{{text}}
  </div>
</template>

<script>
  export default {
    name: 'Loading',

    props: {
      text: {
        type: String,
        default: 'Loading ...'
      }
    }
  }
</script>

<style>
</style>