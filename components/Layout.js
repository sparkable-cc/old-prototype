import React from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import { cdnify } from '../libs/utils'
import withMe from '../libs/withMe'

import styles from './Layout.module.css'

const Layout = function (props) {
  return (
    <>
      <Container maxWidth='md'>
        {props.children}
      </Container>
    </>
  )
}

export default withMe(Layout)
