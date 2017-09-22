<template>
  <div v-if="!userInitialized">
    <h1 class="text-center" style="margin-top: 3em">
      <i class="glyphicon glyphicon-refresh glyphicon-loading-animate"></i>&nbsp;&nbsp;Synchronizing with the server ...
    </h1>
  </div>

  <div v-else="" id="app">
    <div id="appConfirmModal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"></h4>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary">Confirm?</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
          <div class="navbar-header"><a href="#" class="navbar-brand navbar-link"><strong>English</strong>-Speaking Church of Antananarivo</a>
            <button data-toggle="collapse" data-target="#navcol-1" class="navbar-toggle collapsed"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
          </div>
          <div class="collapse navbar-collapse" id="navcol-1">
            <ul class="nav navbar-nav navbar-right">
              <li v-for="menu in menus"
                  :key="menu.url"
                  role="presentation" :class="{active: activeUrl === menu.url}">
                <router-link :to="menu.url">{{menu.label}}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <div class="container-fluid" style="margin-top: 4.9em; background-color: #bbbbbb;">
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
  </div>
</template>

<script>
  import FApp from './stores/firebase.js'
  import {SAuth} from './stores/auth'


  const menus = [
    //{label: 'Events', url: '/events'},
    //{label: 'Prayers', url: '/prayers'}
    {label: 'Church Picnic REGISTRATION', url: '/'}
  ]

  export default {
    name: 'App',

    data() {
      return {
        menus: menus
      }
    },

    computed: {
      activeUrl() {
        return this.$route.path
      },

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
    color: #adadad;
  }

  /* For markdown paragraphs */
  p:last-child {
    margin-bottom: 0;
  }

  tr.active > td {
    background-color: rgba(200, 200, 200, 0.5) !important;
  }

  tr.active.success > td {
    background-color: rgba(112, 200, 98, 0.5) !important;
  }

  hr {
    margin-bottom: 10px;
    margin-top: 10px;
  }
</style>
