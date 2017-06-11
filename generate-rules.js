const {forEach} = require('lodash')

const ID_STRING_LENGTH = 20
const PROFILES_NODE = 'members'
const ROLES_NODE = 'memberRoles'


function requiresAuth() {
  return '(auth !== null)'
}

function hasProfile() {
  return `(${requiresAuth()} && root.child('${PROFILES_NODE}').child(auth.uid).exists())`
}

function hasAnyRoles(roles) {
  if (Array.isArray(roles)) {
    let r = ''
    forEach(roles, role => {
      r += `root.child('${ROLES_NODE}').child(auth.uid).child('${role}').exists() || `
    })
    return `(${requiresAuth()} && (${r.substr(0, r.length - 4)}))`
  }
  return ''
}

function node(name) {
  return {
    mustMatchUID() {
      return `(${requiresAuth()} && (auth.uid === ${name}))`
    }
  }
}

function child(name) {
  return {
    mustMatchUID() {
      return `(${requiresAuth()} && auth.uid === data.child('${name}').val())`
    }
  }
}

function fields(definitions) {
  let r = ''
  let fields = []
  let fieldChecks = ''

  forEach(definitions, (def, key) => {
    let field = ''
    if ('type' in def) {
      if (def.type === 'bool' || def.type === 'boolean') {
        field += `newData.child('${key}').isBoolean()`
      }
      else if (def.type === 'string') {
        field += `newData.child('${key}').isString()`
        if ('min' in def)
          field += ` && newData.child('${key}').val().length >= ${def.min}`
        if ('max' in def)
          field += ` && newData.child('${key}').val().length <= ${def.max}`
      }
      else if (def.type === 'user.uid') {
        field += `${requiresAuth()} && newData.child('${key}').isString() && newData.child('${key}').val() === auth.uid`
      }
      else if (def.type === 'id') {
        field += `newData.child('${key}').isString() && newData.child('${key}').val().length === ${ID_STRING_LENGTH}`
      }
      else if (def.type === 'timestamp' || def.type === 'number') {
        field += `newData.child('${key}').isNumber()`
      }

      if (def.optional)
        field = `(newData.hasChild('${key}') && ${field}) || !newData.hasChild('${key}')`
      else
        fields.push(key)

      fieldChecks += `(${field}) && `
    }
  })

  r += `newData.hasChildren(['${fields.join("', '")}'])`
  if (fieldChecks)
    r += ` && ${fieldChecks.substr(0, fieldChecks.length - 4)}`

  return r
}

function operations(rules) {
  let r = ''

  // Create
  r += `(newData.exists() && !data.exists() && ${rules.create}) || `

  // Edit/modify
  r += `(newData.exists() && data.exists() && ${rules.edit} || `

  // Delete
  r += `(!newData.exists() && data.exists() && ${rules.delete}`

  return r
}


const rules = {
  members: {
    $member_id: {
      '.read': hasProfile(),
      '.write': `${node('$member_id').mustMatchUID()} || ${hasAnyRoles(['clerk', 'zedeck'])}`
    }
  },

  prayers: {
    $prayer_id: {
      '.validate': fields({
        views: {type: 'number'},
        poster: {type: 'user.uid'},
        content: {type: 'string', min: 7, max: 4096},
        anonymous: {type: 'bool', optional: true}
      })
    },

    // List of prayers
    '.read': hasProfile(),

    '.write': operations({
      'create': hasProfile(),
      'edit': child('$prayer_id').mustMatchUID(),
      'delete': child('$prayer_id').mustMatchUID()
    })
  },

  prayerComments: {
    $comments_id: {
      '.validate': fields({
        prayerId: {type: 'id'},
        content: {type: 'string', min: 3, max: 4096},
        createdBy: {type: 'user.uid'},
        createdAt: {type: 'timestamp'}
      }),

      '.write': operations({
        'create': hasProfile(),
        'edit': `${hasProfile()} && ${node('$comments_id').mustMatchUID()}`,
        'delete': `${hasProfile()} && ${node('$comments_id').mustMatchUID()}`
      })
    }
  }
}

console.log(JSON.stringify({
  rules
}, null, 2))
