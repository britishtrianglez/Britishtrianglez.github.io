
var ProxyArray = new Proxy({}, {
    deleteProperty: function (target, proeprty) {
        console.log("delete",target, proeprty);
        return true; 
    },
    set : function (target, property, value, recieves) {
        target[property] = value;
        console.log(`set ${property} to ${value} and ${recieves}`);
        return true;
    }
} )


class CustomElement {
    constructor () {
        Object.defineProperty(this, "_private", {
            enumerable: false,
            writable: true,
            value: {}
        });

        this.classList = new Proxy([], {
            deleteProperty: function (target, property){
                console.log("Deleted ", target, property);
                return true;
            },
            set : function (target, property, value, recieves) {
                target[property] = value;
                console.log(`set ${property} to ${value} and ${recieves}`);
                return true;
            }
        })

        this.value = new Proxy([], {
            
        })

    }
    get id () {
        return this._private.id;
    }
    set id (prop) {
        // Implement changing Element
        return this._private.id = prop;
    }

}


