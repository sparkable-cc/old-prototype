import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { red } from '@material-ui/core/colors'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Link from '@material-ui/core/Link'
import { formatDate } from '../libs/date'
import { useRouter } from 'next/router'

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

  const toggleHint = () => {
    setHint(!hint)
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
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Link href={submission.content.url} color="inherit">
            {submission.content.title}
          </Link>
        }
        subheader={formatDate(submission.date_posted)}
      />
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
          onMouseOut={toggleHint}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <Link
            href={`http://twitter.com/share?text=@ButterfyMe+reads+«${submission.content.title}»&url=${submission.content.url}`}
          >
            <ShareIcon />
          </Link>
        </IconButton>
        {/* <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton> */}
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
