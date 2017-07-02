const fs = require('fs')
const path = require('path')
const {forEach, split, assign} = require('lodash')

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

function wildcard(name) {
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

function type(definitions) {
  let fieldsRules = {}
  let mandatoryFields = []

  forEach(definitions, (def, key) => {
    let rule = ''
    if ('type' in def) {
      if (def.type === 'bool' || def.type === 'boolean') {
        rule += `newData.isBoolean()`
      }
      else if (def.type === 'string') {
        rule += `newData.isString()`
        if ('min' in def)
          rule += ` && newData.val().length >= ${def.min}`
        if ('max' in def)
          rule += ` && newData.val().length <= ${def.max}`
      }
      else if (def.type === 'uid') {
        rule += `${requiresAuth()} && newData.isString() && newData.val().length === ${USER_ID_STRING_LENGTH}`
      }
      else if (def.type === 'user.uid') {
        rule += `${requiresAuth()} && newData.isString() && newData.val() === auth.uid`
      }
      else if (def.type === 'id') {
        rule += `newData.isString() && newData.val().length === ${ID_STRING_LENGTH}`
      }
      else if (def.type === 'timestamp' || def.type === 'number') {
        rule += `newData.isNumber()`
      }

      if (!def.optional) {
        mandatoryFields.push(key)
      }
      fieldsRules[key] = {
        '.validate': rule
      }
    }
  })

  fieldsRules['.validate'] = `newData.hasChildren(['${mandatoryFields.join("', '")}'])`
  fieldsRules['$other'] = {'.validate': false}
  return fieldsRules
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
      '.read': `${hasAnyRoles([ADMIN])} || ${wildcard('$uid').matchUserID()}`,

      $role: {
        '.validate': `newData.isBoolean() && ${wildcard('$role').inStringEnum(ROLES)}`,
        '.write': `${hasAnyRoles([ADMIN])}`
      }
    }
  },

  members: {
    '.read': `${hasProfile()}`,

    $uid: {
      '.write': `${wildcard('$uid').matchUserID()} || ${hasAnyRoles(['clerk', ADMIN])}`
    }
  },

  prayers: {
    '.read': hasProfile(),

    $prayer_id: assign(
      type({
        poster: {type: 'user.uid', optional: true},
        content: {type: 'string', min: 7, max: 4096},
        anonymous: {type: 'bool'},
        createdAt: {type: 'timestamp'}
      }),

      {
        '.write': operations({
          'create': `${hasProfile()} && ${child('poster', true).matchUserID()}`,
          'edit': `${child('poster').matchUserID()} || ${hasAnyRoles(['clerk', 'zedeck'])}`,
          'delete': `${child('poster').matchUserID()} || ${hasAnyRoles(['clerk', 'zedeck'])}`
        })
      }
    )
  },

  prayerViews: {
    '.read': hasProfile(),

    $prayer_id: {
      '.validate': `newData.isNumber()`,

      '.write': operations({
        'create': `${hasProfile()} && newData.val() === 1`,
        'edit': `${hasProfile()} && data.val() + 1 === newData.val()`,
        'delete': `false`
      })
    }
  },

  prayerComments: {
    '.read': hasProfile(),

    $prayer_id: assign(
      type({
        prayerId: {type: 'id'},
        content: {type: 'string', min: 3, max: 4096},
        createdBy: {type: 'uid'},
        createdAt: {type: 'timestamp'}
      }),

      {
        '.write': operations({
          'create': `${hasProfile()} && ${child('createdBy', true).matchUserID()}`,
          'edit': `false`,
          'delete': `${hasProfile()} || ${child('createdBy', false).matchUserID()} || ${hasAnyRoles(['clerk', ADMIN])}`
        })
      }
    )
  },

  membersPrayingForPrayerRequests: {
    $prayer_id: {
      '.read': hasProfile(),

      $uid: {
        '.validate': 'newData.isBoolean()',
        '.write': `${hasProfile()} && root.child('prayers').child($prayer_id).exists() && ${wildcard('$uid').matchUserID()}`,
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
