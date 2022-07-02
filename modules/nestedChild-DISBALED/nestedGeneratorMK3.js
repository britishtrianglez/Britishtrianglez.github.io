NestedGenerator = (data) => {
    if (data == undefined || null) {
        return;
    }
    
    if (data instanceof Element) {
        return data;
    }
    if (!data instanceof Object) {
        return;
    }

    let el = document.createElement(data.type || "div");
    // let el = document.createElement("div");


    let ReturnObject = new Proxy({
        Element: el,
        id: el.id,
        classList: el.classList
    }, {
        deleteProperty: function(target, property) {
            console.info("MAIN LISTENER! - DELETE ", {target, property})
            delete target[property];
            return true;
        },
        set: function (target,property, value, recieves) {
            console.info("MAIN LISTENER! ADD -",{ target, property, value, recieves})
            target[property] = value;
            return true;
        }
    } )
    
    //     deleteProperty: function(target, property) {
    //     el.removeAttribute(property);
    //     delete target[property];
    //     return true;
    // },
    // set: function (target, property, value, recieves) {
    //     target[property] = value;
    //     el.setAttribute(property, value);
    //     console.log(`set ${property} to ${value} and ${recieves}`);
    //     return true;
    // } )


    // let ReturnObject = {
    //     Element: el,
    //     id : el.id,
    //     classList: el.classList
    // };

    if (data.id instanceof Function) {
        ReturnObject.id = data.id();
    } else if (data.id) {
        ReturnObject.id = data.id;
    }

    if (data.classList) {
        if (data.classList instanceof Function) {
            data.classList = data.classList();
        }

        if (data.classList instanceof Array) {
            data.classList.forEach(ElementClass => {
                ReturnObject.classList.add(ElementClass);
            })
        } else {
            el.classList.add(data.classList);
        }

    }

    // ReturnObject["value"] = new Proxy([],{
    //     deleteProperty: function (target, property) {
    //         delete target[property];
    //         console.log("ValueDeleting: ", target, property)
    //         return true;
    //     },
    //     set : function (target, property, value, recieves) {
    //         target[property] = value;
    //         console.log("ValueDeleting: ", target, property, value, recieves);
    //         return true;
    //     }
    // });
    // console.log("Value Set!")

    ReturnObject.NamedChildren = {};
    ReturnObject.value = new Proxy([],{
        deleteProperty: function (target, property) {
            // if (property)

            console.log("ValueDeleting: ", {target, property})
            if (target[property].type == "VALUE") {
                ReturnObject.Element.innerHTML = "";
                target[property] = "";
            } else {

                
                ReturnObject.Element.removeChild(target[property].Element);
                target[property]    
                delete target[property];
            }

            // Sort Array ?

            return true;
        },
        set : function (target, property, value, recieves) {
            // target[property] = value;
            if (property == 'length') {
                target.length = value;
                return true;
            }
            if (value.type == "VALUE") {
                ReturnObject.Element.innerHTML = value.value;
                target[property] = value;
            } else {
            
                let NwChild = NestedGenerator(value);
                target[property] = NwChild;
                
                if (NwChild.id != undefined && NwChild.id != "")
                {
                    console.log("Adding Named Child");
                    // debugger;
                    ReturnObject.NamedChildren[NwChild.id] = new Proxy(target[property],{});
                }
                
                ReturnObject.Element.appendChild(NwChild.Element);
            }

            console.log("ValueAdding!: ", {target, property, value, recieves});



            return true;
        }
    });

    if (data.value instanceof Function) {
        data.value = data.value();
    }

    if (data.value instanceof Array) {

        data.value.forEach(child => {
            if (child instanceof Function) {
                child = child();
            }
            if (child instanceof Object) {
                ReturnObject.value.push(child);
            }

        })

        // Get Object
        // Append Child
        // ReturnObject.value = [];
        // data.value.forEach(child => {
        //     if (child instanceof Function) {
        //         let ch = NestedGenerator(child);
        //         if (ch.id != undefined && ch.id != "" && ch.id == NaN)
        //         {
        //             ReturnObject.value[ch.id];
        //         } else {
        //             ReturnObject.value.push(ch);
        //         }
        //         el.appendChild(ch.Element);
        //     } else if (child instanceof Object) {
        //         let ch = NestedGenerator(child);
        //         if (ch.id != undefined && ch.id != "" && ch.id == NaN)
        //         {
        //             ReturnObject.value[ch.id];
        //         } else {
        //             ReturnObject.value.push(ch);
        //         }
        //         el.appendChild(ch.Element);
        //     } else {
        //         let ch = NestedGenerator( {value: child} );
        //         ReturnObject.value.push(ch);
        //         el.appendChild(ch.Element);
        //     }
        // });
    } else {

        if (data.value instanceof Object) {
            ReturnObject.value.push(data.value);
        } else {
            ReturnObject.value.push( {type: "VALUE", value: data.value} );
        }
    }



    ReturnObject["attributes"] = new Proxy({}, {
        deleteProperty: function(target, property) {
            el.removeAttribute(property);
            delete target[property];
            return true;
        },
        set : function (target, property, value, recieves) {
            target[property] = value;
            el.setAttribute(property, value);
            console.log(`set ${property} to ${value} and ${recieves}`);
            return true;
        }
    })

    if (data.attributes instanceof Object) {
        for (let attName in data.attributes) {
            ReturnObject.attributes[attName] = data.attributes[attName];
        }
    }



    ReturnObject["events"] = new Proxy({}, {
        deleteProperty: function (target, property) {
            el.removeEventListener(property, target[property]);
            return true;
        },
        set : function (target, property, value, recieves) {
            target[property] = value;
            el.addEventListener(property, value);
            // console.log({property,value,recieves});
            return true;
        }
    })

    if (data.events){
        if (data.events instanceof Object) {
            for (let prop in data.events){
                ReturnObject.events[prop] = data.events[prop];
            }
        }
    }


    return ReturnObject;
}

var TestButton = {
    type : "div",
    classList: "Blues",
    attributes: {
        hel: "WORLD"
    },
    value : [{
        type: "h1",
        value: "Hello World"
    }, {
        type: "div",
        value: {
            type: "h3",
            value: "Small h3"
        }
    }, {
        type: "div",
        classList :"Clickable",
        id : "clickMe",
        events: {
            click : (e) => {
                e.preventDefault();

                alert("Clicking Worked!!");
            }
        },
        value : "Click me"
    }]
}
globalThis["TestElement"] = NestedGenerator(TestButton);

