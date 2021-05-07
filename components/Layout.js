import React from 'react'
import Container from '@material-ui/core/Container'
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import Link from 'next/link'

import { cdnify } from '../libs/utils'
import withMe from '../libs/withMe'

import styles from './Layout.module.css'
import { useTheme } from '@material-ui/core'
import { useRouter } from 'next/router'

const Layout = function (props) {
  const theme = useTheme()
  const router = useRouter()

  return (
    <>
      <AppBar position="relative" color={theme.primary}>
        <Toolbar>
          <Box display="flex" flexGrow={1} alignItems="center">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Box mr={4}>
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                onClick={() => router.push('/')}
              >
                <Link href="/">Butterfy</Link>
              </Typography>
            </Box>
            <img
              src="/images/logo_butterfy.png"
              width="50"
              height="50"
              onClick={() => router.push('/')}
            />
          </Box>
          <Button color="inherit" onClick={() => router.push('/login')}>
            Login
          </Button>
          <Button color="inherit" onClick={() => router.push('/signup')}>
            signup
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">{props.children}</Container>
    </>
  )
}

export default withMe(Layout)
