
Object.defineProperty(globalThis,"Overlay", {
    _value : null,
    get () {
        if (this._value?.element == null || this._value.element == undefined) {
            
            this._value = { 
                AddPlugin: function (name, plugin) { 
                    this[name] = plugin;
                },
                element: document.createElement("div") 
            };

            this._value.element.classList.add("Overlay-Class");
            if (document.readyState != "complete")
            {
                let WaitForReady = new Promise((resolve, reject) => {
                    document.onreadystatechange = () => {
                        if (document.readyState == "complete")
                        {
                            resolve("Done!");
                            return;
                        }
                    }
                });
                WaitForReady.then(() => {
                    document.body.appendChild(this._value.element);
                });
                return this._value;
            } else {
                document.body.appendChild(this._value.element);
                return this._value
            }
        } else {
            return this._value;
        }
    }
}) 