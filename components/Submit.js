import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import {
  CATEGORIES,
  CATEGORYADD,
  categoriesLoading,
} from './commons/Categories'

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

export const SubmissionFragment = gql`
  fragment SubmissionFragment on Submission {
    id
    content {
      type
      url
      title
      description
      teaser_image_url
    }
    category {
      id
      title
    }
    user {
      id
      username
    }
    date_posted
    comment
    stage
    votes
    meHasVoted
  }
`

const SUBMIT = gql`
  mutation submit($comment: String, $url: String!, $category_id: ID!) {
    submit(comment: $comment, url: $url, category_id: $category_id) {
      ...SubmissionFragment
    }
  }

  ${SubmissionFragment}
`

const filter = createFilterOptions()

const Submit = (props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  })
  const router = useRouter()
  const { loading, data = {}, refetch } = useQuery(CATEGORIES)
  const categories = data.categories || categoriesLoading

  const [categoryAdd, { loading: addLoading, error: addError }] = useMutation(
    CATEGORYADD,
    {
      errorPolicy: 'all',

      update(cache, { data: { categoryAdd } }) {
        cache.modify({
          fields: {
            categories(existingCategories = []) {
              const newCategoryRef = cache.writeFragment({
                data: categoryAdd,
                fragment: gql`
                  fragment NewCategory on Category {
                    id
                    title
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
      onCompleted(data) {
        alert('Thank you so much for sharing!')
        router.push('/')
      },
    },
  )

  if (props.submitLoading) {
    return <LinearProgress variant="query" />
  }

  const onSubmit = handleSubmit((variables) => {
    console.log(variables)
    submit({
      variables: {
        comment: variables.comment,
        url: variables.url,
        category_id: variables.category.id,
      },
    })
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
          required: 'We do need a valid web address to continue.',
          pattern: /^https?\:\/\//i,
        })}
        error={!!errors.url}
        helperText={
          errors.url ? 'We do need a valid web address to continue.' : ''
        }
      />
      <Controller
        name="category"
        control={control}
        rules={{
          required:
            'What category does this content belong to? You can add a new one',
        }}
        render={({ field }) => (
          <Autocomplete
            color="inherit"
            value={field.value}
            disabled={addLoading}
            onChange={(event, newValue) => {
              console.log(newValue)
              if (typeof newValue === 'string') {
                field.onChange({ title: newValue, id: undefined })
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                field.onChange({ title: newValue.inputValue, id: undefined })
              } else {
                field.onChange(newValue)
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
                // setAddValue(option.inputValue)
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
      />

      {errors.category && (
        <p>What category does this content belong to? You can add a new one</p>
      )}
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
