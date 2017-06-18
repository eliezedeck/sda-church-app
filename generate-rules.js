const fs = require('fs')
const path = require('path')
const {forEach, split} = require('lodash')

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


function root(path) {
  let r = 'root'
  const path_components = split(path, '/')
  forEach(path_components, c => {
    if (c) {
      // component isn't empty
      if (c === 'auth.uid')
        r += `.child(${c})`
      else
        r += `.child('${c}')`
    }
  })
  return {
    matchUserID() {
      return `(${r}.val() === auth.uid)`
    },
    exists() {
      return `(${r}.exists())`
    }
  }
}

function requiresAuth() {
  return '(auth !== null)'
}

function hasProfile() {
  return `(${requiresAuth()} && ${root(PROFILES_NODE + '/auth.uid').exists()})`
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

function location(name) {
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

function child(name, newData) {
  let source = 'data'
  if (newData)
    source = 'newData'

  return {
    matchUserID() {
      return `(${requiresAuth()} && auth.uid === ${source}.child('${name}').val())`
    },

    equalToString(value) {
      return `(${source}.child('${name}').val() === '${value}')`
    },

    equalTo(value) {
      return `(${source}.child('${name}').val() === ${value})`
    },

    exists() {
      return `(${source}.child('${name}').exists())`
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

  return `(${r})`
}

function operations(rules) {
  let r = ''

  // Create
  if (rules.create)
    r += `(newData.exists() && !data.exists() && ${rules.create}) || `

  // Edit/modify
  if (rules.edit)
    r += `(newData.exists() && data.exists() && ${rules.edit}) || `

  // Delete
  if (rules.delete)
    r += `(!newData.exists() && data.exists() && ${rules.delete}) || `

  return `(${r.substr(0, r.length - 4)})`
}


const rules = {
  memberRoles: {
    $uid: {
      '.read': `${hasAnyRoles([ADMIN])} || ${location('$uid').matchUserID()}`,

      $role: {
        '.validate': `newData.isBoolean() && ${location('$role').inStringEnum(ROLES)}`,
        '.write': `${hasAnyRoles([ADMIN])}`
      }
    }
  },

  members: {
    '.read': `${hasProfile()}`,

    $uid: {
      '.write': `${location('$uid').matchUserID()} || ${hasAnyRoles(['clerk', ADMIN])}`
    }
  },

  prayers: {
    '.read': hasProfile(),

    $prayer_id: {
      '.validate': fields({
        poster: {type: 'user.uid', optional: true},
        content: {type: 'string', min: 7, max: 4096},
        anonymous: {type: 'bool'},
        createdAt: {type: 'timestamp'}
      }) + ` && ((${child('anonymous', true).equalTo('false')} && ${child('poster', true).exists()}) || ${child('anonymous', true).equalTo('true')})`,

      '.write': operations({
        'create': `${hasProfile()} && ${child('poster', true).matchUserID()}`,
        'edit': `${child('poster').matchUserID()} || ${hasAnyRoles(['clerk', 'zedeck'])}`,
        'delete': `${child('poster').matchUserID()} || ${hasAnyRoles(['clerk', 'zedeck'])}`
      })
    }
  },

  prayerViews: {
    // Listing
    '.read': hasProfile(),

    $prayer_id: {
      '.validate': `newData.isNumber()`,

      '.write': operations({
        'create': `${hasProfile()} && newData.val() === 1`,
        'edit': `${hasProfile()}`,
        'delete': `false`
      })
    }
  },

  prayerComments: {
    '.read': hasProfile(),

    $prayer_id: {
      '.validate': fields({
        prayerId: {type: 'id'},
        content: {type: 'string', min: 3, max: 4096},
        createdBy: {type: 'uid'},
        createdAt: {type: 'timestamp'}
      }),

      '.write': operations({
        'create': `${hasProfile()} && ${child('createdBy', true).matchUserID()}`,
        'edit': `false`,
        'delete': `${hasProfile()} || ${child('createdBy', false).matchUserID()} || ${hasAnyRoles(['clerk', ADMIN])}`
      })
    }
  },

  membersPrayingForPrayerRequests: {
    '.read': hasProfile(),

    $prayer_id: {
      $uid: {
        '.validate': 'newData.isBoolean()',
        '.write': `${hasProfile()} && root.child('prayers').child($prayer_id).exists() && ${location('$uid').matchUserID()}`,
      }
    }
  }
}

// Update rules
const output = JSON.stringify({
  rules
}, null, 2)
fs.writeFileSync(path.join(__dirname, 'database.rules.json'), output)
console.log(output)
