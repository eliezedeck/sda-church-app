import {Meteor} from 'meteor/meteor'
import PrayerRequestsCollection from '../collections/prayerRequests'
import SimpleSchema from 'simpl-schema'
import {ERROR_REQUIRES_MEMBER_ROLE} from '../errors'

/*
 ╔═╗┌─┐┬ ┬┌─┐┌┬┐┌─┐
 ╚═╗│  ├─┤├┤ │││├─┤
 ╚═╝└─┘┴ ┴└─┘┴ ┴┴ ┴
 */

const documentSchema = new SimpleSchema({
  content: {
    type: String,
    min: 4,
    max: 4096
  },

  anonymous: {
    type: Boolean
  },

  createdBy: {
    type: String,
    min: 17,
    max: 17,
    optional: true,
    denyUpdate: true
  },

  createdAt: {
    type: Date,
    optional: true,
    index: true, // index so we can sort by the most recent prayer request
  },

  viewsCount: {
    type: SimpleSchema.Integer,
    min: 0,
    optional: true
  }
}, {
  clean: {
    filter: true,
    autoConvert: true,
    removeEmptyStrings: false,
    trimStrings: true,
    removeNullsFromArrays: false,
  },
})

PrayerRequestsCollection.attachSchema(documentSchema, {transform: false})


/*
 ╔╦╗┌─┐┌┬┐┬ ┬┌─┐┌┬┐┌─┐
 ║║║├┤  │ ├─┤│ │ ││└─┐
 ╩ ╩└─┘ ┴ ┴ ┴└─┘─┴┘└─┘
 */

new ValidatedMethod({
  name: 'prayerRequests.add',
  validate: new SimpleSchema({
    doc: {
      type: documentSchema
    }
  }).validator(),
  run({ doc }) {
    if (!Roles.userIsInRole(this.userId, ['member']))
      throw new Meteor.Error(403, "Not authorized. Please ask an administrator to validate who you are.")

    // Override
    doc.viewsCount = 0
    doc.createdBy = this.userId
    doc.createdAt = new Date()
    if (doc.anonymous)
      delete doc.createdBy

    try {
      return PrayerRequestsCollection.insert(doc)
    } catch (e) {
      throw new Meteor.Error(400, e.message)
    }
  }
})

new ValidatedMethod({
  name: 'prayerRequests.update',
  validate: new SimpleSchema({
    id: {
      type: String,
      min: 17,
      max: 17
    },
    doc: {
      type: documentSchema
    }
  }).validator(),
  run({ id, doc }) {
    if (!Roles.userIsInRole(this.userId, ['member']))
      throw ERROR_REQUIRES_MEMBER_ROLE
    const pr = PrayerRequestsCollection.findOne(id)
    if (!pr)
      throw new Meteor.Error(400, "Prayer request not found")
    if (pr.anonymous)
      throw new Meteor.Error(403, "Not authorized. Anonymous prayer request.")
    if (this.userId !== pr.createdBy && !Roles.userIsInRole(this.userId, ['zedeck']))
      throw new Meteor.Error(403, "Not authorized. Prayer request doesn't belong to you.")

    // Override
    delete doc._id
    delete doc.viewsCount
    delete doc.createdBy
    delete doc.createdAt

    try {
      return PrayerRequestsCollection.update(id, {
        $set: doc
      })
    } catch (e) {
      throw new Meteor.Error(400, e.message)
    }
  }
})

Meteor.methods({
  'prayerRequests.delete'(params) {
    new SimpleSchema({
      id: {
        type: String,
        min: 17,
        max: 17
      }
    }).validate(params)

    const {id} = params
    const pr = PrayerRequestsCollection.findOne(id)
    if (!pr)
      throw new Meteor.Error(400, "Prayer request not found")
    if (pr.anonymous && !Roles.userIsInRole(this.userId, ['church-clerk', 'zedeck']))
      throw new Meteor.Error(403, "Not authorized. Anonymous prayer request.")
    if (this.userId !== pr.createdBy && !Roles.userIsInRole(this.userId, ['church-clerk', 'zedeck']))
      throw new Meteor.Error(403, "Not authorized. Prayer request doesn't belong to you.")

    try {
      return PrayerRequestsCollection.remove(id)
    } catch (e) {
      throw new Meteor.Error(400, e.message)
    }
  },

  'prayerRequests.incrementViews'(params) {
    try {
      new SimpleSchema({
        id: {
          type: String,
          min: 17,
          max: 17
        }
      }).validate(params)
    } catch (e) {
      throw new Meteor.Error(400, e.message)
    }

    const {id} = params

    if (!Roles.userIsInRole(this.userId, ['member']))
      throw new Meteor.Error(403, "Not authorized. Please ask an administrator to validate who you are.")

    try {
      PrayerRequestsCollection.update(id, {
        $inc: {
          viewsCount: 1 // increment
        }
      })
    } catch (e) {
      throw new Meteor.Error(400, e.message)
    }
  }
})


/*
 ╔═╗┬ ┬┌┐ ┬  ┬┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
 ╠═╝│ │├┴┐│  ││  ├─┤ │ ││ ││││└─┐
 ╩  └─┘└─┘┴─┘┴└─┘┴ ┴ ┴ ┴└─┘┘└┘└─┘
 */

Meteor.publish('prayerRequests.recent', function () { //
  if (Roles.userIsInRole(this.userId, ['member', 'admin', 'zedeck'])) {
    return PrayerRequestsCollection.find({}, {
      sort: {createdAt: -1},
      limit: 100
    })
  }

  return this.ready()
})
