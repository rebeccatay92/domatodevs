const jwt = require('jsonwebtoken')

export function retrieveToken () {
  var payload = {
    'iss': 'domatodevs@neon-rex-186905.iam.gserviceaccount.com',
    'scope': 'https://www.googleapis.com/auth/cloud-platform',
    'aud': 'https://www.googleapis.com/oauth2/v4/token',
    'exp': (Date.now() / 1000) + 3600,
    'iat': Date.now() / 1000
  }

  var token = jwt.sign(payload, process.env.REACT_APP_OAUTH_PRIVATE_KEY, {algorithm: 'RS256'})

  var dataString = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${token}`

  // using jwt to fetch api token from oauth endpoint
  return new Promise((resolve, reject) => {
    fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: dataString
    })
    .then(response => {
      return response.json()
    })
    .then(json => {
      var apiToken = json.access_token
      // console.log('apiToken from fetch', apiToken)
      return resolve({
        expiry: payload.exp,
        token: apiToken
      })
    })
    .catch(err => {
      console.log(err)
    })
  })
}

export function removeAllAttachments (attachments, apiToken) {
  attachments.forEach(info => {
    var uri = info.fileName.replace('/', '%2F')
    var uriBase = process.env.REACT_APP_CLOUD_DELETE_URI
    var uriFull = uriBase + uri

    fetch(uriFull, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    })
    .then(response => {
      console.log(response)
      if (response.status === 204) {
        console.log('delete from cloud storage succeeded')
      }
    })
    .catch(err => console.log(err))
  })
}
