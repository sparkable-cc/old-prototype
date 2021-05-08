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
        label="Your email address"
        {...register('email', {
          required: 'An email address is utmostly required ☝️',
          validate: (value) =>
            isEmail(value) || 'Well, that does not look like an email address.',
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
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
              "Your username shouldn't be an email address  ☝️",
            isAlphanumeric: (value) =>
              isAlphanumeric(value) ||
              'Your username is way to fancy. Remove spaces or odd chars  ☝️',
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
        disabled={signupLoading}
      >
        Signup
      </Button>
      {signupLoading && <LinearProgress variant="query" />}
      <MutationError
        title="Sign up failed misarably"
        content="For some reason, it failed. You may want to give it another shot."
        apolloError={signupError}
      />
    </form>
  )
}

export default withMe(AuthSignup)
