import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'

import Select from '@material-ui/core/Select'
import { gql, useQuery } from '@apollo/client'

const STATES = ['egg', 'caterpillar', 'chrysalis', 'butterfy']

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const States = ({ stateId, setState, label, ...props }) => {
  const classes = useStyles()
  const labelId = `${name}-label`
  return (
    <FormControl {...props} className={classes.formControl}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={stateId}
        onChange={(evt) => {
          setState(evt.target.value)
        }}
      >
        {STATES.map((state) => (
          <MenuItem value={state}>{state}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default States
