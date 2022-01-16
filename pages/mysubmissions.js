import Layout from '../components/Layout'
import MySubmissions from '../components/MySubmissions'
import { Typography } from '@material-ui/core'

const MySubmissionsPage = () => {
  return (
    <Layout>
      <Typography variant="h2">My Submitted Links</Typography>
      <br/>
      <MySubmissions />
    </Layout>
  )
}

export default MySubmissionsPage