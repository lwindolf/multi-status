// vim: set ts=4 sw=4:

import { MultiStatus } from "./MultiStatus.js";
import { settingsGet, settingsSet } from './settings.js';

/* Status cloud widget */

class MultiStatusCloud extends HTMLElement {
    // state
    #data;
    #path;      // path where to find CSS and data.json
    #reduced;   // true = hide everything that's fine

    // shadow dom
    #info;
    #cloud;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.#path = this.shadowRoot.host.dataset.path;
        this.#reduced = Number(this.shadowRoot.host.dataset.reduced) == 1;

        this.#cloud = document.createElement('div');
        this.#info = document.createElement('span');
        this.#info.classList.add('date');

        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", (this.#path?this.#path:'') + "css/style.css");

        this.shadowRoot.append(this.#cloud);
        this.shadowRoot.append(this.#info);
        this.shadowRoot.appendChild(linkElem);

        this.#update();

        settingsGet('refreshInterval', 5).then((interval) => {
            setInterval(async () => {            
                await this.#update();
            },  60 * interval * 1000);
        });

        document.addEventListener('MultiStatusCloudRefresh', (e) => {
            this.#update();
            e.stopPropagation();
        });

        this.#cloud.addEventListener('click', (e) => {
            const target = e.target.closest('.status');
            if(target)
                this.#toggleDetails(target);
        });
    }

    #toggleDetails(e) {
        /* We know 2 modes:
            1. click on status cloud -> hide cloud + show details
            2. click on status details -> hide details + show cloud
        */
        const details = this.#cloud.querySelector('div.status.details');
        if(details.style.display !== 'inline-block') {
            const s = this.#data.aggregators[e.dataset.nr];
            details.classList = "status details";
            MultiStatus.renderDetails(details, s);

            this.#cloud.querySelectorAll('div.status').forEach((el) => el.style.display = 'none');
            details.style.display = 'inline-block';
        } else {
            this.#cloud.querySelectorAll('div.status').forEach((el) => el.style.display = 'inline-block');
            details.style.display = 'none';
        }
    }

    #setInfo(html) {
        this.#info.innerHTML = html;
    }

    #renderStatus(e) {
        const s = this.#data.aggregators[e.dataset.nr];

        MultiStatus.renderStatus(e, s);
    }

    async #update() {
        this.#setInfo('<i>Fetching...</i>');
        
        const filter = await MultiStatus.getFilter();
        this.#data = await MultiStatus.getData(this.#path);

        this.#setInfo(`Last updated: ${new Date(this.#data.time * 1000).toLocaleString()}`);

        this.#cloud.innerHTML = '<div class="status details" style="display: none;"></div>';
        this.#data.aggregators.sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            return 0;
        }).forEach((s, nr) => {
            // Hide all good for reduced mode
            if(this.#reduced && s.results.length == 0)
                return;

            if (filter.length == 0 || filter.includes(s.name)) {
                var e = document.createElement('div');
                e.className = 'status';
                e.setAttribute('data-nr', nr);
                e.onclick = this.toggleDetails;
                e.style.display = 'inline-block';
                this.#cloud.append(e);
                this.#renderStatus(e);
            }
        });
    }
}

// settings widget

class MultiStatusSettings extends HTMLElement {
    // constants
    #defaultRefreshInterval = 5;

    // state
    #path;
    #data;
    #filter;

    // shadow dom
    #selection;
    #others;
    #interval;

    constructor(css = "css/style.css") {
        super();

        this.attachShadow({ mode: 'open' });
        this.#path = this.shadowRoot.host.dataset.path;

        const settingsDiv = document.createElement('div');
        settingsDiv.innerHTML = `
            <div id="panel">
                <h2>Filter Services</h2>
                <p>
                    Click to assign services! An empty filter means you will see all services.
                </p>

                Filter:
                <div id="selection"></div>

                Available Services:
                <div id="others"></div>

                <h2>Update Interval</h2>

                Refresh every <input id="refreshInterval" type="number" size="5" min="1"/> minute(s)
            </div>
        `;

        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", (this.#path?this.#path:'') + css);

        this.shadowRoot.append(settingsDiv);
        this.shadowRoot.appendChild(linkElem);

        this.#selection = this.shadowRoot.getElementById('selection');
        this.#others = this.shadowRoot.getElementById('others');
        this.#interval = this.shadowRoot.getElementById('refreshInterval');

        this.#settingsLoad();

        this.#interval.onchange = (e) => settingsSet('refreshInterval', e.target.value);
    }

    #filterAdd(e) {
        const s = this.#data.aggregators[e.dataset.nr];

        if (this.#filter.includes(s.name)) {
            this.#selection.append(e);
        } else {
            this.#others.append(e);
        }
    }

    #filterToggle(e) {
        const s = this.#data.aggregators[e.dataset.nr];

        if (this.#filter.includes(s.name))
            this.#filter.splice(this.#filter.indexOf(s.name), 1);
        else
            this.#filter.push(s.name);

        this.#filterAdd(e);
        settingsSet('filter', JSON.stringify(this.#filter));
    }

    async #settingsLoad() {
        this.#filter = await MultiStatus.getFilter();
        this.#data = await MultiStatus.getData(this.#path);

        this.#interval.value = await settingsGet('refreshInterval', this.#defaultRefreshInterval);

        this.#data.aggregators.sort(function (a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            return 0;
        }).forEach((s, nr) => {
            var e = document.createElement('div');
            e.className = 'status';
            e.setAttribute('data-nr', nr);
            e.onclick = (ev) => {
                this.#filterToggle(ev.target);
            }
            this.#filterAdd(e);
            this.#renderStatus(e);
        });
    }

    #renderStatus(e) {
        MultiStatus.renderStatus(e, this.#data.aggregators[e.dataset.nr]);
    }
}

customElements.define('x-multistatus-cloud', MultiStatusCloud);
customElements.define('x-multistatus-settings', MultiStatusSettings);