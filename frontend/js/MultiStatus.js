// vim: set ts=4 sw=4:

import { settingsGet } from './settings.js';

class MultiStatus {
    static async getFilter() {
        const value = await settingsGet('filter');
        let result = JSON.parse(value);
        if (!Array.isArray(result))
            result = [];

        return result;
    }

    static async getData() {
        // FIXME: read URI from attribute!
        const response = await fetch(document.location.href.replace(/\/[^/]*$/, "") + "/data.json");
        return await response.json();
        // FIXME: error handling
    }

    static #getDetails(s) {
        let result = `<div class='name'>${s.name}</div> [ <a href="${s.url}">Status Page</a> ] [ <a href="${s.feed}">Feed</a> ]`;
    
        if (s.fetch === 'OK') {
            if (s.results.length > 0) {
                result += `<table><thead><tr><th>Date + Title</th><th>Details</th></thead><tbody>`;
                result += s.results.map(function (obj) {
                    var time = obj.time;
                    if (typeof time === 'number')
                        time = new Date(time * 1000).toLocaleString();
                    return `<tr><td>${time}<br/><br/><b>${obj.title}</b></td><td>${(obj.description !== undefined ? obj.description : '')}</td></tr>`;
                }).join('');
                result += "</tbody></table>";
            } else {
                result += "<table><tbody><tr><td>No recent problems.</td></tr></tbody></table>";
            }
        } else {
            result += `<table><tbody><tr><td>
                         <p>Status feed fetching failed: ${s.details}</p>
                         <p>You might want to test the 'Feed' link above. If it works and the problem persists please <a href="https://github.com/lwindolf/multi-status/issues">report a bug</a>!</p>
                       </td></tr></tbody></table>`;
        }
        return result;
    }

    static renderStatus(e, s) {
        if (s.fetch === 'OK') {
            e.style.backgroundColor = (s.results.length === 0) ? '#4c4' : '#eb8100';
        } else {
            e.classList.add('unknown');
            e.title = `Unknown status. ${e.details}`;
        }
    
        if (e.classList.contains("details")) {
            e.innerHTML = this.#getDetails(s);
        } else {
            e.innerHTML = s.name;
        }
    }  
}

export { MultiStatus };