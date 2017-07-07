import SuppliersCollection from '../collections/suppliers'
import SimpleSchema from 'simpl-schema'

/*
 ╔═╗┌─┐┬ ┬┌─┐┌┬┐┌─┐
 ╚═╗│  ├─┤├┤ │││├─┤
 ╚═╝└─┘┴ ┴└─┘┴ ┴┴ ┴
 */

const documentSchema = new SimpleSchema({
  name: {
    type: String,
    min: 2,
    max: 40
  },

  code: {
    type: String,
    min: 1,
    max: 40,
    index: true,
    unique: true,
  },

  articlesCount: {
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

SuppliersCollection.attachSchema(documentSchema, {transform: false})


/*
 ╔╦╗┌─┐┌┬┐┬ ┬┌─┐┌┬┐┌─┐
 ║║║├┤  │ ├─┤│ │ ││└─┐
 ╩ ╩└─┘ ┴ ┴ ┴└─┘─┴┘└─┘
 */

new ValidatedMethod({
  name: 'suppliers.add',
  validate: new SimpleSchema({
    doc: {
      type: documentSchema
    }
  }).validator(),
  run({ doc }) {
    if (!Roles.userIsInRole(this.userId, ['owner']))
      throw new Meteor.Error(403, "Vous n'êtes pas autorisé!")

    // Override
    doc.articlesCount = 0

    try {
      return SuppliersCollection.insert(doc)
    } catch (e) {
      throw new Meteor.Error(400, e.message)
    }
  }
})

new ValidatedMethod({
  name: 'suppliers.update',
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
    if (!Roles.userIsInRole(this.userId, ['owner']))
      throw new Meteor.Error(403, "Vous n'êtes pas autorisé!")

    // Override
    delete doc._id
    delete doc.articlesCount

    try {
      return SuppliersCollection.update(id, {
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

Meteor.publish('suppliers.all', function () { //
  if (Roles.userIsInRole(this.userId, ['seller', 'owner', 'zedeck'])) {
    return SuppliersCollection.find({}, {
      sort: {code: 1}
    })
  }

  return this.ready()
})
