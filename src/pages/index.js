import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"

import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`podcast`, `rss`, `audio`, `video`]} />
    <p>
      Nothing to see here for now... You might have more luck in the <Link to="/admin">admin</Link> section
    </p>

  </Layout>
)

export default IndexPage
