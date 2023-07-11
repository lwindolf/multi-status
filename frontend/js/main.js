// vim: set ts=4 sw=4:
/*jshint esversion: 8 */

var data;
var previous;
var refreshTimer;
var filter;

/* -------------------------------------------------------------------------
   Status list rendering
   ------------------------------------------------------------------------- */

function getStatus(s) {
        return s.name;
}

function getDetails(s) {
        var result = `<div class='name'>${s.name}</div> [ <a href="${s.url}">Status Page</a> ] [ <a href="${s.feed}">Feed</a> ]`;

        if(s.results.length >0) {
                result += `<table><thead><tr><th>Date + Title</th><th>Details</th></thead><tbody>`;
                result += s.results.map(function(obj) {
                        var time = obj.time;
                        if(typeof time === 'number')
                                time = new Date(time*1000).toLocaleString();
                        return `<tr><td>${time}<br/><br/><b>${obj.title}</b></td><td>${(obj.description !== undefined?obj.description:'')}</td></tr>`;
                }).join('');
                result += "</tbody></table>";
        } else {
                result += "<p>No recent problems reported by status feed.</p>";
        }
        return result;
}

function render(e) {
        const s = data.aggregators[e.dataset.nr];

        if(s.fetch === 'OK') {
                e.style.backgroundColor = (s.results.length === 0)?'#4c4':'#eb8100';
        } else {
                e.classList.add('unknown');
                e.title = `Unknown status. ${e.details}`;
        }
        
        if(e.classList.contains("details")) {
                e.innerHTML = getDetails(s);
        } else {
                e.innerHTML = getStatus(s);
        }
}

function toggleDetails(ev) {
        const e = ev.target;
        const s = data.aggregators[e.dataset.nr];

        /* close previous box */
        if(previous) {
                previous.classList.remove('details');
                render(previous);
        }

        e.classList.toggle('details');
        render(e);
        previous = e;
}

function setInfo(str) {
        const date = document.getElementById('date');
        date.innerHTML = str;
        console.log(str);
}

async function getData() {
        const response = await fetch("/multi-status/data.json");
        data = await response.json();
        // FIXME: error handling
}

async function refresh() {
        const div = document.getElementById('multistatus');

        setInfo('<i>Fetching...</i>');
        await getData();
        setInfo(`Last updated: ${new Date(data.time*1000).toLocaleString()}`);

        div.innerHTML = '';
        data.aggregators.sort((a,b) => {
		if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                return 0;
        }).forEach((s, nr) => {
                if(filter.length == 0 || filter.includes(s.name)) {
                        var e = document.createElement('div');
                        e.className = 'status';
                        e.setAttribute('data-nr', nr);
                        e.onclick = toggleDetails;
                        div.append(e);
                        render(e);
                }
        });

        if(refreshTimer)
                clearTimeout(refreshTimer);
        refreshTimer = setTimeout(refresh, 60*5*1000);
}

function userRefresh() {
        setInfo('Refreshing...');
        setTimeout(refresh,1000);
}

window.onload = () => {
        'use strict';

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
                   .register('./worker.js');
        }

        settingsGet('filter').then((value) => {
                filter = JSON.parse(value);
                if(!Array.isArray(filter))
                        filter = [];

                if(document.location.pathname.match(/multi-status\/(index.html)?/))
                        refresh();
                if(document.location.pathname === "/multi-status/filter.html")
                        filterLoad();
        }).catch((info) => {
                console.error(info);
                setInfo(info);
        });
};
