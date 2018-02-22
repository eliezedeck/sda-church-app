<template>
  <div>
    <div style="margin-top: 3.5rem">
      <nav class="navbar navbar-dark navbar-expand-md fixed-top bg-dark navigation-clean">
        <div class="container">
          <a href="#" class="navbar-brand">English Speaking Church</a>
          <button data-toggle="collapse" data-target="#navcol-1" class="navbar-toggler"><span class="sr-only">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>

          <div
            class="collapse navbar-collapse" id="navcol-1">
            <ul class="nav navbar-nav ml-auto">
              <li class="dropdown"><a data-toggle="dropdown" aria-expanded="false" href="#" class="dropdown-toggle nav-link">Treasury</a>
                <div role="menu" class="dropdown-menu">
                  <a role="presentation" href="#/treasury/input-sessions" class="dropdown-item">Input sessions</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'typeface-abel'
import '@fortawesome/fontawesome'
import '@fortawesome/fontawesome-free-solid'

export default {
  name: 'APP',

  created () {
    this.$store.dispatch('gunAccounts/subscribe')
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
