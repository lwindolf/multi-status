#!/usr/bin/node

import './init.js';
import fs from 'fs';
import fetch from 'node-fetch';
import { parserAutoDiscover } from './feed-parser/autodiscover.js';

let result = {
	time: Date.now(),
	aggregators: []
};
const config = JSON.parse(fs.readFileSync('conf/feeds.json', 'utf8'));
const oneDayAgo = Date.now()/1000 - 24 * 60 * 60;
const outputFile = process.argv[2];
if (!outputFile) {
	console.error('ERROR: Syntax: update.js <output JSON file name>');
	process.exit(1);
}

function parse(url, data) {
	let status = {
		fetch: "FAILED",
		results: []
	};

	try {
		const parser = parserAutoDiscover(data, url);
		if (!parser)
			return { fetch: "OK", details: "Feed discovery failed!" };

		status.fetch = "OK";

		const feed = parser.parse(data);
		if (!feed)
			return { fetch: "OK", details: "Feed parsing failed!" };

		feed.newItems.forEach(i => {
			if (i.time && i.time >= oneDayAgo) {
				status.results.push({
					time        : i.time,
					title       : i.title.replace(/<[^>]*>/g, ' '),
					description : (i.description || '').replace(/<[^>]*>/g, ' ')
				});
			}
		});
	} catch (err) {
		return { fetch: "FAILED", details: "Fetch failed!"};
	}

	return status;
}

const keys = Object.keys(config).sort();
for (const k of keys) {
	const url = config[k].feed;
	const data = await fetch(url).then(res => res.text()).catch(() => null);
	let status = parse(url, data);
	status = {
		...status,
		...config[k],
		name: k
	};

	if (!status.results)
		status.results = [];
	
	if (!status.url)
		status.url = status.feed.replace(/\/[^/]+$/, '');

	result.aggregators.push(status);
}

// Perform categorizing...
//
// We want to detect by pattern matching the details
//
// type:
// - maintenance/scheduled
// - incident/outage
// - service degraded
//
// status:
// - resolved/completed
// - investigating
result.aggregators.forEach(a => {
	a.results?.forEach(r => {

		// Order is important!
		if(r.description.match(/(maintenance|scheduled)/i)) {
			r.type = 'maintenance';
		}
		if(r.description.match(/(incident|outage|degraded)/i)) {
			r.type = 'incident';
		}
		if(!("type" in r)) {
			r.type = 'incident';
		}

		// Order is important!
		if(r.description.match(/(investigating|monitoring)/i)) {
			r.status = 'investigating';
		}
		if(r.description.match(/(resolved|full recovery)/i)) {
			r.status = 'resolved';
		}
		if(r.description.match(/(completed)/i)) {
			r.status = 'completed';
		}

	})
});

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

