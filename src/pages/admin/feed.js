import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

export default class FeedAdminPage extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props.location.state.feedName)
    // this.props = props
    // this.feedName = props.location.state.feedName
    // this.state = {}
  }

  render() {
    return (
      <Layout>
        <SEO title="Admin" />
        <h1>Feed Admin for "{this.feedName}"</h1>

        <div>
          <label>
            Feed Name: <input disabled={true} defaultValue={this.feedName} />
          </label>
          <label>
            Website: <input type="text" />
          </label>
          <label>
            Description: <textarea name="" cols="50" rows="5" />
          </label>

          <button type="button">Save Feed</button>
        </div>
      </Layout>
    )
  }
}
