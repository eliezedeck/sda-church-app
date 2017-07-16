import {Meteor} from 'meteor/meteor'
/* TAG: i18n */


export const ERROR_UNAUTHORIZED = new Meteor.Error(403, "Not authorized.")
export const ERROR_REQUIRES_MEMBER_ROLE = new Meteor.Error(403, "Not authorized. Please ask an administrator to validate who you are.")
export const ERROR_NOT_YOURS = new Meteor.Error(403, "Not authorized. Resource does not belong to you.")