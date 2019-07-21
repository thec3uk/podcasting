import React from "react"
import { navigate } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"

export default class AdminIndexPage extends React.Component {
  constructor() {
    super()
    this.state = {
      newFeedForm: false,
      feedName: "",
    }
    this.openFeedForm = this.openFeedForm.bind(this)
    this.createNewFeed = this.createNewFeed.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
  }

  openFeedForm() {
    this.setState({ newFeedForm: true })
  }

  handleChangeName(event) {
    this.setState({ feedName: event.target.value })
  }

  createNewFeed() {
    navigate(`/admin/feed`, {
      state: {
        feedName: this.state.feedName,
      },
    })
  }

  render() {
    return (
      <Layout>
        <SEO title="Admin" />
        <h1>Podcast Admin</h1>
        {this.state.newFeedForm ? (
          <div>
            <input
              type="text"
              name="feedName"
              onChange={this.handleChangeName}
            />
            <button type="button" onClick={this.createNewFeed}>
              Create Feed
            </button>
          </div>
        ) : (
          <button onClick={this.openFeedForm} className="btn" type="button">
            New Feed
          </button>
        )}
      </Layout>
    )
  }
}
