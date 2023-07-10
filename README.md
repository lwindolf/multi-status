# multi-status
Aggregator for status pages of online services. Know which of your 3rd party SaaS/PaaS are having issues right now.

Backend for https://lzone.de/multi-status/

![image](https://user-images.githubusercontent.com/3315368/112210956-9bc02a80-8c1b-11eb-8448-cf37e2de8b84.png)


## Usage

    ./backend/update.pl > output.json
    
## Todo

- Date normalization
- Strip bad encodings
- Option to query only some providers

## Supported Status Pages

Currently the following providers status pages are supported:

*airbrake artifactoryonline AWS Azure Azure DevOps bandwidth baremetrics bigcartel bigwig binarylane bitbucket bitrise bonsai box breadcrumb brightpearl callfire catchpoint cdnjs chargify chartbeat chef circleci clarifai clearbit clojars cloudamqp cloudflarecom cloudinary CloudSigma Code Climate codeclimate codeship codetree coinbase Confluence credsimple cxengage datadog datadoghq deadmanssnitch developer dialpad digitalocean discord dnsimple Docker dropbox duo dyncom easypost easyredir elastic.co engineyard envoy fullcontact gearhost geckoboard getstream Github GitLab Google Cloud graphenedb greenhouse hashicorp heapanalytics helpscout Heroku hetzner ifttt imgix incapsula instapage iron Jira jumpcloud keen kickbox lastpass launchpad letsencrypt librato lifesizecloud linode loader loggly maxcdn mediatemple metastatuspage modeanalytics newrelic npmjs opsGenie optimizely OVHloud pagerduty pantheon papertrailcom plivo pubnub pusher Python quay.io rapid7 recurly Redhat redislabs redtailtechnology rightscale rollbar rubygems runscope salesforceiq saucelabs scoutapp segment sendgrid sendwithus Sentry serverdensity servint sharefile shopkeep sitespect skylight smartsheet Sonarcloud sparkpost splashtop split squarespace stoplight syncano talkdesk TravisCI twilio Twitter typeform victorops websolr zapier zoom*

If you are missing a status page feel free to add it to `conf/feeds.json`
and to create a PR!

## Installation

    sudo apt-get install libjson-perl libxml-feed-perl
