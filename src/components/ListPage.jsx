import _ from 'lodash'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import Post from '../components/Post'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'


const POSTS_SUBSCRIPTION = gql`subscription {
  Post {
    mutation
    node {
      id
      description
    }
    previousValues {
      id
    }
  }
}`


class ListPage extends Component {
  componentDidMount() {
    this.subscription = this.props.posts.subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      variables: null,
      updateQuery: (previousResult, { subscriptionData }) => {
        let newResult = _.cloneDeep(previousResult); // never mutate state!

        const sub = subscriptionData.data.Post
        if (sub.mutation === 'DELETED') {
          newResult.allPosts = _.filter(newResult.allPosts, e => e.id !== sub.previousValues.id)
        }

        return newResult
      }
    })
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
            <Post key={post.id} post={post} />
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

const withData = graphql(POST_QUERY, {
  name: 'posts'
})

export default withData(ListPage)
