import { gql, useQuery } from '@apollo/client'
import { LinearProgress, Grid } from '@material-ui/core'
import { useContext } from 'react'
import { SubmissionFragment } from './Submit'
import Submission from './Submission'
import withMe from '../libs/withMe'

export const MY_SUBMISSIONS = gql`
  query my_submissions($user_id: ID) {
    my_submissions(user_id: $user_id) {
      ...SubmissionFragment
    }
  }

  ${SubmissionFragment}
`

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
  const { loading, data = {}, refetch } = useQuery(MY_SUBMISSIONS, {
    variables: { user_id },
    fetchPolicy: 'network-only',
  })
  const { my_submissions } = data

  console.log("loading: ", loading)
  console.log(my_submissions)

  if (loading || !my_submissions) {
    return <LinearProgress variant="query" />
  }

  return (
    <>
    <Grid container spacing={4}>
      {my_submissions.map((submission) => (
      <Grid key={submission.id} item xs={12} sm={6} md={4}>
        <Submission submission={submission} />
      </Grid>
      ))}
    </Grid>
    </>
  )
}

export default withMe(MySubmissions)