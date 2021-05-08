import Layout from '../components/Layout'
import AuthLogin from '../components/Auth/Login'
import { Typography } from '@material-ui/core'

const Index = () => {
  return (
    <Layout>
      <Typography variant="h2">Login to Butterfy</Typography>
      <AuthLogin />
    </Layout>
  )
}

export default Index
