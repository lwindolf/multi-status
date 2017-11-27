# multi-status
Aggregator for status pages of online services. Know which of your 3rd party SaaS/PaaS are having issues right now.

## Usage

    ./update.pl > output.json
    
## Todo

- Date normalization
- Strip bad encodings
- Option to query only some providers
- Nagios check plugin

## Supported Status Pages

Currently the following providers status pages are supported:

*Amazon AWS CloudSigma Docker Github Google Cloud Heroku Microsoft Azure OpenSuSE OpsGenie Python Redhat TravisCI Twitter Yarn airbrake appneta artifactoryonline authorize bandwidth baremetrics bigcartel bigwig binarylane bintray bitbucket bitrise blueboxcom bonsai box braintreepayments breadcrumb brightpearl callfire catchpoint chargify chartbeat chef circleci clarifai clearbit clojars cloudamqp cloudflarecom cloudinary codeclimate codeship codetree coinbase compose credsimple cxengage datadoghq datasift deadmanssnitch desk developer dialpad digitalocean dnsimple dropbox duo dyncom easypost easyredir engineyard envoy fastly flowdock fullcontact gearhost geckoboard getstream graphenedb greenhouse hashicorp heapanalytics helpscout hipchat ifttt imgix incapsula instapage iron jumpcloud keen kickbox librato lifesizecloud linode loader loadimpact loggly maxcdn mediatemple metastatuspage modeanalytics newrelic npmjs nsonenet opbeat openshift optimizely pagerduty pantheon papertrailcom pingdom pipedrive plivo pubnub pusher rapid7 recurly redislabs redistogo redtailtechnology rightscale rollbar rubygems runscope salesforceiq saucelabs scoutapp segment sendgrid sendwithus serverdensity servint sharefile shopify shopkeep sitespect skylight smartsheet sparkpost splashtop split squarespace stoplight syncano talkdesk tddium trust typeform unroll venmo victorops websolr zapier zoom*
