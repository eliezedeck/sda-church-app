<template>
  <div class="table-responsive">
    <table class="table table-condensed table-hover" style="table-layout: fixed">
      <thead>
      <tr>
        <th style="width: 90%">Requests</th>
        <th class="text-right" style="width: 10%">Views</th>
      </tr>
      </thead>
      <tbody>

      <tr v-if="!ready">
        <td colspan="100" class="text-center"><loading /></td>
      </tr>

      <tr v-else="" v-for="request in list" @click="$emit('selected', request)" :class="{active: selectedId === request._id}">
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
      ready: {
        type: Boolean
      },
      list: {
        type: Array
      },
      selectedId: {
        type: String
      }
    }
  }
</script>

<style>
</style>