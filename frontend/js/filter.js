/* -------------------------------------------------------------------------
   Filter page handling
   ------------------------------------------------------------------------- */

function filterAdd(e) {
        const selection = document.getElementById('selection');
        const others = document.getElementById('others');
        const s = data.aggregators[e.dataset.nr];

        if(filter.includes(s.name)) {
                selection.append(e);
        } else {
                others.append(e);
        }
}

function filterToggle(ev) {
        const e = ev.target;
        const s = data.aggregators[e.dataset.nr];

        if(filter.includes(s.name))
                filter.splice(filter.indexOf(s.name), 1);
        else
                filter.push(s.name);

        filterAdd(e);
        settingsSet('filter', JSON.stringify(filter));
}

async function filterLoad() {
        await getData();

        data.aggregators.sort(function(a,b) {
		if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                return 0;
	}).forEach((s, nr) => {
                var e = document.createElement('div');
                e.className = 'status';
                e.setAttribute('data-nr', nr);
                e.onclick = filterToggle;
                filterAdd(e)
                render(e);
        })
}
