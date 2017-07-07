<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <h3 v-if="mode === 'registration'" class="text-center">Inscription</h3>
        <h3 v-else="" class="text-center">S'identifier</h3>
        <div class="well well-sm">
          <form @submit.prevent.stop="onSubmit">
            <div class="form-group">
              <label class="control-label">Nom d&#39;utilisateur / Pseudo</label>
              <input v-focus v-model="username" name="username" type="text" placeholder="(en minuscule)" class="form-control" />
            </div>
            <div v-if="mode === 'registration'" class="form-group">
              <label class="control-label">Votre nom + prénom (ou nom indicatif)</label>
              <input v-model="fullName" type="text" placeholder="(ex: RAMANISATELO Efatra)" class="form-control" />
            </div>
            <div class="form-group">
              <label class="control-label">Mot de passe</label>
              <input v-model="password" name="password" type="password" placeholder="(doit être 8 charactères ou plus)" class="form-control" />
            </div>
            <div v-if="mode === 'registration'" class="form-group">
              <label class="control-label">Répétez le mot de passe</label>
              <input v-model="passwordRepeated" type="password" placeholder="(obligatoire)" class="form-control" />
            </div>

            <error-alert :error="error"></error-alert>

            <div role="group" class="btn-group">
              <submit-button
                  :inProgress="inProgress"
                  :disabled="inProgress || fullName.length < 2 || username.length < 2 || password.length < 8 || passwordRepeated !== password"
                  v-if="mode === 'registration'">Créer votre compte</submit-button>
              <submit-button
                  :inProgress="inProgress"
                  :disabled="inProgress || username.length < 2 || password.length < 8"
                  v-else="">S'identifier</submit-button>
            </div>
          </form>
        </div>
        <p v-if="mode === 'login'" class="text-center">Si vous n&#39;avez pas encore finis votre inscription, veuillez cliquer <a @click.prevent="mode = 'registration'" href="#">ici </a> pour s&#39;inscrire pour pouvoir utiliser l&#39;application.</p>
        <p v-else="" class="text-center">Pour s'identifier, cliquez <a @click.prevent="mode = 'login'" href="#">ici</a></p>
      </div>
    </div>
  </div>
</template>

<script>
  import {Meteor} from 'meteor/meteor'
  import {Accounts} from 'meteor/accounts-base'

  export default {
    data() {
      return {
        error: null,
        inProgress: false,
        mode: 'login', // or 'registration'

        fullName: '',
        username: '',
        password: '',
        passwordRepeated: ''
      }
    },

    methods: {
      onSubmit() {
        this.error = null
        this.inProgress = true

        if (this.mode === 'registration') {
          const data = {
            profile: {
              fullName: this.fullName
            },
            username: this.username,
            password: this.password
          }

          Accounts.createUser(data, (error) => {
            this.inProgress = false
            if (error) {
              this.error = error.message
            }
            else {
              if (this.mode === 'registration') {
                this.$emit('registered')
                this.$router.push('/auth/registered')
              }
            }
          })
        }
        else {
          Meteor.loginWithPassword(this.username, this.password, (error) => {
            this.inProgress = false
            if (error) {
              this.error = error.message
            } else {
              this.$emit('signedIn')
              this.$router.push('/')
            }
          })
        }
      }
    }
  }
</script>

<style>
</style>