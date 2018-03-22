import Auth0Lock from 'auth0-lock'

// NEED TO MAKE THIS INTO A CLASS?
const options = {
  auth: {
    redirectUrl: 'http://localhost:3000/callback',
    audience: 'http://localhost:3001',
    autoParseHash: true,
    responseType: 'token id_token', // access_token, id_token
    params: {
      scope: 'openid profile email'
    }
  },
  autoclose: true
}
const lock = new Auth0Lock(
  'y7lfqtXJsvLJUfcsHASjBC5HfD2d8Jyl',
  'domatodevs.auth0.com',
  options
)

function login () {
  lock.show()
}

// WHERE IS MY ID TOKEN
lock.on('authenticated', function (authResult) {
  console.log('authResult', authResult)

  var accessToken = authResult.accessToken
  var idToken = authResult.idToken
  var decodedIdToken = authResult.idTokenPayload
})

export default lock
