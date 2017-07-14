import {Meteor} from 'meteor/meteor'
import PrayerRequestCommentsCollection from '../collections/prayerRequestComments'
import SimpleSchema from 'simpl-schema'
import {ERROR_REQUIRES_MEMBER_ROLE} from '../errors'

/*
 ╔═╗┌─┐┬ ┬┌─┐┌┬┐┌─┐
 ╚═╗│  ├─┤├┤ │││├─┤
 ╚═╝└─┘┴ ┴└─┘┴ ┴┴ ┴
 */

const documentSchema = new SimpleSchema({
  prayerRequestId: {
    type: String,
    min: 17,
    max: 17
  },

  content: {
    type: String,
    min: 4,
    max: 4096
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
    denyUpdate: true
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

PrayerRequestCommentsCollection.attachSchema(documentSchema, {transform: false})


/*
 ╔╦╗┌─┐┌┬┐┬ ┬┌─┐┌┬┐┌─┐
 ║║║├┤  │ ├─┤│ │ ││└─┐
 ╩ ╩└─┘ ┴ ┴ ┴└─┘─┴┘└─┘
 */

Meteor.methods({
  'prayerRequestComments.add'(params) {
    try {
      // Input
      new SimpleSchema({
        doc: {
          type: documentSchema
        }
      }).validate(params)
      const {doc} = params

      // Validations
      if (!Roles.userIsInRole(this.userId, ['member']))
        throw ERROR_REQUIRES_MEMBER_ROLE

      // Transform
      doc.createdBy = this.userId
      doc.createdAt = new Date()

      return PrayerRequestCommentsCollection.insert(doc)
    } catch (e) {
      if (e instanceof Meteor.Error)
        throw e
      throw new Meteor.Error(400, e.message)
    }
  }
})


/*
 ╔═╗┬ ┬┌┐ ┬  ┬┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
 ╠═╝│ │├┴┐│  ││  ├─┤ │ ││ ││││└─┐
 ╩  └─┘└─┘┴─┘┴└─┘┴ ┴ ┴ ┴└─┘┘└┘└─┘
 */

Meteor.publish('prayerRequestComments.forPrayerId', function (params) { //
  if (Roles.userIsInRole(this.userId, ['member'])) {
    new SimpleSchema({
      prayerRequestId: {
        type: String,
        min: 17,
        max: 17
      }
    }).validate(params)

    const {prayerRequestId} = params
    return PrayerRequestCommentsCollection.find({prayerRequestId}, {
      limit: 40
    })
  }

  return this.ready()
})

