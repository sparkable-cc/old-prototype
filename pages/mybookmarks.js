import Layout from '../components/Layout'
import MyBookmarks from '../components/MyBookmarks'
import { Typography } from '@material-ui/core'

const MyBookmarksPage = () => {
  return (
    <Layout>
      <Typography variant="h2">My BookMark</Typography>
      <MyBookmarks />
    </Layout>
  )
}

export default MyBookmarksPage