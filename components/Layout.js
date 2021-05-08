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
  Link,
} from '@material-ui/core'
import { Menu as MenuIcon, Add } from '@material-ui/icons'

import { cdnify } from '../libs/utils'
import withMe from '../libs/withMe'
import AuthLogout from './Auth/Logout'

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
              <Typography variant="h6" color="inherit" noWrap>
                <Link color="inherit" onClick={() => router.push('/')}>
                  Butterfy
                </Link>
              </Typography>
            </Box>
            <img
              src="/images/butterfy.png"
              width="45"
              height="40"
              onClick={() => router.push('/')}
            />
          </Box>
          {router.pathname != '/' && (
            <Button color="inherit" onClick={() => router.push('/')}>
              Start
            </Button>
          )}
          {props.me ? (
            <>
              <Button color="inherit" onClick={() => router.push('/submit')}>
                <Add /> Submit a Link
              </Button>
              <AuthLogout>
                <Button color="inherit">Logout</Button>
              </AuthLogout>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => router.push('/signup')}>
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box py={3}>{props.children}</Box>
      </Container>
    </>
  )
}

export default withMe(Layout)
