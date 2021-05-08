import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'

import Select from '@material-ui/core/Select'
import { gql, useQuery } from '@apollo/client'

const STAGES = ['', 'egg', 'caterpillar', 'chrysalis', 'butterfy']

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const Stages = ({ stageId, setStage, label, ...props }) => {
  const classes = useStyles()
  const labelId = `${name}-label`
  return (
    <FormControl {...props} className={classes.formControl}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={stageId}
        onChange={(evt) => {
          setStage(evt.target.value)
        }}
      >
        {STAGES.map((stage) => (
          <MenuItem value={stage || undefined}>{stage || 'All'}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default Stages
