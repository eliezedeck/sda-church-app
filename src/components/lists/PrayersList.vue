<template>
  <div class="table-responsive">
    <table class="table table-condensed table-hover" style="table-layout: fixed">
      <thead>
      <tr @click="$emit('selected', null)">
        <th style="width: 80%">Request list</th>
        <th class="text-right" style="width: 20%">Views</th>
      </tr>
      </thead>

      <tbody v-if="!prayersInitialized">
      <tr>
        <td colspan="100">
          <loading></loading>
        </td>
      </tr>
      </tbody>

      <tbody v-else="">
      <tr
          v-for="(prayer, id) in prayers"
          @click="$emit('selected', prayer)" :class="{active: selected === id, success: prayer.answeredAt}">
        <td class="clipped" v-html="markedFirstLine(prayer.content)"></td>
        <td class="text-right">{{getPrayerViewsCount(prayer)}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import _ from 'lodash'
  import marked from 'marked'

  export default {
    name: 'PrayersList',

    props: {
      prayersInitialized: {
        type: Boolean,
        default: false
      },

      prayers: {
        type: Object, // list
        required: true
      },

      prayerViews: {
        type: Object, // list
        required: true
      },

      selected: {
        type: String
      }
    },

    methods: {
      getPrayerViewsCount(prayer) {
        return _.get(this.prayerViews, prayer.$id, 0)
      },

      markedFirstLine(content) {
        const first_line = _.trim(_.split(content, '\n')[0])
        return marked(first_line)
      }
    }
  }
</script>

<style>
</style>