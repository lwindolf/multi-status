#!/usr/bin/env node

const fs = require('fs');

const feeds = JSON.parse(fs.readFileSync('backend/conf/feeds.json', 'utf8'));

const pages = Object.entries(feeds)
        .map(([key, value]) => `[${key}](${value.feed})`)
        .sort()
        .join(' | ');

const readme = fs.readFileSync('README.md', 'utf8');
const updated = readme.replace(
        /<!-- start list -->.*<!-- end list -->/s,
        `<!-- start list -->\n${pages}\n<!-- end list -->`
);

fs.writeFileSync('README.md', updated);