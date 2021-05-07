import { gql, useQuery } from '@apollo/client'
import { LinearProgress, Box, Grid } from '@material-ui/core'
import Categories from './commons/Categories'

import { SubmissionFragment } from './Submit'
import Submission from './Submission'
import { useState } from 'react'

export const SUBMISSIONS = gql`
  query submissions($stage: Stage, $category_id: ID) {
    submissions(stage: $stage, category_id: $category_id) {
      ...SubmissionFragment
    }
  }

  ${SubmissionFragment}
`

const Submissions = (props) => {
  const [state, setState] = useState('')
  const [category_id, setCategoryId] = useState('')
  return (
    <>
      <Box mb={5}>
        <Categories
          categoryId={category_id}
          setCategoryId={setCategoryId}
          label="Category"
        />
      </Box>
      <SubmissionList state={state} category_id={category_id} />
    </>
  )
}

export const SubmissionList = ({ state, category_id }) => {
  const { loading, data = {}, refetch } = useQuery(SUBMISSIONS, {
    variables: { state, category_id },
    fetchPolicy: 'network-only',
  })
  const { submissions } = data

  if (loading || !submissions) {
    return <LinearProgress variant="query" />
  }

  return (
    <>
      <Grid container spacing={4}>
        {submissions.map((submission) => (
          <Grid item xs={12} sm={6} md={4}>
            <Submission key={submission.id} submission={submission} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
export default Submissions
