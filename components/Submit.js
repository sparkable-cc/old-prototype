import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'

import { gql, useMutation, useQuery } from '@apollo/client'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'

import withMe, { queryWithMe, MeFragment } from '../libs/withMe'
import MutationError from './commons/MutationError'
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete'

const SUBMIT = gql`
  mutation submit($email: String!, $username: String!, $password: String!) {
    signup(email: $email, username: $username, password: $password) {
      ...MeFragment
    }
  }
`

const CATEGORIES = gql`
  query categories {
    categories {
      id
      title
    }
  }
`

const CATEGORYADD = gql`
  mutation categoryAdd($title: String!) {
    categoryAdd(title: $title) {
      id
      title
    }
  }
`

const categoriesLoading = [{ title: 'Loading...', id: undefined }]

const filter = createFilterOptions()

const Submit = (props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const router = useRouter()
  const { loading, data = {}, refetch } = useQuery(CATEGORIES)
  const categories = data.categories || categoriesLoading

  const [categoryAdd, { loading: addLoading, error: addError }] = useMutation(
    CATEGORYADD,
    {
      errorPolicy: 'all',
      update(cache, { data: { categories } }) {
        cache.modify({
          fields: {
            categories(existingCategories = []) {
              const newCategoryRef = cache.writeFragment({
                data: categoryAdd,
                fragment: gql`
                  fragment NewCategory on Category {
                    id
                    type
                  }
                `,
              })
              return [...existingCategories, newCategoryRef]
            },
          },
        })
      },
    },
  )
  const [submit, { loading: submitLoading, error: submitError }] = useMutation(
    SUBMIT,
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

  if (props.signupLoading) {
    return <LinearProgress variant="query" />
  }

  const onSubmit = handleSubmit((variables) => {
    submit({ variables })
  })

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        placeholder="http://"
        label="URL"
        {...register('url', {
          required: 'We do need a web address (URL) to continue.',
        })}
        error={!!errors.url}
        helperText={errors.url?.message}
      />
      <Controller
        render={({ field }) => (
          <Autocomplete
            color="inherit"
            value={field.value}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                field.onChange(newValue)
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                field.onChange(newValue.inputValue)
              } else {
                field.onChange(newValue.inputValue)
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params)

              // Suggest the creation of a new value
              if (params.inputValue !== '') {
                filtered.push({
                  inputValue: params.inputValue,
                  title: `Add "${params.inputValue}"`,
                })
              }

              return filtered
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={categories}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                console.log('New Option!', option.inputValue)
                categoryAdd({ variables: { title: option.inputValue } })
                return option.inputValue
              }
              // Regular option
              return option.title
            }}
            renderOption={(option) => option.title}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Category" variant="outlined" />
            )}
          />
        )}
        name="category"
        onChange={([, data]) => data}
        control={control}
      />
      <Box mt={6}>
        Please tell us, why do you think this content is relevant for all of us:
      </Box>
      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        label="Comment"
        rows={3}
        {...register('comment', {
          required: 'Why do you think this content is relevant?',
        })}
        error={!!errors.comment}
        helperText={errors.comment?.message}
      />
      <Button
        size="large"
        variant="contained"
        color="primary"
        type="submit"
        disabled={submitLoading}
      >
        Submit this content
      </Button>
      {submitLoading && <LinearProgress variant="query" />}
      <MutationError
        title="Submission Error"
        content="Something went wrong 🐷"
        apolloError={submitError}
      />
    </form>
  )
}

export default withMe(Submit)
