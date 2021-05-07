import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { gql, useMutation } from '@apollo/client'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'

import withMe, { queryWithMe, MeFragment } from '../../libs/withMe'
import MutationError from '../../components/commons/MutationError'

const LOGIN = gql`
  mutation login($code: String!, $name: String!) {
    login(code: $code, name: $name) {
      ...MeFragment
    }
  }

  ${MeFragment}
`

const AuthLogin = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const router = useRouter()

  useEffect(() => {
    if (props.me) {
      router.push('/')
    }
  }, [props.me])

  const [login, { loading: loginLoading, error: loginError }] = useMutation(
    LOGIN,
    {
      errorPolicy: 'all',
      update: (cache, { data: { login: me } }) => {
        cache.writeQuery({
          query: queryWithMe,
          data: { me },
        })
      },
    },
  )

  if (props.me || props.meLoading) {
    return <LinearProgress variant="query" />
  }

  const onSubmit = handleSubmit((variables) => {
    login({ variables })
  })

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Abo- oder Zugangscode"
        {...register('code', {
          required: 'Abo- oder Zugangscode ist zwingend erforderlich.',
          pattern: {
            value: /^([A-Za-z0-9]{6})$/,
            message:
              'Keinen Abo- oder Zugangscode erkannt. Bitte prüfen Sie Ihre Eingabe.',
          },
        })}
        error={!!errors.code}
        helperText={errors.code?.message}
      />
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Familien- oder Firmenname"
        {...register('name', {
          required: 'Familien- oder Firmenname ist zwingend erforderlich.',
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <Button
        size="large"
        variant="contained"
        color="primary"
        type="submit"
        disabled={loginLoading}
      >
        Anmelden
      </Button>
      {loginLoading && <LinearProgress variant="query" />}
      <MutationError
        title="Anmeldefehler"
        content="Daten nicht gefunden. Bitte prüfen Sie Ihre Eingaben und versuchen Sie es erneut."
        apolloError={loginError}
      />
    </form>
  )
}

export default withMe(AuthLogin)
