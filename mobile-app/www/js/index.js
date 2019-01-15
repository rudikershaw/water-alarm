var app = new (function() {

    var select = document.querySelector.bind(document);
    var selectAll = document.querySelectorAll.bind(document);
    var storage = window.localStorage;

    var domain = "";
    var uuid = "";

    // Application Constructor
    this.initialize = function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    };

    // deviceready Event Handler
    this.onDeviceReady = function() {
        domain = storage.getItem('domain');
        uuid = storage.getItem('uuid');
        if (domain && uuid && uuid.length > 0) {
            showAlarmStatus();
        } else {
            showDetailsForm();
        }
    };

    var showDetailsForm = function() {
        selectAll('.form-container')[0].classList.remove('hide');
        select('#save-details-button').addEventListener("click", function(event){
            event.preventDefault();
            domain = select('#domain-details-input').value;
            uuid = select('#uuid-details-input').value;
            if (domain && uuid) {
                storage.setItem('domain', domain);
                storage.setItem('uuid', uuid);
                selectAll('.form-container')[0].classList.add('hide');
                showAlarmStatus();
            } else {
                var inputs = selectAll('.form-container input');
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].classList.add('invalid');
                }
            }
        });
    };

    var showAlarmStatus = function() {
        selectAll('.alarm-status')[0].classList.remove('hide');
    };
})();

app.initialize();
