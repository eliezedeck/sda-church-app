<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1 class="text-center">October 1st &mdash; <strong>Church Picnic</strong></h1></div>
      <div class="col-md-12">
        <div v-if="memberHasName && !showRegistrationForm && !userRegistration" role="group" class="btn-group btn-group-justified">
          <a @click.prevent="showRegistrationForm = true" class="btn btn-primary btn-lg" role="button" href="#">
            <i class="glyphicon glyphicon-bell"></i> Register today
          </a>
        </div>

        <p class="lead text-center bg-success" v-else>You are already registered.</p>

        <p v-if="!memberHasName" class="lead text-center">You must update your Profile with your name before you can register. To do so, click <router-link to="/profile">here</router-link>.</p>

        <div v-if="showRegistrationForm" class="well well-sm">
          <form>
            <div class="row">
              <div class="col-md-5">
                <p>To start, click the button to Register yourself.</p>
                <p>After that, you can add and register other persons, for example: your family members, or your friends (Adventist or not).</p>
                <p>The Church will cover both Transportation and the Entry fees when we get there, but <strong>only</strong> if the person is a Member of the Church or a Sabbath School class.</p>
              </div>
              <div class="col-md-7">
                <div v-if="!showSubForm" role="group" class="btn-group" style="margin-bottom: .5em">
                  <button @click="showSubForm = true" class="btn btn-info" type="button">
                    <template v-if="!selfInSubform">Register myself</template>
                    <template v-else>Register another person</template>
                  </button>
                  <button v-if="subFormSelectedIndex !== -1" @click="removePersonFromSubform"
                          class="btn btn-danger" type="button">Remove</button>
                </div>

                <div v-if="showSubForm" class="well well-sm" style="background-color:rgb(235,235,235);">
                  <div v-if="selfInSubform" class="form-group">
                    <label class="control-label">Short-name of the person</label>
                    <input v-model="subFormData.name" type="text" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="control-label">Please check what applies</label>
                    <div class="checkbox">
                      <label class="control-label">
                        <input v-model="subFormData.wantsTransportation" type="checkbox" />Need <strong>Special Transportation</strong></label>
                    </div>
                    <div class="checkbox">
                      <label class="control-label">
                        <input v-model="subFormData.isChurchMember" type="checkbox" />Member of the English-Speaking Church</label>
                    </div>
                    <div class="checkbox">
                      <label class="control-label">
                        <input v-model="subFormData.isSabbathSchoolMember" type="checkbox" />Registered in one of the English-Speaking Church Sabbath school class</label>
                    </div>
                  </div>
                  <div role="group" class="btn-group">
                    <button @click.prevent.stop="addPersonToSubform"
                        :disabled="selfInSubform && subFormData.name.length < 2" class="btn btn-primary" type="button">Add to the List</button>
                    <button @click="showSubForm = false" class="btn btn-default" type="button">Do not add</button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table">
                    <thead>
                    <tr>
                      <th>Name</th>
                      <th>Fees</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(registration, i) in registrationFromForm" :key="i"
                        @click="subFormSelectedIndex = i" :class="{active: subFormSelectedIndex === i}">
                      <td>
                        <span v-if="registration.name">{{registration.name}}</span>
                        <span v-if="registration.memberId">{{memberName(registration.memberId)}}</span>
                      </td>
                      <td>
                        <small v-if="registration.isChurchMember || registration.isSabbathSchoolMember" style="color: green">(Covered by the Church)</small>
                        <span v-else>{{2000 + (registration.wantsTransportation ? 4000 : 0)}} Ar</span>
                      </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                      <td>TOTAL</td>
                      <td><strong>{{subFormTotalFees}}</strong> Ar</td>
                    </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div class="col-md-12">
                <div role="group" class="btn-group">
                  <button @click.prevent.stop="confirmRegistration" :disabled="!selfInSubform"
                          class="btn btn-primary" type="button"><i class="glyphicon glyphicon-ok"></i> Finish + Confirm registration</button>
                  <button @click="showRegistrationForm = false, showSubForm = false" class="btn btn-default" type="button">Cancel registration</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <p v-if="userPayments.due - userPayments.paid > 0" class="lead text-center bg-danger">But you need to pay the fees, remaining {{userPayments.due - userPayments.paid}} Ar (of {{userPayments.due}} Ar). Remember, the deadline is on Wednesday.</p>
      </div>

      <div v-if="memberHasName" class="col-md-12">
        <h4>Here are the list of those going ...</h4>
        <p>Don&#39;t wait, those who come first will enter first when we arrive.</p>
        <div class="table-responsive">
          <table class="table">
            <thead>
            <tr>
              <th>Registered by</th>
              <th>Name </th>
              <th>When </th>
            </tr>
            </thead>
            <tbody>

            <tr v-if="!loaded">
              <td colspan="100">
                <i class="glyphicon glyphicon-refresh glyphicon-loading-animate"></i>&nbsp;&nbsp;Loading ...
              </td>
            </tr>

            <tr v-else v-for="(data, memberId) in specialTreeRegistrations" :key="memberId">
              <td>{{memberName(memberId)}}</td>
              <td>
                <ol>
                  <li v-for="reg in data.details">
                    <span v-if="reg.memberId">{{memberName(reg.memberId)}}</span>
                    <span v-else>{{reg.name}}</span>
                  </li>
                </ol>
              </td>
              <td>{{moment(data.timestamp).format('Do MMMM, HH:mm:ss')}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {SAuth} from '../stores/auth'
  import {SMembers, SMembersMixin} from '../stores/members'
  import _ from 'lodash'
  import moment from 'moment'

  import firebase from 'firebase'
  import FApp from '../stores/firebase'

  export default {
    name: 'Index',

    mixins: [SMembersMixin],

    created() {
      SMembers.fdi()

      // Manually load the whole /SPECIAL-October1st
      this.special = FApp.database().ref('/SPECIAL-October1st')
      this.special.on('value', (snapshot) => {
        const tree = snapshot.val()
        this.loaded = true

        if (tree !== null) {
          this.specialTreeRegistrations = tree.registrations || {}
          this.specialTreePayments = tree.payments || {}
        }
      })
    },

    destroyed() {
      this.special.off()
    },

    data() {
      return {
        moment: moment,

        loaded: false,
        specialTreeRegistrations: {},
        specialTreePayments: {},

        showRegistrationForm: false,
        showSubForm: false,

        subFormData: {
          name: '',
          wantsTransportation: false,
          isChurchMember: false,
          isSabbathSchoolMember: false
        },
        subFormSelectedIndex: -1,

        registrationFromForm: [
          /*

          {
            memberId: '', // This will be the first, registered member
            wantsTransportation: false,
            isChurchMember: false,
            isSabbathSchoolMember: false
          },

          {
            name: '', // Subsequent registrants
            wantsTransportation: false,
            isChurchMember: false,
            isSabbathSchoolMember: false
          },

          */
        ]
      }
    },

    computed: {
      memberHasName() {
        return SAuth.state.memberProfile && SAuth.state.memberProfile.name
      },

      selfInSubform() {
        const self = SAuth.state.user
        if (self) {
          let yes = false
          _.forEach(this.registrationFromForm, reg => {
            if (reg.memberId === self.uid) {
              yes = true
              return false
            }
          })
          return yes
        }
        return false
      },

      subFormTotalFees() {
        let total = 0
        _.forEach(this.registrationFromForm, reg => {
          if (!reg.isChurchMember && !reg.isSabbathSchoolMember) {
            total += 2000
            if (reg.wantsTransportation)
              total += 4000
          }
        })
        return total
      },

      userRegistration() {
        const self = SAuth.state.user
        if (self) {
          return this.specialTreeRegistrations[self.uid]
        }
        return null
      },

      userPayments() {
        const self = SAuth.state.user
        if (self) {
          const info = {
            due: 0,
            paid: 0,
            payments: this.specialTreePayments[self.uid] || []
          }
          _.forEach(info.payments, p => {
            info.paid += p
          })
          _.forEach(_.get(this.specialTreeRegistrations, [self.uid, 'details']), reg => {
            if (!reg.isChurchMember && !reg.isSabbathSchoolMember) {
              info.due += 2000
              if (reg.wantsTransportation)
                info.due += 4000
            }
          })
          return info
        }
        return {
          due: 0,
          paid: 0,
          payments: []
        }
      }
    },

    methods: {
      addPersonToSubform() {
        const registration = _.clone(this.subFormData)
        if (!this.selfInSubform) {
          // First registration, must be the registered member
          registration.memberId = SAuth.state.user.uid
          delete registration.name
        } else {
          // Remove memberId
          delete registration.memberId
        }

        if (registration.memberId)
          this.registrationFromForm.unshift(registration)
        else
          this.registrationFromForm.push(registration)

        this.subFormData = {
          name: '',
          wantsTransportation: false,
          isChurchMember: false,
          isSabbathSchoolMember: false
        }
        this.showSubForm = false
      },

      removePersonFromSubform() {
        this.registrationFromForm.splice(this.subFormSelectedIndex, 1)
        this.subFormSelectedIndex = -1
      },

      async confirmRegistration() {
        const memberId = SAuth.state.user.uid
        if (memberId) {
          const fixation = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            details: this.registrationFromForm
          }
          await FApp.database().ref(`/SPECIAL-October1st/registrations/${memberId}`).set(fixation)

          // Reset
          this.showSubForm = false
          this.showRegistrationForm = false
          this.registrationFromForm = []
        }
      }
    }
  }
</script>

<style>
</style>
