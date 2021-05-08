import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

export const categoriesLoading = [{ title: 'Loading...', id: undefined }]

const Categories = ({ categoryId, setCategoryId, label, ...props }) => {
  const classes = useStyles()
  const { loading, data = {}, refetch } = useQuery(CATEGORIES)
  const categories = data.categories || categoriesLoading
  const labelId = `${name}-label`
  return (
    <FormControl {...props} className={classes.formControl}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={categoryId}
        autoWidth
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
