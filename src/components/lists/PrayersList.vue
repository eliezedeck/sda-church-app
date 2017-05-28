<template>
  <div class="table-responsive">
    <table class="table table-condensed" style="table-layout: fixed">
      <thead>
      <tr>
        <th style="width: 80%">Request list</th>
        <th style="width: 20%">Views</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="prayer in prayers">
        <td class="clipped" v-html="prayer.contentMarked"></td>
        <td>...</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'PrayersList',

    props: {
      prayers: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style>
</style>