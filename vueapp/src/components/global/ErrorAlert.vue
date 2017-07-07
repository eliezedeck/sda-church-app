<template>
  <div v-show="error" role="alert" class="alert alert-danger">
    {{error}}
  </div>
</template>

<script>
  export default {
    name: 'ErrorAlert',
    props: ['error']
  }
</script>

<style>
</style>