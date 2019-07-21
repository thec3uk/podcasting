module.exports = {
  siteMetadata: {
    title: `Podcast Manager`,
    description: `Website to create & manage podcast feeds`,
    author: `@nanorepublica`,
  },
  plugins: [
        {
        resolve: 'gatsby-source-s3',
        options: {
          aws: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS,
          },
          buckets: ['thec3-teaching-series'],
        },
      },
      {
        resolve: `gatsby-plugin-feed`,
        options: {
            query: `{
                site {
                siteMetadata {
                  title
                  author
                  description
                }
              }
}
`,
          feeds: [
            {
              serialize: ({ query: { site, allS3Object } }) => {
                return allS3Object.edges.map(({node}) => {
                  return {
                    title: 'PREACH',
                    description: 'A C3 Preach',
                    date: new Date(node.Key.split('/').splice(0,3).join('-')),
                    url: `https://${node.Name}.s3.amazonaws.com/${node.Key}`,
                    guid: `https://${node.Name}.s3.amazonaws.com/${node.Key}`,
                  }
                })
              },
              query: `
                {
                  allS3Object(filter: {Key: {regex: "/[mp3]$/"}}) {
                    edges {
                      node {
                        Key
                        Name
                        Size
                        ETag
                      }
                    }
                }
                }
              `,
              output: "/feed.xml",
              title: "The C3 Audio Podcast",
            },
          ],
        },
      },
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
