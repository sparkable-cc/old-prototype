import Layout from '../components/Layout'

function Error ({ statusCode }) {
  return (
    <Layout>
      <p>
        {statusCode
          ? `Ein ${statusCode}-Fehler ist auf Server-Seite aufgetreten`
          : 'Ein Fehler ist auf Client-Seite aufgetreten'}
      </p>
    </Layout>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
