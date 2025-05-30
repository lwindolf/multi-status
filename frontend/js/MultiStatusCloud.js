// vim: set ts=4 sw=4:

import { MultiStatus } from "./MultiStatus.js";
import { settingsGet } from "./settings.js";

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

customElements.define('x-multistatus-cloud', MultiStatusCloud);
