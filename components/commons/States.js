import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'

import Select from '@material-ui/core/Select'
import { gql, useQuery } from '@apollo/client'

const STATES = ['egg', 'caterpillar', 'chrysalis', 'butterfy']

const States = ({ stateId, setState, label, ...props }) => {
  const labelId = `${name}-label`
  return (
    <FormControl {...props}>
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
