var app = new (function() {

    var select = document.querySelector.bind(document);
    var selectAll = document.querySelectorAll.bind(document);

    var domain = "";
    var uuid = "";

    /** Initialize the application. */
    this.initialize = function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    };

    /** Handles preparing to be performed when the device is ready. */
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

        setTimeout(repeatUpdate, 30000);
    };

    /** Recursively repeat request to update alarm status. */
    var repeatUpdate = function() {
        updateAlarmStatus();
        setTimeout(repeatUpdate, 30000);
    };

    /** Shows the application settings form and performs associated UI manipulation. */
    var showDetailsForm = function() {
        select('#domain-details-input').value = domain;
        select('#uuid-details-input').value = uuid;
        select('button.settings').classList.add('hidden');
        select('.form-container').classList.remove('hide');
        select('.alarm-status').classList.add('hide');
    };

    /** Normalizes the domain variable cached in the app object. */
    var standardizeDomain = function() {
        if (domain.indexOf('/', domain.length - 1) === -1) {
            domain = domain + '/';
        }
        // If domain doesn't contain the correct scheme.
        if (!(new RegExp("^(http|https)://", "i").test(domain))) {
            domain = 'http://' + domain;
        }
    };

    /** Shows the status / home page and performs associated UI manipulation. */
    var showAlarmStatus = function() {
        select('.alarm-status p').innerHTML = 'Loading...';
        updateAlarmStatus();
        select('button.settings').classList.remove('hidden');
        select('.alarm-status').classList.remove('hide');
    };

    /** Request the alarm status from the domain's web service and update the UI. */
    var updateAlarmStatus = function() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', domain + 'water-alarm/query/' + uuid);
        ajax.setRequestHeader('Accept', 'application/json; q=0');
        ajax.onload = function() {
            if (ajax.status === 200) {
                try {
                    var jsonResponse = JSON.parse(ajax.responseText);
                    if (jsonResponse.hasOwnProperty('water')) {
                        if (jsonResponse.water) {
                            select('.alarm-status p').innerHTML = 'Warning! Water detected!';
                            notify();
                        } else {
                            select('.alarm-status p').innerHTML = 'No water detected';
                        }
                    } else {
                        somethingUnexpectedHappened();
                    }
                } catch (error) {
                    somethingUnexpectedHappened();
                }
            } else if (ajax.status === 404) {
                select('.alarm-status p').innerHTML = 'Alarm details not found';
            } else {
                somethingUnexpectedHappened();
            }
        };
        ajax.onerror = function () {
            somethingUnexpectedHappened();
        };
        ajax.send();
    };

    /** Display the 'something unexpected happened' message to the user. */
    var somethingUnexpectedHappened = function() {
        select('.alarm-status p').innerHTML = 'Something unexpected has happened. Please check ' +
                                              'that your domain settings are correct';
    };

    /** Notifies the user using push notification. */
    var notify = function() {
        cordova.plugins.notification.local.schedule({
            title: 'Warning!',
            text: 'Water detected!',
            foreground: true
        });
    };
})();

app.initialize();
