// vim: set ts=4 sw=4:

import './MultiStatusCloud.js';

// multi status PWA main

window.onload = () => {
    if ('serviceWorker' in navigator)
        navigator.serviceWorker.register('./worker.js');

    if(document.getElementById('multistatusRefreshLink')) {
        document.getElementById('multistatusRefreshLink').onclick = (e) => {
            document.dispatchEvent(new Event("MultiStatusCloudRefresh"));
            e.stopPropagation();
        };
    }
};
