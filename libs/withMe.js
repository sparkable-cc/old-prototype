import React from 'react'
import { gql, useQuery } from '@apollo/client'

export const MeFragment = gql`
  fragment MeFragment on User {
    id
    username
    tokens
  }
`

export const queryWithMe = gql`
  query withMe {
    me {
      ...MeFragment
    }
  }

  ${MeFragment}
`

const withMe = (WrappedComponent) => (props) => {
  const { loading, data = {}, refetch } = useQuery(queryWithMe)
  const { me } = data

  return (
    <WrappedComponent
      me={me}
      meLoading={loading}
      meRefetch={refetch}
      {...props}
    />
  )
}

export default withMe
