import { useState, useEffect } from 'react'
import { gql, useMutation, useApolloClient } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { isIE } from 'react-device-detect'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import { cdnify } from '../libs/utils'
import MutationError from '../components/commons/MutationError'
import withMe, { queryWithMe } from '../libs/withMe'
import Layout from '../components/Layout'

import styles from './index.module.css'

const LOGOUT = gql`
mutation logout {
  logout
}
`

const IndexPage = props => {
  const { register, handleSubmit, errors } = useForm()
  const apolloClient = useApolloClient()

  const [logout] = useMutation(
    LOGOUT,
    {
      errorPolicy: 'all',
      update: (cache, { data: { login: me } }) => {
        cache.writeQuery({
          query: queryWithMe,
          data: { me: null }
        })

        apolloClient.resetStore()
      }
    }
  )

  const onLogout = () => {
    logout()
  }

  if (props.meLoading) {
    return (
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
      >
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <img
            className={styles.logo}
            style={{ filter: 'blur(4px)' }}
          />
        </Grid>
      </Grid>
    )
  }

  if (props.me) {
    return (
      <Layout>
        <p>Hello Rejoha!</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <p>Hello Rejoha!</p>
    </Layout>
  )
}

export default withMe(IndexPage)
