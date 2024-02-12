![Screenshot](screenshot.png)

# About

This is an aggregator and a progressive web app (PWA) for status pages of many important online infrastructure services. Know which of your 3rd party SaaS/PaaS are having issues right now.

Check it out at https://lzone.de/multi-status/

## Supported Status Pages

Currently the following providers status pages are supported:

*airbrake artifactoryonline AWS Azure Azure DevOps bandwidth baremetrics bigcartel bigwig binarylane bitbucket bitrise bonsai box breadcrumb brightpearl callfire catchpoint cdnjs chargify chartbeat chef circleci clarifai clearbit clojars cloudamqp cloudflarecom cloudinary CloudSigma Code Climate codeclimate codeship codetree coinbase Confluence credsimple cxengage datadog datadoghq deadmanssnitch developer dialpad digitalocean discord dnsimple Docker dropbox duo dyncom easypost easyredir elastic.co engineyard envoy fullcontact gearhost geckoboard getstream Github GitLab Google Cloud graphenedb greenhouse hashicorp heapanalytics helpscout Heroku hetzner ifttt imgix incapsula instapage iron Jira jumpcloud keen kickbox lastpass launchpad letsencrypt librato lifesizecloud linode loader loggly maxcdn mediatemple metastatuspage modeanalytics newrelic npmjs opsGenie optimizely OVHloud pagerduty pantheon papertrailcom plivo pubnub pusher Python quay.io rapid7 recurly Redhat redislabs redtailtechnology rightscale rollbar rubygems runscope salesforceiq saucelabs scoutapp segment sendgrid sendwithus Sentry serverdensity servint sharefile shopkeep sitespect skylight smartsheet Sonarcloud sparkpost splashtop split squarespace stoplight syncano talkdesk TravisCI twilio Twitter typeform victorops websolr zapier zoom*

If you are missing a status page feel free to add it to `conf/feeds.json`
and to create a PR!
 
## Todos

- Backend
  - Date normalization
  - Strip bad encodings
  - Option to query only some providers

## Setup

Install backend dependencies:

    sudo apt-get install libjson-perl libxml-feed-perl

Run backend updater

    cd backend
    ./update.pl >../frontend/data.json

Serve frontend for testing with

    cd frontend
    npm i
    npm start
