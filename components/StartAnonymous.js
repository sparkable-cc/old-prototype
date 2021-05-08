import { Typography, Container, Button, Box } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Intro } from './StartUser'
import AuthSignup from './Auth/Signup'

const StartAnonymous = (props) => {
  const router = useRouter()
  const [toggle, setToggle] = useState(false)
  return (
    <>
      <Intro />
      <Box mb={7}>
        {toggle ? (
          <AuthSignup />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setToggle(!toggle)}
          >
            Sign Up Now
          </Button>
        )}
      </Box>

      <Typography variant="subtitle1">
        <p>
          Butterfy is a democratic collection of meaningful content. Sourced and
          curated by the people, not by an algorithm or a newsroom. Here, you
          decide in a 4-staged voting process together with everyone else what
          content has the potential for impact. Looking for the signal within
          the noise. We call that crowdfiltering.
        </p>
        <p>
          Content that makes it through the 4-staged crowdfiltering transforms
          from an Egg (1) into a Caterpillar (2), a Chrysalis (3) and finally
          into a Butterfly. Or rather, a Butterfy (4).
        </p>
        <p>
          Start by laying an Egg or exploring the Eggs others have laid already.
        </p>
      </Typography>
      <Container maxWidth="sm">
        <img
          src="/images/butterfy_anim.gif"
          width="100%"
          style={{
            border: '1px solid lightgray',
            padding: 16,
            background: 'white',
            marginTop: 50,
          }}
        />
      </Container>

      <Box my={8}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center">
            <p>
              <b>Let's butterfy the Internet!</b>
            </p>

            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('signup')}
            >
              Sign up
            </Button>
          </Typography>
        </Container>
      </Box>
    </>
  )
}

export default StartAnonymous
