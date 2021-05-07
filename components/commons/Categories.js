import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'

import Select from '@material-ui/core/Select'
//import { Controller } from 'react-hook-form'
import { gql, useQuery } from '@apollo/client'

export const CATEGORIES = gql`
  query categories {
    categories {
      id
      title
    }
  }
`

export const CATEGORYADD = gql`
  mutation categoryAdd($title: String!) {
    categoryAdd(title: $title) {
      id
      title
    }
  }
`

export const categoriesLoading = [{ title: 'Loading...', id: undefined }]

const Categories = ({ categoryId, setCategoryId, label, ...props }) => {
  const { loading, data = {}, refetch } = useQuery(CATEGORIES)
  const categories = data.categories || categoriesLoading
  const labelId = `${name}-label`
  return (
    <FormControl {...props}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={categoryId}
        onChange={(evt) => {
          setCategoryId(evt.target.value)
        }}
      >
        {categories.map((category) => (
          <MenuItem value={category.id}>{category.title}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default Categories
