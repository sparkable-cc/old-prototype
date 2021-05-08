import { Button, Link } from '@material-ui/core'

const EmailButton = ({ label, email }) => {
  return (
    <Link href={`mailto:${email}`}>
      <Button variant="contained" color="primary">
        {label}
      </Button>
    </Link>
  )
}

export default EmailButton
