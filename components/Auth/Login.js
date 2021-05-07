import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import isEmail from 'validator/lib/isEmail'
import isAlphanumeric from 'validator/lib/isAlphanumeric'

import { gql, useMutation } from '@apollo/client'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'

import withMe, { queryWithMe, MeFragment } from '../../libs/withMe'
import MutationError from '../../components/commons/MutationError'

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
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
        label="Your username"
        {...register('username', {
          required: 'No name, no user!',
          validate: {
            noEmail: (value) =>
              !isEmail(value) ||
              'Your username is very likely not an email address',
            isAlphanumeric: (value) =>
              isAlphanumeric(value) ||
              'Your username seems way to fancy. Too many spaces or odd chars in it?',
          },
        })}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Your password"
        type="password"
        {...register('password', {
          required: 'No word, no pass!',
          minLength: {
            value: 6,
            message: 'You will need at least need 6 chars.',
          },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        size="large"
        variant="contained"
        color="primary"
        type="submit"
        disabled={loginLoading}
      >
        Login
      </Button>
      {loginLoading && <LinearProgress variant="query" />}
      <MutationError
        title="Login failed misarably"
        content="For some reason, it failed. You may want to give it another shot."
        apolloError={loginError}
      />
    </form>
  )
}

export default withMe(AuthLogin)
