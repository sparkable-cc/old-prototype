import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { Card, CardHeader, CardMedia, MenuItem } from '@material-ui/core'
import { CardContent, CardActions } from '@material-ui/core'
import { Collapse, Avatar, IconButton } from '@material-ui/core'
import { Typography, Link, Menu } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { Favorite, Share, MoreVert } from '@material-ui/icons'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { formatDate } from '../libs/date'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'

import { SubmissionFragment } from './Submit'

const VOTE = gql`
  mutation vote($submission_id: Int!) {
    vote(submission_id: $submission_id) {
      ...SubmissionFragment
    }
  }

  ${SubmissionFragment}
`

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}))

const Submission = ({ submission }) => {
  const router = useRouter()
  const classes = useStyles()
  const [hint, setHint] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [vote, { loading: voteLoading, error: voteError }] = useMutation(VOTE, {
    variables: { submission_id: submission.id },
  })

  const toggleHint = () => {
    setHint(!hint)
  }
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {submission.user &&
              submission.user.username &&
              submission.user.username[0].toUpperCase}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick={openMenu}>
            <MoreVert />
          </IconButton>
        }
        title={
          <Link href={submission.content.url} color="inherit">
            {submission.content.title}
          </Link>
        }
        subheader={formatDate(submission.date_posted)}
      />
      <Menu
        id="submission-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>Report as Spam</MenuItem>
        <MenuItem onClick={closeMenu}>Report Copyright Infrigement</MenuItem>
      </Menu>
      <Link href={submission.content.url}>
        <CardMedia
          className={classes.media}
          image={
            submission.content.teaser_image_url || '/images/placeholder.png'
          }
          title="Teaser Image"
        />
      </Link>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {submission.content.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onMouseOver={toggleHint}
          onClick={vote}
          onMouseOut={toggleHint}
        >
          <Favorite />
        </IconButton>
        <IconButton aria-label="share">
          <Link
            href={`http://twitter.com/share?text=@ButterfyMe+reads+«${submission.content.title}»&url=${submission.content.url}`}
          >
            <Share />
          </Link>
        </IconButton>
        <p>
          <small>Votes: {submission.votes}</small>
        </p>
      </CardActions>
      <Collapse in={hint} timeout="auto" unmountOnExit>
        <CardContent
          style={{ background: '#2196f3', color: 'white', fontWeight: 'bold' }}
        >
          Do you think this content is meanginful for many of us?
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default Submission
