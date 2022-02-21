import { useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { Card, CardHeader, CardMedia, MenuItem } from '@material-ui/core'
import { CardContent, CardActions } from '@material-ui/core'
import { Collapse, Avatar, IconButton } from '@material-ui/core'
import { Typography, Link, Menu, Tooltip } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { Bookmark, Share, MoreVert } from '@material-ui/icons'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { formatDate } from '../libs/date'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import { truncate } from '../libs/utils'

import { SubmissionFragment } from './Submit'

import MutationError from './commons/MutationError'

import withMe, { queryWithMe } from '../libs/withMe'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const VOTE = gql`
  mutation vote($submission_id: ID!) {
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

const Submission = ({ submission, me }) => {
  const router = useRouter()
  const classes = useStyles()
  const [hint, setHint] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const [vote, { loading: voteLoading, error: voteError }] = useMutation(VOTE, {
    variables: { submission_id: submission.id },
    errorPolicy: 'all',
    refetchQueries: [{ query: queryWithMe }],
  })
  const domain = new URL(submission.content.url).hostname.replace('www.', '')

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
              submission.user.username[0].toUpperCase()}
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
        subheader={`${formatDate(submission.date_posted)}, ©${domain}`}
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
          {truncate(submission.content.description, 300)}
        </Typography>
      </CardContent>
      {submission.comment && (
        <CardContent style={{ background: '#f8f8f8' }}>
          <Typography variant="body2" color="textSecondary" component="p">
            @{submission.user.username}:{' '}
            <i>«{truncate(submission.comment, 300)}»</i>
          </Typography>
        </CardContent>
      )}
      <CardActions disableSpacing>
        { me && 
        <LightTooltip title={`${submission.meHasVoted ? 'Remove' : 'Add'} to bookmark`} placement="bottom-start">
          <IconButton
            aria-label={`add to bookmark`}
            color={submission.meHasVoted ? 'primary' : 'default'}
            onClick={vote}
          >
            <Bookmark />
          </IconButton>
        </LightTooltip> }
        <IconButton aria-label="share">
          <Link
            href={`http://twitter.com/share?text=@ButterfyMe+reads+«${submission.content.title}»&url=${submission.content.url}`}
          >
            <Share />
          </Link>
        </IconButton>
      </CardActions>
      <Collapse in={hint} timeout="auto" unmountOnExit>
        <CardContent
          style={{ background: '#2196f3', color: 'white', fontWeight: 'bold' }}
        >
          Do you think this content is meaningful for many of us?
        </CardContent>
      </Collapse>
      <MutationError
        title="Nope."
        content="That did not work as planned. Sorry."
        // apolloError={voteError}
      />
    </Card>
  )
}

export default withMe(Submission)
