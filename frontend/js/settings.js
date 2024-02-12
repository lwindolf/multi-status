// vim: set ts=4 sw=4:

/* -------------------------------------------------------------------------
   Persistent settings using IndexedDB
   ------------------------------------------------------------------------- */

var _settingsDb;

function _settingsDBOpen() {
    return new Promise((resolve, reject) => {
        if (_settingsDb)
            resolve();

        let req = indexedDB.open("settings", 1);
        req.onsuccess = function () {
            _settingsDb = this.result;
            resolve();
        };

        req.onerror = function (evt) {
            reject(`Error opening IndexedDB: ${evt.target.errorCode}`);
        };

        req.onupgradeneeded = function (evt) {
            _settingsDb = evt.currentTarget.result;
            console.log("IndexedDB onupgradeneeded");
            _settingsDb.createObjectStore("settings", { keyPath: 'id', autoIncrement: true });
        };
    });
}

function settingsGet(name, defaultValue = null) {
    return _settingsDBOpen().then(() => new Promise((resolve, reject) => {
        let store = _settingsDb.transaction("settings", "readonly").objectStore("settings");
        let req = store.get(name);
        req.onsuccess = function (evt) {
            let setting = evt.target.result;
            if (setting)
                resolve(setting.value);
            else
                resolve(defaultValue);
        };
        req.onerror = function (evt) {
            reject(`Error getting setting ${evt.target.errorCode}`);
        };
    }));
}

function settingsSet(name, value) {
    return _settingsDBOpen().then(() => new Promise((resolve, reject) => {
        let store = _settingsDb.transaction("settings", "readwrite").objectStore("settings");
        try {
            store.put({ id: name, "value": value });
            resolve();
        } catch (e) {
            reject(`Error saving setting ${name}: ${e}`);
        }
    }));
}

export { settingsGet, settingsSet };