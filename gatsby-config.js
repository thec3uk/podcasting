require("dotenv").config({
  path: ".env",
})

const AWS = require("aws-sdk")

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const getValidFiles = function(metadata) {
  file_keys = ["File_1", "File_2", "File_3", "File_4", "File_5"]
  return file_keys.map(key => {
    if (metadata[key] != "" && (metadata[key].endsWith(".mp3") || metadata[key].endsWith(".mpg"))) {
      return metadata[key]
    }
  })
}

module.exports = {
  siteMetadata: {
    title: `The C3 Audio Podcast`,
    description: `Welcome to the audio podcast feed of The C3 Church. To find out more visit http://www.thec3.uk`,
    author: `The C3 Church`,
    siteURL: `https://boring-dijkstra-1928f8.netlify.com`
  },
  plugins: [
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: ({ node, object, isArray }) => {
          return node.extension
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `metadata`,
        path: `${__dirname}/data/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-s3",
      options: {
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS,
        },
        buckets: ["thec3-teaching-series"],
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
                  siteURL
                }
              }
              imageSharp {
    original {
      src
    }
  }
            }`,
        setup: ({ query, ...rest }) => ({
          custom_namespaces: {
            itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
          },
          custom_elements: [
            {"atom:link" : [
              {
                _attr: {
                  "href": "https://boring-dijkstra-1928f8.netlify.com/feed.xml",
                  "rel": "self",
                  "type":"application/rss+xml"
                }
              }
            ]},
            {"language": "en-gb"},
            { "itunes:author": "The C3 Church" },
            { "itunes:explicit": "No" },
            {
              "itunes:summary": `Welcome to the audio podcast feed of The C3 Church. To find out more visit http://www.thec3.uk`,
            },
            {
              "itunes:category": [
                {
                  _attr: {
                    text: "Religion & Spirituality",
                  },
                },
                {
                  "itunes:category": {
                    _attr: {
                      text: "Christianity",
                    },
                  },
                },
              ],
            },
            {
              "itunes:image": {
                _attr: {
                  href: `${query.site.siteMetadata.siteURL}${query.imageSharp.original.src}`,
                },
              },
            },
            {
              "itunes:owner": [
                { "itunes:name": "The C3 Church" },
                { "itunes:email": "andrew.miller@thec3.uk" },
              ],
            },
          ],
          ...rest
        } ),
        feeds: [
          {
            serialize: ({
              query: { site, imageSharp, allS3Object, allJson },
            }) => {
              return allJson.edges.filter(({ node }) => {
                S3Obj = allS3Object.edges.filter(s3node => {
                  var s3node = s3node.node
                  // get a list of files from the JSON blob
                  validMediaFiles = getValidFiles(node)
                  //
                  var thing = validMediaFiles.filter(file =>
                    s3node.Key.endsWith(file)
                  )
                  return thing[0]
                })[0]
                return S3Obj !== undefined
              }).map(({ node }) => {
                S3Obj = allS3Object.edges.filter(s3node => {
                  var s3node = s3node.node
                  // get a list of files from the JSON blob
                  validMediaFiles = getValidFiles(node)
                  //
                  var thing = validMediaFiles.filter(file =>
                    s3node.Key.endsWith(file)
                  )
                  return thing[0]
                })[0]

                  var S3ObjNode = S3Obj.node
                  var s3URL = `https://${S3ObjNode.Name}.s3.amazonaws.com/${S3ObjNode.Key}`
                  var description = node.Description
                  if (node.Speaker != "") {
                    description = description + `, Speaker: ${node.Speaker}`
                  }
                  if (node.Bible_References != "") {
                    description =
                      description +
                      `, Bible Reference: ${node.Bible_References}`
                  }
                  return {
                    // <content:encoded>...</content:encoded>
                    title: node.Recording_Title,
                    description: description,
                    date: new Date(
                      S3ObjNode.Key.split("/")
                        .splice(0, 3)
                        .join("-")
                    ),
                    url: s3URL,
                    guid: node.guid || s3URL,
                    author: node.Speaker,
                    enclosure: {
                      url: s3URL,
                      size: S3ObjNode.Size,
                      type: "audio/mpeg",
                    },
                    custom_elements: [
                      { "itunes:summary": description },
                      { "itunes:explicit": "no" },
                      { "itunes:author": node.Speaker },
                      {
                        "itunes:image": {
                          _attr: {
                            href: `${site.siteMetadata.siteURL}${imageSharp.original.src}`,
                          },
                        },
                      },
                      {
                      "content:encoded": {
                          _cdata: `${description}`
                        }
                      }
                    ],
                  }
                
              })
            },
            query: `
                {
                  allS3Object(filter: {Key: {regex: "/[mp3|mpg]$/"}}) {
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
        guid
      }
    }
  }
  imageSharp {
    original {
      src
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
        icon: `src/images/avatars-500x500.jpg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
