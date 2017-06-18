<template>
  <div class="table-responsive" style="font-size: 80%">
    <p style="margin-bottom: 0">Members praying for this request</p>
    <ul>
      <li v-for="v in prayingMembers">
        {{memberName(v['.key'])}}
      </li>
    </ul>
  </div>
</template>

<script>
  import {SMembersMixin} from '../../stores/members.js'
  import FApp from '../../stores/firebase.js'
  import Loading from '../widgets/Loading.vue'

  export default {
    props: {
      prayerRequestId: {
        type: String,
        required: true
      }
    },

    mixins: [SMembersMixin],

    created() {
      this.$bindAsArray('prayingMembers',
        FApp.database().ref(`/membersPrayingForPrayerRequests/${this.prayerRequestId}`))
    },

    components: {
      Loading
    }
  }
</script>

<style>
</style>