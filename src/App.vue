<template>
  <div v-if="!userInitialized">
    <h1 class="text-center" style="margin-top: 3em">
      <i class="glyphicon glyphicon-refresh glyphicon-loading-animate"></i>&nbsp;&nbsp;Synchronizing with the server ...
    </h1>
  </div>

  <div v-else="" id="app">
    <div>
      <nav class="navbar navbar-inverse navbar-fixed-top navigation-clean">
        <div class="container">
          <div class="navbar-header"><a href="#" class="navbar-brand navbar-link">English Speaking Church of ANTANANARIVO</a>
            <button data-toggle="collapse" data-target="#navcol-1" class="navbar-toggle collapsed"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
          </div>
          <div class="collapse navbar-collapse" id="navcol-1">
            <ul class="nav navbar-nav navbar-right">
              <li role="presentation" class="active"><a href="#">Announcements</a></li>
              <li role="presentation"><router-link to="/prayers">Prayers</router-link></li>
              <li role="presentation"><a href="#">Votes </a></li>
              <li class="dropdown"><a data-toggle="dropdown" aria-expanded="false" href="#" class="dropdown-toggle">Departments <span class="caret"></span></a>
                <ul role="menu" class="dropdown-menu">
                  <li role="presentation"><a href="#">First Item</a></li>
                  <li role="presentation"><a href="#">Second Item</a></li>
                  <li role="presentation"><a href="#">Third Item</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <div class="container-fluid" style="margin-top: 5em; background-color: #bbbbbb;">
      <div class="row">
        <div class="col-md-12">
          <div class="container">
            <div class="row">
              <div class="col-md-12 text-right" style="padding: .5em 1em .5em 1em;">
                <div>
                  <span v-if="!user">Welcome dear {{memberDisplayName}}, please <router-link to="/login">login using your Phone</router-link>.</span>
                  <span v-else>Welcome <strong>{{memberDisplayName}}</strong>, <a @click.prevent="doLogout" href="#">logout</a>. You can also update your <router-link to="/profile">Profile</router-link>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="contents" style="min-height: 38em;">
      <router-view></router-view>
    </div>

    <div class="footer-dark">
      <footer>
        <div class="container">
          <div class="row">
            <div class="col-md-6 col-md-push-6 item text">
              <h3>Company Name</h3>
              <p>Praesent sed lobortis mi. Suspendisse vel placerat ligula. Vivamus ac sem lacus. Ut vehicula rhoncus elementum. Etiam quis tristique lectus. Aliquam in arcu eget velit pulvinar dictum vel in justo.</p>
            </div>
            <div class="col-md-3 col-md-pull-6 col-sm-4 item">
              <h3>Services</h3>
              <ul>
                <li><a href="#">Web design</a></li>
                <li><a href="#">Development</a></li>
                <li><a href="#">Hosting</a></li>
              </ul>
            </div>
            <div class="col-md-3 col-md-pull-6 col-sm-4 item">
              <h3>About</h3>
              <ul>
                <li><a href="#">Company</a></li>
                <li><a href="#">Team</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div class="col-md-12 col-sm-4 item social"><a href="#"><i class="icon ion-social-facebook"></i></a><a href="#"><i class="icon ion-social-twitter"></i></a><a href="#"><i class="icon ion-social-snapchat"></i></a><a href="#"><i class="icon ion-social-instagram"></i></a></div>
          </div>
          <p class="copyright">English Speaking Church of ANTANANARIVO © 2017 &mdash; An application by <a href="http://www.eliezedeck.com" target="_blank">ElieZedeck.com </a></p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
  import FApp from './stores/firebase.js'
  import {SAuth} from './stores/auth'


  export default {
    name: 'App',

    computed: {
      memberDisplayName() {
        return SAuth.getters.displayName
      },

      userInitialized() {
        return SAuth.state.userInitialized
      },

      user() {
        return SAuth.state.user
      }
    },

    methods: {
      async doLogout() {
        await FApp.auth().signOut()
        this.$router.replace('/')
      }
    }
  }
</script>

<style>
  /* This should be used inside a table td/th, where the table has a table-layout: fixed CSS and each of the cells has
   * a predefined length (unit or percentage). Obviously, using the td element directly also works. */
  div.clipped, td.clipped {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p.help-block {
    font-size: 80%;
  }

  /* For markdown paragraphs */
  p:last-child {
    margin-bottom: 0;
  }

  tr.active > td {
    background-color: rgba(200, 200, 200, 0.5) !important;
  }
</style>
