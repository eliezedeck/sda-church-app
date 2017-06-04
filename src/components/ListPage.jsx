import _ from 'lodash'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import Post from '../components/Post'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'


class ListPage extends Component {
  componentWillReceiveProps(newProps) {
    if (!newProps.posts.loading) {
      if (this.subscription) {
        if (newProps.posts !== this.props.posts) {
          // changed, we need to unsubscribe before resubscribing
          this.subscription.unsubscribe()
        } else {
          // we already have an active subscription with the right params
          return
        }
      }

      this.subscription = newProps.posts.subscribeToMore({
        document: POSTS_SUBSCRIPTION,
        updateQuery: (previousResult, { subscriptionData }) => {
          console.log(subscriptionData)
          const newResult = _.cloneDeep(previousResult); // never mutate state!
          return newResult
        },
        onError: (err) => console.error(err),
      })
    }
  }
  
  render() {
    if (this.props.posts.loading) {
      return (<div>Loading</div>)
    }

    return (
      <div className='w-100 flex justify-center'>
        <Link to='/create' className='fixed bg-white top-0 right-0 pa4 ttu dim black no-underline'>
          + New Post
        </Link>
        <div className='w-100' style={{ maxWidth: 400 }}>
          {this.props.posts.allPosts.map((post) =>
            <Post key={post.id} post={post} refresh={() => this.props.data.refetch()} />
          )}
        </div>
      </div>
    )
  }
}

const POST_QUERY = gql`query allPosts {
  allPosts(orderBy: createdAt_DESC) {
    id
    imageUrl
    description
  }
}`

const POSTS_SUBSCRIPTION = gql`subscription {
  Post {
    mutation
    node {
      id
      imageUrl
      description
    }
  }
} 
`

const withData = graphql(POST_QUERY, {
  name: 'posts'
})

export default withData(ListPage)
