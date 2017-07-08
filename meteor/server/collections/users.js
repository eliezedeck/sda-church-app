import {Meteor} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'


/*
 ╔═╗┌─┐┬ ┬┌─┐┌┬┐┌─┐
 ╚═╗│  ├─┤├┤ │││├─┤
 ╚═╝└─┘┴ ┴└─┘┴ ┴┴ ┴
 */

const profileSchema = new SimpleSchema({
  fullName: {
    type: String,
    max: 35
  },
  displayName: {
    type: String,
    index: true,
    unique: true,
    max: 15
  }
})

const documentSchema = new SimpleSchema({
  username: {
    type: String,
    min: 2,
    max: 16,
    index: true,
    unique: true,
    optional: true,
    denyUpdate: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  profile: {
    type: profileSchema,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  }
}, {
  clean: {
    filter: true,
    autoConvert: true,
    removeEmptyStrings: false,
    trimStrings: true,
    getAutoValues: true,
    removeNullsFromArrays: false,
  },
})

Meteor.users.attachSchema(documentSchema, {transform: false})


/*
 ╔╦╗┌─┐┌┬┐┬ ┬┌─┐┌┬┐┌─┐
 ║║║├┤  │ ├─┤│ │ ││└─┐
 ╩ ╩└─┘ ┴ ┴ ┴└─┘─┴┘└─┘
 */

Meteor.methods({
  'users.authorizeAndUpdateName': function ({id, doc}) { //
    if (!Roles.userIsInRole(this.userId, ['admin', 'zedeck']))
      throw new Meteor.Error(403, "You are not authorized")

    new SimpleSchema({
      id: {
        type: String,
        min: 17,
        max: 17
      },
      doc: {
        type: documentSchema
      }
    }).validate({
      id,
      doc
    })

    try {
      return Meteor.users.update(id, {
        $set: doc
      })
    } catch (e) {
      throw new Meteor.Error(400, e.message)
    }
  }
})


/*
 ╔═╗ ┬ ┬┌─┐┬─┐┬ ┬
 ║═╬╗│ │├┤ ├┬┘└┬┘
 ╚═╝╚└─┘└─┘┴└─ ┴ 
*/



/*
 ╔═╗┬ ┬┌┐ ┬  ┬┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
 ╠═╝│ │├┴┐│  ││  ├─┤ │ ││ ││││└─┐
 ╩  └─┘└─┘┴─┘┴└─┘┴ ┴ ┴ ┴└─┘┘└┘└─┘
 */

Meteor.publish('users.all', function () { //
  if (Roles.userIsInRole(this.userId, ['admin', 'zedeck'])) {
    return Meteor.users.find({}, {
      sort: {
        'profile.displayName': 1
      },
      fields: {
        roles: 1,
        username: 1,
        profile: 1
      }
    })
  }

  return this.ready()
})

Meteor.publish('users.limited', function () { //
  if (Roles.userIsInRole(this.userId, ['member'])) {
    return Meteor.users.find({}, {
      sort: {
        'profile.displayName': 1
      },
      fields: {
        username: 1,
        profile: 1
      }
    })
  }

  return this.ready()
})



export default Meteor.users
