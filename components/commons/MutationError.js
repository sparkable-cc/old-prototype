import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@material-ui/core'

const MutationError = (props) => {
  const { title = 'Error fatal', content } = props
  const [error, setError] = useState()

  useEffect(() => setError(props.apolloError), [props.apolloError])

  const handleClose = () => setError(undefined)

  return (
    <Dialog open={!!error}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>{error?.message}</Typography>
        <Typography gutterBottom>{content}</Typography>
        <details>
          <summary>Technical Mubmle Jumble</summary>
          <pre>{JSON.stringify(error?.graphQLErrors, null, 2)}</pre>
        </details>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MutationError
