import Submissions from './Submissions'
import { Typography, Box, Button } from '@material-ui/core'
import { useRouter } from 'next/router'
import { Container } from '@material-ui/core'
const StartUser = (props) => {
  const router = useRouter()
  return (
    <>
      <Box my={5}>
        <Typography variant="h2">Meaningful Content for Us</Typography>
      </Box>
      <Submissions />
      <Box my={10} />
      <Container maxWidth="sm">
        <Typography variant="h4" align="center">
          <p>What is something meaningful you have read and want to share?</p>

          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('submit')}
          >
            Share a Link
          </Button>
        </Typography>
      </Container>
      <Box my={10} />
    </>
  )
}

export default StartUser
