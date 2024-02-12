// vim: set ts=4 sw=4:

import { MultiStatus } from "./MultiStatus.js";
import { settingsGet } from "./settings.js";

/* Status cloud widget */

class MultiStatusCloud extends HTMLElement {
    // state
    #data;

    // shadow dom
    #info;
    #cloud;

    constructor(css = "css/style.css") {
        super();

        this.attachShadow({ mode: 'open' });

        this.#cloud = document.createElement('div');
        this.#info = document.createElement('span');
        this.#info.classList.add('date');

        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", css);

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
        /* close previously open status box */
        const prev = this.#cloud.querySelector('div.status.details');
        if(prev) {
            prev.classList.remove('details');
            this.#renderStatus(prev);
        }

        /* close on 2nd click */
        if(e === prev)
            return;

        e.classList.toggle('details');
        this.#renderStatus(e);
    }

    #setInfo(html) {
        this.#info.innerHTML = html;
    }

    #renderStatus(e) {
        MultiStatus.renderStatus(e, this.#data.aggregators[e.dataset.nr]);
    }

    async #update() {
        this.#setInfo('<i>Fetching...</i>');

        const filter = await MultiStatus.getFilter();
        this.#data = await MultiStatus.getData();

        this.#setInfo(`Last updated: ${new Date(this.#data.time * 1000).toLocaleString()}`);

        this.#cloud.innerHTML = '';
        this.#data.aggregators.sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            return 0;
        }).forEach((s, nr) => {
            if (filter.length == 0 || filter.includes(s.name)) {
                var e = document.createElement('div');
                e.className = 'status';
                e.setAttribute('data-nr', nr);
                e.onclick = this.toggleDetails;
                this.#cloud.append(e);
                this.#renderStatus(e);
            }
        });
    }
}

customElements.define('x-multistatus-cloud', MultiStatusCloud);
