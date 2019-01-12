var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        var storage = window.localStorage;
        var domain = storage.getItem('domain');
        var uuid = storage.getItem('uuid');
        if (domain && uuid && uuid.length > 0) {
            // Use details to check with web service for water status.
        } else {
            document.getElementsByClassName('form-container')[0].classList.remove('hide');
        }
    }
};

app.initialize();
