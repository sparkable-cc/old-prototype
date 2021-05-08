import Layout from '../components/Layout'
import AuthSignup from '../components/Auth/Signup'
import { Typography } from '@material-ui/core'

const Index = () => {
  return (
    <Layout>
      <Typography variant="h2">Create your Account on Butterfy</Typography>
      <AuthSignup />
    </Layout>
  )
}

export default Index
