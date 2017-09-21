<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1 class="text-center">October 1st &mdash; <strong>Church Picnic</strong></h1></div>
      <div class="col-md-12">
        <div v-if="memberHasName && !showRegistrationForm && !alreadyHasRegistration" role="group" class="btn-group btn-group-justified">
          <a @click.prevent="showRegistrationForm = true" class="btn btn-primary btn-lg" role="button" href="#">
            <i class="glyphicon glyphicon-bell"></i> Register today
          </a>
        </div>

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
                    <label class="control-label">Name of the person</label>
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
                        <span v-else><strong>{{2000 + (registration.wantsTransportation ? 4000 : 0)}}</strong> Ar</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <p class="text-danger">The fees must be paid on, or before Wednesday 27th of September 2017. If you miss this date, your registration will be removed.</p>
                <p class="text-danger">The Church is covering Transportation for one or more of the persons you have registered. Those must go with the Special Transportation on sunday, otherwise, you will pay the full Transportation fees of 4000 Ar per person.</p>
              </div>
              <div class="col-md-12">
                <div role="group" class="btn-group">
                  <button :disabled="!selfInSubform" class="btn btn-primary" type="button"><i class="glyphicon glyphicon-ok"></i> Finish + Confirm registration</button>
                  <button @click="showRegistrationForm = false, showSubForm = false" class="btn btn-default" type="button">Cancel registration</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <p class="lead text-center bg-danger">You need to pay the fees, totalling xxx Ar. Remember, the deadline is on Wednesday.</p>
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
            <tr>
              <td>Cell 1</td>
              <td>Cell 2</td>
              <td>Cell 2</td>
            </tr>
            <tr>
              <td>Cell 3</td>
              <td>Cell 2</td>
              <td>Cell 4</td>
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

  export default {
    name: 'Index',

    mixins: [SMembersMixin],

    created() {
      SMembers.fdi()
    },

    data() {
      return {
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

      alreadyHasRegistration() {
        return false
      }
    },

    methods: {
      addPersonToSubform() {
        const registration = _.clone(this.subFormData)
        console.log(this.selfInSubform)
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
      }
    }
  }
</script>

<style>
</style>
