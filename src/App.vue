<template>
  <div>
    <div v-if="!baqendReady">
      Connecting to server ...
    </div>

    <router-view v-else></router-view>
  </div>
</template>

<script>
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'typeface-abel'
import '@fortawesome/fontawesome'
import '@fortawesome/fontawesome-free-solid'

import DB from 'baqend/realtime'

export default {
  name: 'APP',

  data () {
    return {
      baqendReady: false
    }
  },

  mounted () {
    // Deduce the URL to Baqend local server
    const loc = window.location
    let connectTarget = `${loc.protocol}//${loc.hostname}:${loc.port}/v1`
    if (loc.hostname === 'localhost') {
      connectTarget = `${loc.protocol}//localhost:2480/v1`
      console.log(`Targetting server ${connectTarget} ...`)
    }

    DB.connect(connectTarget)
    DB.ready(async () => {
      console.log('Connected to server.')

      if (DB.User.me === null) {
        // Login as root for now ... FIXME: implement registrations and accounts
        await DB.User.login('root', 'root')
        console.log('Logged-in ...')
      } else {
        console.log('Already logged-in ...')
      }

      this.baqendReady = true
    })
  }
}
</script>

<style>
  * {
    font-family: "Abel", sans-serif;
  }

  div.form-group > label {
    font-weight:bold;
  }

  tr.active, td.active {
    background-color:rgba(255,193,7,0.27);
  }
</style>
