const bcrypt = require('bcrypt')
const ogs = require('open-graph-scraper')
const { isEmail, isAlphanumeric } = require('validator')

const DateTime = require('./scalar/DateTime')

const contentInsert = async ({ url: _url }, { pgdb }) => {
  const contents = pgdb.public.contents
  const url = _url.trim()

  const { result } = await ogs({ url }).catch((e) => {
    console.error(e)
    throw new Error(
      'In a devestating attempt, we were unable to fetch said URL.',
    )
  })

  return contents.insertAndGet({
    url,
    type: 'web',
    title: result?.ogTitle || result?.twitterTitle || result?.ogSiteName || url,
    description: result?.ogDescription || result?.twitterDescription,
    teaser_image_url: result?.ogImage?.url || result?.twitterImage?.url,
    og: result,
  })
}

const resolvers = {
  DateTime,
  Submission: {
    category: async (parent, args, context, info) => {
      const { category_id } = parent
      const { pgdb } = context
      const categories = pgdb.public.categories

      return categories.findOne({ id: category_id })
    },
    content: async (parent, args, context, info) => {
      const { content_id } = parent
      const { pgdb } = context
      const contents = pgdb.public.contents

      return contents.findOne({ id: content_id })
    },
  },
  Query: {
    me: async (parent, args, context, info) => {
      const { user } = context
      return user
    },
    categories: async (parent, args, context, info) => {
      const { user, pgdb } = context

      if (!user) {
        throw new Error(
          'You will have to login or sign up first. No sneak peak.',
        )
      }

      return pgdb.public.categories.findAll({
        orderBy: { title: 'ASC' },
      })
    },
    submissions: async (parent, args, context, info) => {
      const { stage, category_id } = args
      const { pgdb, user } = context
      const submissions = pgdb.public.submissions

      if (!user) {
        throw new Error(
          'You will have to login or sign up first. No sneak peak.',
        )
      }

      const conditions = {
        ...(stage && { stage }),
        ...(category_id && { category_id }),
      }

      return submissions.find(conditions)
    },
  },
  Mutation: {
    submit: async (parent, args, context, info) => {
      const { comment, url, category_id } = args
      const { pgdb, user } = context

      if (!user) {
        throw new Error(
          'You will have to login or sign up first. No anon data.',
        )
      }

      const categories = pgdb.public.categories
      const contents = pgdb.public.contents
      const submissions = pgdb.public.submissions

      const category = await categories.findOne({ id: category_id })
      if (!category) {
        throw new Error(
          'After many, many attempts, we are fairly certain: category ID seems wrong.',
        )
      }

      const content =
        (await contents.findOne({ url })) ||
        (await contentInsert({ url }, context))

      const submission = await submissions.insertAndGet({
        user_id: user.id,
        content_id: content.id,
        category_id: category.id,
        comment,
        stage: user.stage || 'egg',
      })

      return { ...submission, user, category, content }
    },
    categoryAdd: async (parent, args, context, info) => {
      const { title } = args
      const { pgdb, user } = context

      if (!user) {
        throw new Error('You will have to login or sign up first.')
      }

      const categories = pgdb.public.categories

      if (await categories.count({ title })) {
        throw new Error("I am sorry, Dave, I can' do that.")
      }

      return categories.insertAndGet({ title })
    },
    signup: async (parent, args, context, info) => {
      const { email, username, password } = args
      const { pgdb, login, user } = context

      if (user) {
        throw new Error('Logged in you are. Not signup you can.')
      }

      if (!isEmail(email)) {
        throw new Error('You submitted something, but not an email address.')
      }

      if (!isAlphanumeric(username)) {
        throw new Error('Yeah, no, that username is DECLINED!')
      }

      if (password.length < 6) {
        throw new Error('Your password is simply to short.')
      }

      // @TODO prevent signup when authorized

      const hasUser = await pgdb.public.users.count({
        or: [{ email }, { username }],
      })

      if (hasUser) {
        throw new Error(
          'Like Liam Neeson: Either email address or username is taken.',
        )
      }

      const hash = await bcrypt.hash(password, 10)
      const newUser = await pgdb.public.users.insertAndGet({
        email,
        username,
        hash,
      })

      await login(newUser)

      return newUser
    },
    login: async (parent, args, context, info) => {
      const { username, password, user } = args

      if (user) {
        throw new Error('Logged in you are. Not login again you can.')
      }

      if (!isAlphanumeric(username)) {
        throw new Error('Yeah, no, that username is DECLINED!')
      }

      if (password.length < 6) {
        throw new Error('Your password is simply to short.')
      }

      const { user: authenticatedUser } = await context.authenticate(
        'graphql-local',
        {
          email: username,
          password,
        },
      )

      await context.login(authenticatedUser)

      return authenticatedUser
    },
    logout: async (parent, args, context, info) => {
      const { user, logout, req } = context
      if (!user) {
        throw new Error('Not logged in you are already.')
      }

      await logout()
      req.session.destroy()

      return true
    },
  },
}

module.exports = { resolvers }
