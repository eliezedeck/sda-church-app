<template>
  <div>
    <div v-if="auth.initialized">
      <nav class="navbar navbar-inverse navbar-fixed-top navigation-clean">
        <div class="container-fluid">
          <div class="navbar-header"><a class="navbar-brand navbar-link" href="#">Mendrika</a>
            <button class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navcol-1"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
          </div>
          <div class="collapse navbar-collapse" id="navcol-1">
            <ul class="nav navbar-nav navbar-right">
              <li v-if="auth.isOwner || auth.isZedeck" class="dropdown" :class="{active: currentRoutePath.indexOf('/admin/') !== -1}">
                <a data-toggle="dropdown" aria-expanded="false" href="#" class="dropdown-toggle">
                  <strong style="color: orangered">Administration</strong> <span class="caret"></span>
                </a>
                <ul role="menu" class="dropdown-menu">
                  <li role="presentation"><router-link to="/admin/users">Utilisateurs</router-link></li>
                </ul>
              </li>

              <template v-if="auth.user">
                <li
                    v-for="link in links"
                    v-if="link.label"
                    :class="{active: link.highlight && currentRoutePath.indexOf(link.highlight) !== -1}"
                    role="presentation">
                  <router-link :to="link.link">{{link.label}}</router-link>
                </li>
              </template>

              <li v-if="auth.user">
                <a @click.prevent="logout" href="#">
                  <i class="glyphicon glyphicon-user"></i> <strong>Se déconnecter</strong>
                </a>
              </li>
              <li v-else="">
                <a @click.prevent="$router.push('/auth')" href="#" style="color: indianred">
                  <i class="glyphicon glyphicon-user"></i> <strong>S'identifier</strong>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <div id="master-content" style="margin-top: 3.65em;">
      <router-view v-if="auth.initialized"></router-view>

      <div v-else="" class="container">
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

  import {watchAuthMixin} from './stores/auth.js'

  export default {
    name: 'App',
    mixins: [watchAuthMixin],

    data() {
      return {
        links: routes
      }
    },

    computed: {
      currentRoutePath() {
        return this.$route.path
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
  .navigation-clean {
    padding-top: 0;
    padding-bottom: 0;
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
</style>
