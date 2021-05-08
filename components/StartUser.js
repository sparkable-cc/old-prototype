import Submissions from './Submissions'
import { Typography, Box, Button } from '@material-ui/core'
import { useRouter } from 'next/router'
import { Container } from '@material-ui/core'
import styles from './StartUser.module.css'
import { useEffect, useState } from 'react'
import Submit from './Submit'

const StartUser = (props) => {
  const router = useRouter()
  const [toggle, setToggle] = useState(false)

  return (
    <>
      <Intro />
      <Box mb={7}>
        {toggle ? (
          <Submit />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setToggle(!toggle)}
          >
            Share a Link
          </Button>
        )}
      </Box>
      <Typography variant="h4">Discover what other people sent in</Typography>
      <Submissions />
    </>
  )
}

const meaningful = [
  'meaningful',
  'surprising',
  'moving',
  'significant',
  'pointed',
  'profound',
  'substantial',
  'thought-provoking',
  'insightful',
  'transformational',
  'growth-inducing',
  'mind-bending',
  'inspiring',
  'touching',
  'enriching',
]

export const Intro = () => {
  const [mix, setMix] = useState(0)

  useEffect(() => {
    setTimeout(nextRotate, 2000)
  })

  const nextRotate = () => {
    setTimeout(() => {
      setMix(mix < meaningful.length - 1 ? mix + 1 : 0)
    }, 2000)
  }
  return (
    <Box my={5} maxWidth="sm" style={{ maxWidth: 600 }}>
      <Typography variant="h2" gutterBottom={40}>
        Burst your filter bubble and change the flow of media
      </Typography>
      <Typography variant="h4">
        Submit the most &nbsp;{' '}
        <span class={styles.roto}>{meaningful[mix]}</span> &nbsp; content you
        have encountered recently
      </Typography>
    </Box>
  )
}

export default StartUser
