import React, {Component} from 'react'
import {withRouter} from 'react-router'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'


class CreatePage extends Component {
  state = {
    description: '',
    imageUrl: '',
  }

  handlePost = async () => {
    const start = new Date()
    const {description, imageUrl} = this.state
    await this.props.addPost({ description, imageUrl })
    console.log(`addPost took ${new Date() - start} ms`)
    this.props.history.push('/')
  }

  render () {
    return (
      <div className='w-100 pa4 flex justify-center'>
        <div style={{ maxWidth: 400 }} className=''>
          <input
            className='w-100 pa3 mv2'
            value={this.state.description}
            placeholder='Description'
            onChange={(e) => this.setState({description: e.target.value})}
          />
          <input
            className='w-100 pa3 mv2'
            value={this.state.imageUrl}
            placeholder='Image Url'
            onChange={(e) => this.setState({imageUrl: e.target.value})}
          />
          {this.state.imageUrl &&
          <img src={this.state.imageUrl} alt='presentation' className='w-100 mv3' />
          }
          {this.state.description && this.state.imageUrl &&
          <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this.handlePost}>Post</button>
          }
        </div>
      </div>
    )
  }
}

const addMutation = gql`
  mutation addPost($description: String!, $imageUrl: String!) {
    createPost(description: $description, imageUrl: $imageUrl) {
      id
      description
      imageUrl
    }
  }
`


export default graphql(addMutation, {
  props: ({ ownProps, mutate }) => ({
    addPost: ({ description, imageUrl }) =>
      mutate({
        variables: { description, imageUrl },
      })
  })
})(withRouter(CreatePage))