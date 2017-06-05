<template>
  <p v-if="alreadyPrayingForTheRequest.hasOwnProperty('.value')">
    <span v-if="alreadyPrayingForTheRequest['.value']" style="color: green">Please remember this request when you pray. And thank you for praying.</span>
    <a @click.prevent="onPrayingForRequest" v-else="" href="#">I would like to <strong>pray</strong> for this request.</a>
  </p>
  <p v-else="">
    <loading />
  </p>
</template>

<script>
  import Loading from '../../components/widgets/Loading.vue'
  import FApp from '../../stores/firebase.js'

  export default {
    name: 'PrayForARequestAction',

    props: ['prayerId', 'userId'],

    created() {
      this.$bindAsObject('alreadyPrayingForTheRequest', FApp.database().ref(
        `/membersPrayingForPrayerRequests/${this.prayerId}/${this.userId}`))
    },

    methods: {
      onPrayingForRequest() {
        this.$firebaseRefs.alreadyPrayingForTheRequest.set(true)
      },
    },

    components: {
      Loading
    }
  }
</script>

<style>
</style>