import { gql, useQuery } from '@apollo/client'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'

import { SubmissionFragment } from './Submit'
import Submission from './Submission'

export const SUBMISSIONS = gql`
  query submissions($stage: Stage, $category_id: ID) {
    submissions(stage: $stage, category_id: $category_id) {
      ...SubmissionFragment
    }
  }

  ${SubmissionFragment}
`

const Submissions = (props) => {
  const { loading, data = {}, refetch } = useQuery(SUBMISSIONS)
  const { submissions } = data
  console.log(submissions)

  if (loading || !submissions) {
    return <LinearProgress variant="query" />
  }

  return (
    <>
      <Grid container spacing={4}>
        {submissions.map((submission) => (
          <Grid item xs={12} sm={4}>
            <Submission key={submission.id} submission={submission} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
export default Submissions
