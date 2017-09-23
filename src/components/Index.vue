<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1 class="text-center">October 1st &mdash; <strong>Church Picnic</strong></h1></div>
      <div class="col-md-12">
        <div v-if="user && memberHasName && !showRegistrationForm && !userRegistration" role="group" class="btn-group btn-group-justified">
          <a @click.prevent="showRegistrationForm = true" class="btn btn-primary btn-lg" role="button" href="#">
            <i class="glyphicon glyphicon-bell"></i> Register today
          </a>
        </div>

        <p v-if="userRegistration" class="lead text-center bg-success">You are registered.</p>

        <p v-if="!memberHasName && user" class="lead text-center">You must update your Profile with your name before you can register. To do so, click <router-link to="/profile">here</router-link>.</p>
        <p v-if="!user" class="lead text-center">You must register your name and phone number in order to participate in this event. To do so, click <router-link to="/login">here</router-link>.</p>

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
                    <template v-if="!selfInSubform && !editMode">Register myself</template>
                    <template v-else>Register another person</template>
                  </button>
                  <button :disabled="subFormSelectedIndex === -1" @click="removePersonFromSubform"
                          class="btn btn-danger" type="button">Remove</button>
                </div>

                <div id="subForm" v-if="showSubForm" class="well well-sm" style="background-color:rgb(235,235,235);">
                  <div v-if="selfInSubform || editMode" class="form-group">
                    <label class="control-label">Short-name of the person</label>
                    <input v-model="subFormData.name" type="text" placeholder="(mandatory)" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="control-label">Select the appropriate age</label>
                    <div class="radio">
                      <label class="control-label">
                        <input v-model="subFormData.mustPayEntryFee" :value="false" name="yearCategory" type="radio" />Less than 5 years old</label>
                    </div>
                    <div class="radio">
                      <label class="control-label">
                        <input v-model="subFormData.mustPayEntryFee" :value="true" name="yearCategory" type="radio" />5 years or Older</label>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="control-label">Please check what applies</label>
                    <div class="checkbox">
                      <label class="control-label">
                        <input v-model="subFormData.wantsTransportation" type="checkbox" />Will go with the <strong>Common Transportation Bus</strong> (don't have own Car/Transportation)</label>
                    </div>
                    <div class="checkbox">
                      <label class="control-label">
                        <input v-model="subFormData.isChurchMember" type="checkbox" />Church member</label>
                    </div>
                    <div class="checkbox">
                      <label class="control-label">
                        <input v-model="subFormData.isSabbathSchoolMember" type="checkbox" />Sabbath School member</label>
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
                        <span v-else>{{(registration.mustPayEntryFee ? 2000 : 0) + (registration.wantsTransportation ? 4000 : 0)}} Ar</span>
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
                  <button @click.prevent.stop="confirmRegistration" :disabled="!selfInSubform && !editMode"
                          class="btn btn-primary" type="button"><i class="glyphicon glyphicon-ok"></i> Confirm registration</button>
                  <button @click="showRegistrationForm = false, showSubForm = false" class="btn btn-default" type="button">Cancel registration</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <p v-if="userPayments.due - userPayments.paid > 0" class="lead text-center bg-danger">But you need to pay the fees, remaining <strong>{{userPayments.due - userPayments.paid}}</strong> Ar (of {{userPayments.due}} Ar). Remember, the deadline is on Wednesday.</p>
      </div>

      <div v-if="user && memberHasName" class="col-md-12">
        <h4>Here are the list of those who are going ...</h4>
        <p>Those who registered first will enter first in the Transportation and when we arrive.</p>

        <div v-if="canManagePayments" class="well well-sm">
          <form>
            <div class="form-group">
              <label class="control-label">Amount</label>
              <input v-model.number="paymentFormAmount" type="text" class="form-control" />
            </div>
            <div role="group" class="btn-group">
              <button @click="addPayment" :disabled="paymentFormAmount === 0 || registrationSelected === ''" class="btn btn-primary" type="button">Add</button>
            </div>
          </form>
        </div>

        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
            <tr>
              <th>Registration by</th>
              <th>Names</th>

              <th>Entry fees</th>
              <th>Common Bus Transportation</th>

              <th v-if="canManagePayments">Due</th>
            </tr>
            </thead>
            <tbody>

            <tr v-if="!loaded">
              <td colspan="100" class="text-center">
                <i class="glyphicon glyphicon-refresh glyphicon-loading-animate"></i>&nbsp;&nbsp;Loading ...
              </td>
            </tr>

            <tr v-else
                v-for="row in processedRegistrationTree.iterable" :key="row.memberId"
                @click="registrationSelected = row.memberId"
                :class="{active: registrationSelected === row.memberId}">
              <td>
                {{memberName(row.memberId)}}

                <span v-if="user && (user.uid === 'm2WyJpeiDtgjxXdeqnt83I3HSiF2')">({{membersLookup(row.memberId).phoneNumber}})</span>

                <span v-if="user && (user.uid === row.memberId || user.uid === 'm2WyJpeiDtgjxXdeqnt83I3HSiF2')">
                  &mdash;
                  <a v-if="user.uid === 'm2WyJpeiDtgjxXdeqnt83I3HSiF2'" @click.prevent="editRegistration" href="#" class="text-warning"><i class="glyphicon glyphicon-pencil"></i> Edit</a>
                  <a @click.prevent="deleteOwnRegistration" href="#" class="text-danger"><i class="glyphicon glyphicon-trash"></i> Remove</a>
                </span>

                <div>
                  <small>({{moment(row.timestamp).format('Do MMMM, HH:mm:ss')}})</small>
                </div>
              </td>
              <td>
                <ol style="margin-bottom: 0">
                  <li v-for="reg in row.details">
                    <span v-if="reg.memberId"><strong>{{memberName(reg.memberId)}}</strong></span>
                    <span v-else><strong>{{reg.name}}</strong></span>
                  </li>
                </ol>
              </td>

              <td>
                <ul style="margin-bottom: 0">
                  <li v-for="reg in row.details">
                    <span v-if="reg.mustPayEntryFee && (reg.isChurchMember || reg.isSabbathSchoolMember)" class="text-success">(Church)</span>
                    <span v-if="reg.mustPayEntryFee && (!reg.isChurchMember && !reg.isSabbathSchoolMember)">2000 Ar</span>
                  </li>
                </ul>
              </td>
              <td>
                <ul style="margin-bottom: 0">
                  <li v-for="reg in row.details">
                    <span v-if="reg.wantsTransportation && (reg.isChurchMember || reg.isSabbathSchoolMember)" class="text-success">(Church)</span>
                    <span v-if="reg.wantsTransportation && (!reg.isChurchMember && !reg.isSabbathSchoolMember)">4000 Ar</span>
                  </li>
                </ul>
              </td>

              <td>
                <span v-if="row.totalDue > 0" class="text-danger">{{row.totalDue}} Ar</span>
              </td>
            </tr>
            </tbody>

            <tfoot>
            <tr>
              <td>TOTAL</td>
              <td>{{processedRegistrationTree.totalRegistrantsCount}} registrants</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            </tfoot>

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
        } else {
          this.specialTreeRegistrations = {}
          this.specialTreePayments = {}
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
          mustPayEntryFee: true,
          wantsTransportation: false,
          isChurchMember: false,
          isSabbathSchoolMember: false
        },
        subFormSelectedIndex: -1,

        paymentFormAmount: 0,

        editMode: false,
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
        ],

        registrationSelected: ''
      }
    },

    watch: {
      registrationSelected() {
        console.log(`Selected registration by ${this.registrationSelected}`)
      }
    },

    computed: {
      user() {
        return SAuth.state.user
      },

      canManagePayments() {
        return _.get(SAuth.state, 'user.uid', '') === 'm2WyJpeiDtgjxXdeqnt83I3HSiF2'
      },

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
            if (reg.mustPayEntryFee)
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
              if (reg.mustPayEntryFee)
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
      },

      processedRegistrationTree() {
        const data = {
          totalRegistrantsCount: 0
        }

        data.iterable = _.map(this.specialTreeRegistrations, (node, memberId) => {
          const reg = node.details
          const row = {
            details: reg,
            memberId,
            timestamp: node.timestamp,
            totalDue: 0
          }

          row.totalDue = this.computeRemainingDue(reg, memberId)
          data.totalRegistrantsCount += reg.length

          return row
        })

        return data
      }
    },

    methods: {
      addPersonToSubform() {
        const registration = _.clone(this.subFormData)
        if (!this.selfInSubform && !this.editMode) {
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
          mustPayEntryFee: true,
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
        if (window.confirm("Are you sure you have added everyone that will go with you?")) {
          const memberId = SAuth.state.user.uid
          if (memberId) {
            if (memberId === 'm2WyJpeiDtgjxXdeqnt83I3HSiF2' && this.editMode) {
              await FApp.database().ref(`/SPECIAL-October1st/registrations/${this.registrationSelected}/details`).set(this.registrationFromForm)
            }
            else {
              const fixation = {
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                details: this.registrationFromForm
              }
              await FApp.database().ref(`/SPECIAL-October1st/registrations/${memberId}`).set(fixation)
            }

            // Reset
            this.showSubForm = false
            this.showRegistrationForm = false
            this.registrationFromForm = []
            this.editMode = false
          }
        }
      },

      computeRemainingDue(registrationDetails, memberId) {
        let due = 0
        _.forEach(registrationDetails, reg => {
          if (!reg.isChurchMember && !reg.isSabbathSchoolMember) {
            if (reg.mustPayEntryFee)
              due += 2000
            if (reg.wantsTransportation)
              due += 4000
          }
        })
        _.forEach(_.get(this.specialTreePayments, memberId), p => {
          due -= p
        })
        return due
      },

      async addPayment() {
        const memberId = this.registrationSelected

        const registrationDetails = _.get(this.specialTreeRegistrations, [memberId, 'details'])
        let due = 0
        _.forEach(registrationDetails, reg => {
          if (!reg.isChurchMember && !reg.isSabbathSchoolMember) {
            if (reg.mustPayEntryFee)
              due += 2000
            if (reg.wantsTransportation)
              due += 4000
          }
        })

        const payments = _.get(this.specialTreePayments, [memberId])
        _.forEach(payments, p => {
          due -= p
        })

        if (due !== 0 && this.paymentFormAmount !== 0) {
          await FApp.database().ref(`/SPECIAL-October1st/payments/${memberId}`).push(this.paymentFormAmount)
          this.paymentFormAmount = 0
        }
      },

      async deleteOwnRegistration() {
        const memberId = SAuth.state.user.uid
        if (window.confirm("Are you sure you want to delete this Registration?")) {
          if (memberId === 'm2WyJpeiDtgjxXdeqnt83I3HSiF2') {
            await FApp.database().ref(`/SPECIAL-October1st/registrations/${this.registrationSelected}`).remove()
          } else {
            await FApp.database().ref(`/SPECIAL-October1st/registrations/${memberId}`).remove()
          }
          this.showSubForm = true
        }
      },

      async editRegistration() {
        const memberId = SAuth.state.user.uid
        let registrationDetails
        if (memberId === 'm2WyJpeiDtgjxXdeqnt83I3HSiF2')
          registrationDetails = _.get(this.specialTreeRegistrations, [this.registrationSelected, 'details'])
        else
          registrationDetails = _.get(this.specialTreeRegistrations, [memberId, 'details'])

        this.registrationFromForm = _.clone(registrationDetails)
        this.showRegistrationForm = true
        this.editMode = true
      }
    }
  }
</script>

<style>
</style>
