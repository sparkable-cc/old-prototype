import React from 'react'
import Container from '@material-ui/core/Container'
import { Box } from '@material-ui/core'

import styles from './Layout.module.css'
import TopBar from './commons/TopBar'

const Layout = function (props) {
  return (
    <>
      <TopBar />
      <Container maxWidth="md">
        <Box py={3}>{props.children}</Box>
      </Container>
    </>
  )
}

export default Layout
