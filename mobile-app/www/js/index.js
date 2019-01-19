var app = new (function() {

    var select = document.querySelector.bind(document);
    var selectAll = document.querySelectorAll.bind(document);

    var domain = "";
    var uuid = "";

    // Application Constructor
    this.initialize = function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    };

    // deviceready Event Handler
    this.onDeviceReady = function() {
        domain = window.localStorage.getItem('domain');
        uuid = window.localStorage.getItem('uuid');

        select('#save-details-button').addEventListener("click", function(event) {
            event.preventDefault();
            domain = select('#domain-details-input').value;
            uuid = select('#uuid-details-input').value;
            if (domain && uuid) {
                standardizeDomain();
                window.localStorage.setItem('domain', domain);
                window.localStorage.setItem('uuid', uuid);
                select('.form-container').classList.add('hide');
                showAlarmStatus();
            } else {
                var inputs = selectAll('.form-container input');
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].classList.add('invalid');
                }
            }
        });

        select('button.settings').addEventListener("click", function(event){
            showDetailsForm();
        });

        if (domain && uuid && uuid.length > 0) {
            showAlarmStatus();
        } else {
            showDetailsForm();
        }
    };

    var showDetailsForm = function() {
        select('#domain-details-input').value = domain;
        select('#uuid-details-input').value = uuid;
        select('button.settings').classList.add('hidden');
        select('.form-container').classList.remove('hide');
        select('.alarm-status').classList.add('hide');
    };

    var standardizeDomain = function() {
        if (domain.indexOf('/', domain.length - 1) === -1) {
            domain = domain + '/';
        }

        if (!(new RegExp("^(http|https)://", "i").test(domain))) {
            domain = 'http://' + domain;
        }
    };

    var showAlarmStatus = function() {
        select('.alarm-status p').innerHTML = 'Loading...';
        showStatusMessage();
        select('button.settings').classList.remove('hidden');
        select('.alarm-status').classList.remove('hide');
    };

    var showStatusMessage = function() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', domain + 'water-alarm/query/' + uuid);
        ajax.onload = function() {
            if (ajax.status === 200) {
                select('.alarm-status p').innerHTML = '200';
            } else if (ajax.status === 404) {
                select('.alarm-status p').innerHTML = '404';
            } else {
                select('.alarm-status p').innerHTML = 'Something went wrong';
            }
        };
        ajax.send();
    };
})();

app.initialize();
