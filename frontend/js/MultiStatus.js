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

    static async getData(path) {
        const response = await fetch(path + "/data.json");
        let json = await response.json();
        // FIXME: error handling
        return json;
    }

    static renderDetails(e, s) {
        let result = `<div class='name'>${s.name}</div> [ <a href="${s.url}" target="_blank">Status Page</a> ] [ <a href="${s.feed}" target="_blank">Feed</a> ]`;
    
        if (s.fetch === 'OK') {
            if (s.results.length > 0) {
                result += `<table><thead><tr><th>Date + Title</th><th>Details</th></thead><tbody>`;
                result += s.results.map(function (obj) {
                    var time = obj.time;
                    if (typeof time === 'number')
                        time = new Date(time * 1000).toLocaleString();
                    return `<tr>
                                <td class="status-${obj.type} status-${obj.status}">
                                    ${time}<br/><br/>
                                    <b>${obj.title}</b>
                                </td>
                                <td>
                                    ${(obj.description !== undefined ? obj.description : '')}
                                </td>
                            </tr>`;
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
        e.innerHTML = result;
    }

    static renderStatus(e, s) {
        let maintenance = false;
        let incident = false;
        let resolved = false;

        if (s.fetch === 'OK') {            
            if (s.results.length === 0)
                e.classList.add('status-ok');
            else {
                // We want to distinguish between maintenance, incident and resolved
                // As a SaaS service might have multiple issues and maintenances in
                // different states, we need to check all results
                s.results.forEach(function (obj) {
                    if (obj.type === 'maintenance') {
                        maintenance = true;
                    } else if (obj.status === 'resolved') {
                        resolved = true;
                    } else {
                        incident = true;
                    }
                });
                if (incident)
                    e.classList.add('status-incident');
                else if (maintenance)
                    e.classList.add('status-maintenance');
                else if (resolved)
                    e.classList.add('status-resolved');
                else
                    e.classList.add('status-incident'); // should not happen
            }
                
        } else {
            e.classList.add('status-unknown');
            e.title = `Unknown status. ${e.details}`;
        }
    
        e.innerHTML = s.name;
    }  
}

export { MultiStatus };