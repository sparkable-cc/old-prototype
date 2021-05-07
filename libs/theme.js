import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { red, grey, blue, cyan } from '@material-ui/core/colors'

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: blue,
    secondary: cyan,
  },
  spacing: (value) => value ** 2,
})

export default responsiveFontSizes(theme)
