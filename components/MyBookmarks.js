import withMe from '../libs/withMe'
import { gql, useQuery } from '@apollo/client'
import { Grid, LinearProgress } from '@material-ui/core';
import Submission from './Submission';

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

export const BOOKMARKET = gql`
    query bookmarks($stage: Stage, $category_id: ID, $user_id: ID) {
        bookmarks(stage: $stage, category_id: $category_id, user_id: $user_id) {
        ...SubmissionFragment
        }
    }

    ${SubmissionFragment}
`

const MyBookmarks = ({ me }) => {
    const { loading, data = {}, refetch } = useQuery(BOOKMARKET, {
        variables: { user_id: me?.id },
        fetchPolicy: 'network-only',
    })
    const { bookmarks } = data;

    if (loading || !bookmarks) {
      return <LinearProgress variant="query" />
    }
  

    return <Grid container spacing={4}>
      {bookmarks && bookmarks.map((bookmark) => (
        <Grid key={bookmark.id} item xs={12} sm={6} md={4}>
          <Submission submission={bookmark} />
        </Grid>
      ))}
  </Grid>
}


export default withMe(MyBookmarks)