// import 'es6-shim'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

// redux store, apollo client
import { store, client } from './store.js'

import { ApolloProvider } from 'react-apollo'

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>
  , document.getElementById('root')
)
registerServiceWorker()
