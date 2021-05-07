import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core'

const DialogContainer = props => {
  const { open, title, children, onConfirm } = props

  return (
    <Dialog open={open}>
      {title && (
        <DialogTitle>
          {title}
        </DialogTitle>
      )}
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={onConfirm}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogContainer
