import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import ListPage from './components/ListPage'
import CreatePage from './components/CreatePage'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import ApolloClient, {createNetworkInterface} from 'apollo-client'
import {ApolloProvider} from 'react-apollo'
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws'


// Setup Apollo + Subscription
const wsClient = new SubscriptionClient(`wss://subscriptions.graph.cool/v1/cj3gqr4w6g8a601705165erav`, {
  reconnect: true,
})
const networkInterface = createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/cj3gqr4w6g8a601705165erav' })
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

// TODO: follow the guide at https://www.learnapollo.com/excursions/excursion-02 for caching + efficiency
const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: o => o.id
})


const rootEl = document.getElementById('root')
ReactDOM.render(
  (
    <ApolloProvider client={client}>
      <Router>
        <App>
          <Route exact path='/' component={ListPage} />
          <Route path='/create' component={CreatePage} />
        </App>
      </Router>
    </ApolloProvider>
  ),
  rootEl
)

registerServiceWorker()
