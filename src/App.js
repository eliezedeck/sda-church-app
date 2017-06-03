import React, { Component } from 'react'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Welcome to React ...</h1>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <div id="content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default App
