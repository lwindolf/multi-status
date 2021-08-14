# multi-status
Aggregator for status pages of online services. Know which of your 3rd party SaaS/PaaS are having issues right now.

Backend for https://lzone.de/multi-status/

![image](https://user-images.githubusercontent.com/3315368/112210956-9bc02a80-8c1b-11eb-8448-cf37e2de8b84.png)


## Usage

    ./update.pl > output.json
    
## Todo

- Date normalization
- Strip bad encodings
- Option to query only some providers
- Nagios check plugin

## Supported Status Pages

Currently the following providers status pages are supported:

*airbrake, appneta, artifactoryonline, AWS, Azure, Azure DevOps, bandwidth, baremetrics, bigcartel, bigwig, binarylane, bintray, bitbucket, bitrise, blueboxcom, bonsai, box, breadcrumb, brightpearl, callfire, catchpoint, cdnjs, chargify, chartbeat, chef, circleci, clarifai, clearbit, clojars, cloudamqp, cloudflarecom, cloudinary, CloudSigma, codeclimate, codeship, codetree, coinbase, compose, credsimple, cxengage, datadog, datadoghq, datasift, deadmanssnitch, developer, dialpad, digitalocean, discord, dnsimple, Docker, dropbox, duo, dyncom, easypost, easyredir, engineyard, envoy, fastly, flowdock, fullcontact, gearhost, geckoboard, getstream, Github, Google Cloud, graphenedb, greenhouse, hashicorp, heapanalytics, helpscout, Heroku, ifttt, imgix, incapsula, instapage, iron, jumpcloud, keen, kickbox, launchpad, librato, lifesizecloud, linode, loader, loadimpact, loggly, maxcdn, mediatemple, metastatuspage, modeanalytics, newrelic, npmjs, opbeat, opsGenie, optimizely, pagerduty, pantheon, papertrailcom, plivo, pubnub, pusher, Python, quay.io, rapid7, recurly, Redhat, redislabs, redistogo, redtailtechnology, rightscale, rollbar, rubygems, runscope, salesforceiq, saucelabs, scoutapp, segment, sendgrid, sendwithus, serverdensity, servint, sharefile, shopkeep, sitespect, skylight, smartsheet, sparkpost, splashtop, split, squarespace, stoplight, syncano, talkdesk, TravisCI, trust, twilio, Twitter, typeform, unroll, victorops, websolr, zapier, zoom, GitLab, OCHCloud*

If you are missing a status page feel free to add it to `conf/feeds.json`
and to create a PR!

## Installation

    sudo apt-get install libjson-perl libxml-feed-perl
