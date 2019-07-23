require('dotenv').config({
  path: '.env',
});

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getValidFiles = function(metadata) {
  file_keys = ['File_1', 'File_2', 'File_3', 'File_4', 'File_5']
  return file_keys.map(key =>{
    if (metadata[key] != "" && metadata[key].endsWith('.mp3')) {
      return metadata[key]
    }}
  )
}

module.exports = {
  siteMetadata: {
    title: `The C3 Audio Podcast`,
    description: `Welcome to the audio podcast feed of The C3 Church. To find out more visit http://www.thec3.uk`,
    author: `The C3 Church`,
  },
  plugins: [
      {
          resolve:`gatsby-transformer-json`,
          options: {
              typeName: ({ node, object, isArray }) => {
                  return node.extension
              },
          }
      },
      {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `metadata`,
        path: `${__dirname}/data/`,
      },
    },
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
            }`,
          feeds: [
            {
              serialize: ({ query: { site, allS3Object, allJson } }) => {
                return allJson.edges.map(({node}) => {
                  S3Obj = allS3Object.edges.filter((s3node) => {
                    var s3node = s3node.node
                    // get a list of files from the JSON blob
                    validMediaFiles = getValidFiles(node)
                    //
                    var thing = validMediaFiles.filter(file =>
                      s3node.Key.endsWith(file)
                    )
                    return thing[0]
                  })[0]
                  if (S3Obj !== undefined) {
                    var S3ObjNode = S3Obj.node
                    var s3URL = `https://${S3ObjNode.Name}.s3.amazonaws.com/${S3ObjNode.Key}`
                    var description = node.Description
                    if (node.Speaker != '') {
                      description = description + `, Speaker: ${node.Speaker}`
                    }
                    if (node.Bible_References != '') {
                      description = description + `, Bible Reference: ${node.Bible_References}`
                    }
                    return {
                      title: node.Recording_Title,
                      description: description,
                      date: new Date(S3ObjNode.Key.split('/').splice(0,3).join('-')),
                      url: s3URL,
                      guid: s3URL,
                    }
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
                allJson {
    edges {
      node {
        Bible_References
        Description
        Recorded_Date
        Recording_Title
        Speaker
        File_1
        File_2
        File_3
        File_4
        File_5
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
