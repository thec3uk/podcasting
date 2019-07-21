
# Podcast basics

* Create a feed with options
  * name
  * type (audio, video)
  * description
  * other things
* Multiple feeds
* Multiple sites/brands - far future
* Publish to apple, spotify etc..
* chapters?


* Gatsby plugins:
  * S3 - source for files & data
  * JSON to read files
  * feed-generator - 2 options
  * feed parser to create pages


* pages:
    /login - for admin section.
    /admin - add feed, global options, list of feeds
    /admin/<feed> - handles uploads/adding an episode - triggers rebuild of the site for xml
    /<feed>/atom.xml, rss.xml (or whatever the spec says it ought to be)
    / (blank for now) this eventually will be the html page for the site
    /master/rss.xml - all feeds from this site

/admin - click 'new podcast'
popup with a name - lambda function to create a s3 json object
/admin/<feed-name> - (form with global options), list for episodes (form for each one)
'generate feed'


GET /admin/feed - generated from the xml feed?
POST /admin/feed - upload to S3 (file and json blob). Triggers webhook to rebuild

build of site:
  - pull json data from S3
  - use this data to build xml feed
  - use (xml feed|json) to build pages
  - new site goes live - need to refresh the page for the user (logged in)
      - ie need to provide a way to show the site has been updated.
