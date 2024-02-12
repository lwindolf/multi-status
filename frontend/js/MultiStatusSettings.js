// vim: set ts=4 sw=4:

import { settingsGet, settingsSet } from './settings.js';
import { MultiStatus } from "./MultiStatus.js";

// settings widget

class MultiStatusSettings extends HTMLElement {
    // constants
    #defaultRefreshInterval = 5;

    // state
    #data;
    #filter;

    // shadow dom
    #selection;
    #others;
    #interval;

    constructor(css = "css/style.css") {
        super();

        this.attachShadow({ mode: 'open' });

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
        linkElem.setAttribute("href", css);

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
        this.#data = await MultiStatus.getData();

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

customElements.define('x-multistatus-settings', MultiStatusSettings);