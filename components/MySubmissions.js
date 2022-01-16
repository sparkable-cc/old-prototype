import { useQuery } from '@apollo/client'
import { Typography, LinearProgress, Grid, Box } from '@material-ui/core'
import Submission from './Submission'
import { SUBMISSIONS } from './Submissions'
import withMe from '../libs/withMe'
import Submit from './Submit'

const MySubmissions = ( props ) => {
  const isUser = props.me ? true : false

  if (!isUser) {
    return <></>
  }
  
  return (
    <>
    <MySubmissionList user_id={ props.me.id } />
    </>
  )
}

export const MySubmissionList = ({ user_id }) => {
  const { loading, data = {}, refetch } = useQuery(SUBMISSIONS, {
    variables: { user_id },
    fetchPolicy: 'network-only',
  })
  const { submissions } = data

  console.log("loading: ", loading)
  console.log(submissions)

  if (loading || !submissions) {
    return <LinearProgress variant="query" />
  }

  return (
    <>
    <Grid container spacing={4}>
      {submissions.map((submission) => (
      <Grid key={submission.id} item xs={12} sm={6} md={4}>
        <Submission submission={submission} />
      </Grid>
      ))}
    </Grid>
    <Box mt={7}>
      <Typography variant="h4">Share a Link</Typography>
      <Submit />
    </Box>
    </>
  )
}

export default withMe(MySubmissions)