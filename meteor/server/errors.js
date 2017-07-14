import {Meteor} from 'meteor/meteor'
/* TAG: i18n */


export const ERROR_REQUIRES_MEMBER_ROLE = new Meteor.Error(403, "Not authorized. Please ask an administrator to validate who you are.")
