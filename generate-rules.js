const {forEach} = require('lodash')

const ADMIN = 'zedeck'
const ID_STRING_LENGTH = 20
const USER_ID_STRING_LENGTH = 28
const PROFILES_NODE = 'members'
const ROLES_NODE = 'memberRoles'
const ROLES = [
  'clerk',
  'church_elder',
  'elder',
  'department_director',
  'department_secretary',
  'department_assistant'
]


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
    matchUserID() {
      return `(${requiresAuth()} && (auth.uid === ${name}))`
    },

    inStringEnum(list) {
      let r = ''
      forEach(list, e => { r += `${name} === '${e}' || ` })
      return `(${r.substr(0, r.length - 4)})`
    }
  }
}


function childData(name) {
  return {
    matchUserID() {
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
      else if (def.type === 'uid') {
        field += `${requiresAuth()} && newData.child('${key}').isString() && newData.child('${key}').val().length === ${USER_ID_STRING_LENGTH}`
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
  memberRoles: {
    $uid: {
      '.read': `${hasAnyRoles([ADMIN])} || ${node('$uid').matchUserID()}`,

      $role: {
        '.validate': `newData.isBoolean() && ${node('$role').inStringEnum(ROLES)}`,
        '.write': `${hasAnyRoles([ADMIN])}`
      }
    }
  },

  members: {
    $uid: {
      '.read': hasProfile(),
      '.write': `${node('$uid').matchUserID()} || ${hasAnyRoles(['clerk', ADMIN])}`
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

    '.read': hasProfile(),

    '.write': operations({
      'create': `${hasProfile()} && ${childData('poster').matchUserID()}`,
      'edit': childData('poster').matchUserID(),
      'delete': childData('poster').matchUserID()
    })
  },

  prayerComments: {
    '.read': hasProfile(),

    $comments_id: {
      '.validate': fields({
        prayerId: {type: 'id'},
        content: {type: 'string', min: 3, max: 4096},
        createdBy: {type: 'uid'},
        createdAt: {type: 'timestamp'}
      }),

      '.write': operations({
        'create': `${hasProfile()} && ${childData('createdBy').matchUserID()}`,
        'edit': `${hasProfile()} || ${hasAnyRoles(['clerk', ADMIN])}`,
        'delete': `${hasProfile()} || ${hasAnyRoles(['clerk', ADMIN])}`
      })
    }
  },

  membersPrayingForPrayerRequests: {
    '.read': hasProfile(),

    $prayer_id: {
      $uid: {
        '.validate': 'newData.isBoolean()',
        '.write': `${hasProfile()} && root.child('prayers').child($prayer_id).exists() && ${childData('$uid').matchUserID()}`,
      }
    }
  }
}

console.log(JSON.stringify({
  rules
}, null, 2))
