import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { gql, useMutation, useApolloClient } from '@apollo/client'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'

import withMe, { queryWithMe, MeFragment } from '../../libs/withMe'
import MutationError from '../commons/MutationError'

const LOGOUT = gql`
  mutation logout {
    logout
  }
`

const AuthLogoutButton = ({ children, ...props }) => {
  const apolloClient = useApolloClient()

  const [logout] = useMutation(LOGOUT, {
    errorPolicy: 'all',
    update: (cache) => {
      cache.writeQuery({
        query: queryWithMe,
        data: { me: null },
      })

      apolloClient.resetStore()
    },
  })

  const onClick = () => {
    logout()
  }

  if (!props.me) {
    return null
  }

  return <span onClick={onClick}>{children}</span>
}

export default withMe(AuthLogoutButton)
