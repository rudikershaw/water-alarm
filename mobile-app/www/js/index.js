var app = new (function() {

    var select = document.querySelector.bind(document);
    var selectAll = document.querySelectorAll.bind(document);

    this.domain = "";
    this.uuid = "";

    // Application Constructor
    this.initialize = function() {
        document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    };

    // deviceready Event Handler
    var onDeviceReady = function() {
        var storage = window.localStorage;
        domain = storage.getItem('domain');
        uuid = storage.getItem('uuid');
        if (domain && uuid && uuid.length > 0) {
            // Use details to check with web service for water status.
        } else {
            selectAll('.form-container')[0].classList.remove('hide');
            select('#save-details-button').onclick = function () {
                domain = select('#domain-details-input').value;
                uuid = select('#uuid-details-input').value;
                if (domain && uuid) {
                    storage.setItem('domain', domain);
                    storage.setItem('uuid', uuid);
                    selectAll('.form-container')[0].classList.add('hide');
                } else {
                    // Add invalid class to inputs.
                }
            }
        }
    };
})();

app.initialize();
