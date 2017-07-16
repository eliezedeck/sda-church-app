<template>
  <div>
    <div v-if="auth.initialized">
      <nav class="navbar navbar-inverse navbar-fixed-top navigation-clean">
        <div class="container-fluid">
          <div class="navbar-header"><a class="navbar-brand navbar-link" href="#">SDA ESC</a>
            <button class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navcol-1"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
          </div>
          <div class="collapse navbar-collapse" id="navcol-1">
            <ul class="nav navbar-nav navbar-right">
              <li v-if="auth.isOwner || auth.isZedeck" class="dropdown" :class="{active: currentRoutePath.indexOf('/admin/') !== -1}">
                <a data-toggle="dropdown" aria-expanded="false" href="#" class="dropdown-toggle">
                  <strong style="color: orangered">Administration</strong> <span class="caret"></span>
                </a>
                <ul role="menu" class="dropdown-menu">
                  <li role="presentation"><router-link to="/admin/members">Members</router-link></li>
                </ul>
              </li>

              <template v-if="auth.user">
                <li
                    v-for="link in links"
                    v-if="link.label"
                    :key="link.link"
                    :class="{active: link.highlight && currentRoutePath.indexOf(link.highlight) !== -1}"
                    role="presentation">
                  <router-link :to="link.link">{{link.label}}</router-link>
                </li>
              </template>

              <li v-if="authedUser">
                <a @click.prevent="logout" href="#">
                  <i class="glyphicon glyphicon-user"></i> <strong>Logout</strong>
                </a>
              </li>
              <li v-else>
                <a @click.prevent="$router.push('/auth')" href="#" style="color: indianred">
                  <i class="glyphicon glyphicon-user"></i> <strong>Sign-in</strong>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <div id="master-content">
      <router-view v-if="auth.initialized && allSubsReady"></router-view>

      <div v-else class="container">
        <div class="row">
          <div class="col-md-12 text-center">
            <h1><i class="glyphicon glyphicon-refresh spin"></i>&nbsp;&nbsp;Connexion avec le serveur ...</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import './components/global'
  import {Meteor} from 'meteor/meteor'
  import {routes} from './routes'

  import {watchAuth} from './stores/auth.js'
  import {watchUsers} from './stores/data/members.js'

  export default {
    name: 'App',

    created() {
      watchAuth(this)
      watchUsers(this)
    },

    data() {
      return {
        links: routes
      }
    },

    computed: {
      // This is mainly a way to check the authenticated user at any stage (created, updated, ...)
      authedUser() {
        const user = this.$store.state.auth.user

        if (user) {
          if (!this._subscriptionInitialized) {
            this._subscriptionInitialized = true

            // Begin subscriptions
            this.$subscribe('users.all')
            console.log('Streaming data ...')
          }
        }

        return user
      },

      currentRoutePath() {
        return this.$route.path
      },

      allSubsReady() {
        return !!this.$subReady['users.all']
      }
    },

    methods: {
      logout() {
        this.$router.push('/')
        Meteor.logout()
      }
    }
  }
</script>

<style>
  div#master-content {
    margin-top: 3.65em;
  }

  .navigation-clean {
    padding-top: 0;
    padding-bottom: 0;
  }

  .navbar {
    -webkit-box-shadow: 0 0 5px 0 rgba(0,0,0,0.75);
    -moz-box-shadow: 0 0 5px 0 rgba(0,0,0,0.75);
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.75);
  }

  /* This should be used inside a table td/th, where the table has a table-layout: fixed CSS and each of the cells has
   * a predefined length (unit or percentage). Obviously, using the td element directly also works. */
  div.clipped, td.clipped, td.clipped > * {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* For markdown paragraphs */
  p:last-child {
    margin-bottom: 0;
  }

  p.help-block {
    font-size: 80%;
    color: darkgrey;
  }

  /* Spin */
  @-moz-keyframes spin {
    from { -moz-transform: rotate(0deg); }
    to { -moz-transform: rotate(360deg); }
  }
  @-webkit-keyframes spin {
    from { -webkit-transform: rotate(0deg); }
    to { -webkit-transform: rotate(360deg); }
  }
  @keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
  }

  i.spin {
    animation: spin 5s infinite linear;
  }

  tr.active > td {
    background-color: rgba(255, 168, 00, 0.3) !important;
  }
</style>
