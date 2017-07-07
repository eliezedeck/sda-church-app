<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h3>Utilisateurs </h3>
      </div>
      <div class="col-md-5">
        <div role="group" class="btn-group" style="margin-bottom: 1em">
          <button :disabled="!selectedUserId" @click="showAuthProfileForm = true"
              class="btn btn-primary" type="button"><i class="glyphicon glyphicon-plus"></i> Autorisation & Profil</button>
          <button :disabled="!selectedUserId"
              class="btn btn-danger" type="button"><i class="glyphicon glyphicon-remove"></i> Supprimer</button>
        </div>

        <auth-profile-form v-if="selectedUserId && showAuthProfileForm" :userId="selectedUserId" @dismiss="showAuthProfileForm = false" />
      </div>
      <div class="col-md-7">
        <div class="table-responsive">
          <table class="table">
            <thead>
            <tr>
              <th>Identifiant</th>
              <th>Noms</th>
              <th>Rôles</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="user in users"
                @click="$router.push(`/admin/users/${user._id}`); showAuthProfileForm = false"
                :class="{active: selectedUserId === user._id}"
            >
              <td>{{user.username}}</td>
              <td><strong>{{user.profile.fullName}}</strong></td>
              <td>
                <ul style="margin-bottom: 0">
                  <li v-for="role in filteredRoles(user)">{{role | named-role}}</li>
                </ul>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import {Meteor} from 'meteor/meteor'
  import AuthorizationAndProfileForm from './forms/UserAuthorizationAndProfile.vue'


  export default {
    name: 'Admin--Users',

    data() {
      return {
        showAuthProfileForm: false,
        users: []
      }
    },

    computed: {
      selectedUserId() {
        return this.$route.params['userId']
      }
    },

    meteor: {
      $subscribe: {
        'users.all': []
      },

      users() {
        return Meteor.users.find({}, {sort: {username: 1}})
      }
    },

    methods: {
      filteredRoles(user) {
        const roles = _.get(user.roles, '__global_roles__', [])
        return _.filter(roles, (r) => r !== 'zedeck')
      }
    },

    components: {
      'auth-profile-form': AuthorizationAndProfileForm
    }
  }
</script>

<style>
  h3 {
    margin-top: .5em;
  }
</style>