<template>
  <router-view></router-view>
</template>

<script>
  import 'bootstrap/dist/js/bootstrap'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'typeface-abel'

  export default {
    name: 'APP'
  }
</script>

<style>
  * {
    font-family: "Abel";
  }

  div.form-group > label {
    font-weight:bold;
  }

  tr.active, td.active {
    background-color:rgba(255,193,7,0.27);
  }
</style>
