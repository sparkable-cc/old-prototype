import {
  IconButton,
  Toolbar,
  Box,
  Grid,
  Button,
  Typography,
  Link,
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core'
import {
  Menu,
  Add,
  Home,
  AccountCircle,
  AssistantPhoto,
  SpeakerNotes,
  GroupWork,
  Help,
  Public,
} from '@material-ui/icons'
import { useRouter } from 'next/router'

import { cdnify } from '../../libs/utils'
import AuthLogout from '../Auth/Logout'
import { useTheme } from '@material-ui/core'
import { useState } from 'react'

import withMe from '../../libs/withMe'

const TopBar = (props) => {
  const router = useRouter()
  const theme = useTheme()
  const [showDrawer, setShowDrawer] = useState(false)

  const isUser = props.me ? true : false

  function toggleDrawer(event) {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setShowDrawer(!showDrawer)
  }

  return (
    <AppBar position="relative" color={theme.primary}>
      <Drawer
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
        anchor="left"
        open={showDrawer}
        color="secondary"
      >
        <div style={{ width: 250 }}>
          <Box p={2}>
            <Typography variant="h4">
              <img
                src="/images/butterfy.png"
                width="35"
                style={{ marginRight: 20 }}
              />
              Butterfy
            </Typography>
          </Box>
          <List>
            <NavItem icon={<Home />} label="Start Page" href="/" />
            <Divider />
            <NavItem
              icon={<AccountCircle />}
              label="Login"
              href="/login"
              hide={isUser}
            />
            <NavItem
              icon={<AssistantPhoto />}
              label="Signup"
              href="/signup"
              hide={isUser}
            />
            <NavItem
              icon={<Add />}
              label="Submit A Link"
              href="/submit"
              hide={!isUser}
            />
            <Divider />
            <NavItem icon={<Public />} label="About" href="/about" />
            <NavItem icon={<SpeakerNotes />} label="News" href="/news" />
            <NavItem icon={<Help />} label="Why Butterfy?" href="/why" />
            <NavItem icon={<GroupWork />} label="Team" href="/team" />
            <Divider />
          </List>
        </div>
      </Drawer>
      <Toolbar>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          style={{ flex: 1 }}
        >
          <Box display="flex" alignItems="center">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <Menu />
            </IconButton>
            <Box mr={2}>
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
          {props.me.tokens > 0 && (
            <Grid item align="center">{`${props.me.tokens} 🟡`}</Grid>
          )}

          <Grid item align="flex-end">
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
          </Grid>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

const NavItem = ({ label, href, icon, hide }) => {
  const router = useRouter()
  return (
    !hide && (
      <ListItem button onClick={() => router.push(href)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </ListItem>
    )
  )
}

export default withMe(TopBar)
