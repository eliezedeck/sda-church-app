import {Meteor} from 'meteor/meteor'

/*
 ╔═╗┌─┐┬  ┬  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
 ║  │ ││  │  ├┤ │   │ ││ ││││
 ╚═╝└─┘┴─┘┴─┘└─┘└─┘ ┴ ┴└─┘┘└┘
 */

const PrayerRequestsCollection = new Meteor.Collection('prayerRequests')

export default PrayerRequestsCollection
