const bcrypt = require('bcrypt')
const ogs = require('open-graph-scraper')

const DateTime = require('./scalar/DateTime')

const contentInsert = async ({ url }, { pgdb }) => {
  const contents = pgdb.public.contents

  const { result } = await ogs({ url }).catch((e) => {
    console.error(e)
    throw new Error('Diese URL lässt sich nicht laden')
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
  Query: {
    me: async (parent, args, context, info) => {
      return context.getUser()
    },
    categories: async (parent, args, context, info) => {
      return context.pgdb.public.categories.findAll({
        orderBy: { title: 'DESC' },
      })
    },
  },
  Mutation: {
    submit: async (parent, args, context, info) => {
      const { comment, url, category_id } = args
      const { pgdb, login, user } = context

      if (!user) {
        throw new Error('Du musst dich erst anmelden.')
      }

      const categories = pgdb.public.categories
      const contents = pgdb.public.contents
      const submissions = pgdb.public.submissions

      const category = await categories.findOne({ id: category_id })
      if (!category) {
        throw new Error('Kategorie war beim besten Wille nicht aufzufinden')
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
      const { pgdb } = context

      const categories = pgdb.public.categories

      if (await categories.count({ title })) {
        throw new Error('Titel der Kategorie existiert bereits')
      }

      return categories.insertAndGet({ title })
    },
    signup: async (parent, args, context, info) => {
      const { email, username, password } = args
      const { pgdb, login } = context

      // @TODO prevent signup when authorized
      // @TODO add some rudementary validation, email, username

      const hasUser = await pgdb.public.users.count({
        or: [{ email }, { username }],
      })

      if (hasUser) {
        throw new Error('Konto gibts schon')
      }

      const hash = await bcrypt.hash(password, 10)
      const user = await pgdb.public.users.insertAndGet({
        email,
        username,
        hash,
      })

      await login(user)

      return user
    },
    login: async (parent, args, context, info) => {
      const { username, password } = args

      // @TODO prevent login when authorized

      const { user } = await context.authenticate('graphql-local', {
        email: username,
        password,
      })

      await context.login(user)

      return user
    },
    logout: async (parent, args, context, info) => {
      await context.logout()
      context.req.session.destroy()

      return true
    },
  },
}

module.exports = { resolvers }
