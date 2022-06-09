let NotificationPlugin = {
    _Setting: {
        delay : 500,
        autoClose: true
    },
    get delay () {
        return this._Setting.delay;
    },
    get autoClose () {
        return this._Setting.autoClose;
    },
    addNotification (title, message, Overrides) {

    }
};

Overlay.AddPlugin("Notifications", NotificationPlugin);

