import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { gql, useMutation } from '@apollo/client'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'

import withMe, { queryWithMe, MeFragment } from '../../libs/withMe'
import MutationError from '../../components/commons/MutationError'

const SIGNUP = gql`
  mutation signup($email: String!, $username: String!, $password: String!) {
    signup(email: $email, username: $username, password: $password) {
      ...MeFragment
    }
  }

  ${MeFragment}
`

const AuthSignup = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const router = useRouter()

  useEffect(() => {
    console.log({ me: props.me })
    if (props.me) {
      router.push('/')
    }
  }, [props.me])

  const [signup, { loading: signupLoading, error: signupError }] = useMutation(
    SIGNUP,
    {
      errorPolicy: 'all',
      update: (cache, { data: { signup: me } }) => {
        cache.writeQuery({
          query: queryWithMe,
          data: { me },
        })
      },
    },
  )

  if (props.me || props.signupLoading) {
    return <LinearProgress variant="query" />
  }

  const onSubmit = handleSubmit((variables) => {
    signup({ variables })
  })

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="E-Mail-Adresse"
        {...register('email', {
          required: 'E-Mail-Adresse zwingend erforderlich',
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Nutzername"
        {...register('username', {
          required: 'Nutzername zwingend erforderlich',
        })}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Passwort"
        {...register('password', {
          required: 'Passwort zwingend erforderlich',
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        size="large"
        variant="contained"
        color="primary"
        type="submit"
        disabled={signupLoading}
      >
        Anmelden
      </Button>
      {signupLoading && <LinearProgress variant="query" />}
      <MutationError
        title="Anmeldefehler"
        content="Das lief schief."
        apolloError={signupError}
      />
    </form>
  )
}

export default withMe(AuthSignup)
