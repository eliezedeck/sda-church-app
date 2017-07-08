<template>
  <div class="table-responsive">
    <table class="table table-condensed table-hover" style="table-layout: fixed">
      <thead>
      <tr>
        <th style="width: 80%">Requests</th>
        <th class="text-right" style="width: 20%">Views</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="request in list">
        <td class="clipped" v-html="markedFirstLine(request.content)"></td>
        <td class="text-right">{{request.viewsCount}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import {MarkedMixin} from '../../data/marked.js'

  export default {
    name: 'PrayerRequestsList',

    mixins: [MarkedMixin],

    props: {
      list: {
        type: Array
      }
    }
  }
</script>

<style>
</style>