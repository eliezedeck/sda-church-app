import React, {Component} from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'


class Post extends Component {
  render () {
    return (
      <div className='pa3 bg-black-05 ma3'>
        <div
          className='w-100'
          style={{
            backgroundImage: `url(${this.props.post.imageUrl})`,
            backgroundSize: 'cover',
            paddingBottom: '100%',
          }}
        />
        <div className='pt3'>
          {this.props.post.description}&nbsp;
          <span className='red f6 pointer dim' onClick={this.handleDelete}>Delete</span>
        </div>
      </div>
    )
  }

  handleDelete = async () => {
    const start = new Date()
    await this.props.mutate({variables: {id: this.props.post.id}})
    console.log(`Delete operation took ${new Date() - start}`)
  }
}


const deleteMutation = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`

export default graphql(deleteMutation)(Post)
