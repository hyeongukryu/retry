
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        setTimeout(function () {
            document.getElementById('host').contentWindow.app = app;
        }, 500);
    },
    open: function(url, name) {
        window.open(url, name);
    },
    scan: function (success, fail) {
        cordova.plugins.barcodeScanner.scan(success, fail);
    }
};
