import Submissions from './Submissions'
import { Typography, Box } from '@material-ui/core'
const StartUser = (props) => {
  return (
    <>
      <Box my={5}>
        <Typography variant="h2">Meaningful Content for Us 🦋</Typography>
      </Box>
      <Submissions />
    </>
  )
}

export default StartUser
