
/**
 *  
 *  Overlay is a function that is triggered when it is required ( when it is gotton )
 *  it then redefines itself to nolonger be the creation function but the result that was returned
 *  Backwards way to make it not initilise until it is called
 * 
 */
Object.defineProperty(globalThis, "Overlay", {
    configurable: true,
    get() {
        
        let element = document.createElement("div");
        element.classList.add("Overlay-Class");

        let ov = {
            element,
            PluginQueue: [],
            Plugin: {},
            AddPlugin: function (name, plugin) {
                console.log(this, name)
                this[name] = plugin;
                
                // if (document.readyState == "comple")
                if (this?.element == undefined) {
                    this.PluginQueue.push(name);
                } else {
                    if (plugin.init instanceof Function) {
                        plugin.init(this.element);
                    }
                }
            }
        }

        Object.defineProperty(globalThis, "Overlay", { value: ov});

        if (document.readyState != "complete") {
            let WaitForReady = new Promise((resolve, reject) => {
                document.onreadystatechange = () => {
                    if (document.readyState == "complete") {
                        resolve("Done!");
                        return;
                    }
                }
            });
            // Initilise Plugin when document is loaded
            WaitForReady.then(function () {
                document.body.appendChild(ov.element);
                ov.PluginQueue?.forEach(function (item) {
                    if (ov[item].init instanceof Function){
                        ov[item].init(ov.element);
                    }
                })
            });

        } else {
            document.body.appendChild(ov.element);
        }


        return ov;
    }
})