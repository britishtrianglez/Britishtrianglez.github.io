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
        classList: el.classList,
        parent: data.parent || null,
        TopLevel: data.TopLevel|| null
    }, {
        deleteProperty: function (target, property) {
            delete target[property];
            return true;
        },
        set: function (target, property, value, recieves) {

            switch (property) {
                case "classList": {
                    UpdateClassList(target, value);
                    return true;
                    break;
                }
                case "id": {
                    UpdateID(target, value);
                    return true;
                    break;
                }
                case "value": {
                    UpdateValue(target, value);
                    return true;
                    break;
                }
                case "attributes": {
                    UpdateAttributes(target, value);
                    return true;
                    break;
                }
                case "events": {
                    UpdateEvents(target, value);
                    return true;
                    break;
                }
                case "style": {
                    UpdateStyle(target, value);
                    return true;
                    break;
                }
            }


            target[property] = value;
            return true;
        }
    })



    function UpdateID(target, value) {
        if (value instanceof Function) {
            value = value();
        }

        target.id = value;
        target.Element.id = value;
    }
    function UpdateClassList(target, values) {
        target.Element.classList.forEach(item => {
            target.Element.classList.remove(item)
        });

        if (values instanceof Function) {
            values = values();
        }

        if (values instanceof Array) {
            values.forEach(item => {
                if (item instanceof Function) {
                    item = item();
                }
                target.Element.classList.add(item);
            })
        }
    }
    function UpdateValue(target, values) {
        Array.from(target.Element.children).forEach(child => target.Element.removeChild(child));
        target.Element.innerHTML = "";

        if (ReturnObject.TopLevel == null) {
            target.namedChildren = {};
        } else {
            target.namedChildren = ReturnObject.TopLevel.namedChildren;
        }

        target.value = new Proxy([], {
            deleteProperty: function (target_value, property_value) {
                if (target_value[property_value].type == "VALUE") {
                    target.Element.innerHTML == "";
                    target_value[property_value] = "";
                } else {

                    if (target_value[property_value]?.id != undefined && target_value[property_value]?.id != "")
                    {
                        if (ReturnObject.TopLevel == null ) 
                        {
                            delete target.namedChildren[property_value.id];
                        } else {
                            delete ReturnObject.namedChildren[property_value.id];
                        }
                    }

                    target.Element.removeChild(target_value[property_value].Element);
                    delete target_value[property_value]
                }
                return true;
            },
            set: function (target_value, property_value, value_value, recieves_value) {
                if (property_value == "length") {
                    target_value.length = value_value;
                    return true;
                }

                if (value_value instanceof Function) {
                    value_value = value_value();
                }

                if (value_value instanceof Object) {

                    if (target.TopLevel == null) {
                        value_value["TopLevel"] = ReturnObject;
                    } else {
                        value_value["TopLevel"] = target.TopLevel;
                    }
                    
                    let child = NestedGenerator(value_value);
                    child.parent = ReturnObject;
                    if (ReturnObject.TopLevel == null) {
                        child.TopLevel = ReturnObject;
                    } else {
                        child.TopLevel = ReturnObject.TopLevel;
                    }


                    target_value[property_value] = child;


                    if (child?.id != undefined && child?.id != "") {
                        if (target.TopLevel == null) {
                            target.namedChildren[child.id] = target_value[property_value];
                        } else {
                            target.TopLevel.namedChildren[child.id] = target_value[property_value];
                        }
                    }
                    if (child?.Element != undefined) {
                        target.Element.appendChild(child.Element);
                    }
                } else {
                    target_value[property_value] = value_value ||"";

                    target.Element.innerText = value_value ||"";
                }

                return true;
            }
        })
        if (values instanceof Function) {
            values = values();
        }
        if (values instanceof Array) {
            values.forEach(value => {
                target.value.push(value);
            });
        } else {
            target.value.push(values);
        }
    }
    function UpdateAttributes(target, value) {
        if (target.attributes != null && target.attributes != undefined) {
            for (let att in target.attributes) {
                delete target.attributes[att];
            }
        }

        target.attributes = new Proxy({}, {
            deleteProperty: function (target, property) {
                el.removeAttribute(property);
                console.log("Removing Property", target);
                delete target[property];
                return true;
            },
            set: function (target, property, value, recieves) {
                target[property] = value;
                el.setAttribute(property, value);
                console.log(`set ${property} to ${value} and ${recieves}`);
                return true;
            }
        });




        if (value instanceof Object) {
            for (let attName in value) {
                target.attributes[attName] = value[attName];
            }
        }

    }
    function UpdateEvents(target, value) {
        if (target.events != null && target.events != undefined) {
            for (let event in target.events) {
                delete target.events[event]
            }
        }

        target.events = new Proxy({}, {
            deleteProperty: function (target, property) {
                el.removeEventListener(property, target[property]);
                delete target[property]
                return true;
            },
            set: function (target, property, value, recieves) {

                let handler = function (e) {
                    value.call(ReturnObject, e);
                }

                target[property] = handler;
                el.addEventListener(property, handler);
                return true;
            }
        });

        if (value instanceof Object) {
            for (let prop in value) {
                ReturnObject.events[prop] = value[prop];
            }
        }

    }
    function UpdateStyle (target, value) {
        for (let style in target.style)
        {
            delete target.style[style];
        }
            // delete target.style;

        target.style = new Proxy({}, {
            deleteProperty: function (target, property){
                el.style[property] = "";
                delete target[property];
                return true;
            },
            set: function (target, property, value) {
                console.log("Updating Systems")

                if (value instanceof Function) 
                {
                    value = value();
                }

                el.style[property] = value;
                target[property] = value;
                return true;
            }
        })

        if (value instanceof Object) {
            console.log("styles is objects ", value);
            for (let prop in value) {
                console.log("Updating styles", prop);
                target.style[prop] = value[prop];
            }
        }

    }

    if (data.id) {
        ReturnObject.id = data.id;
    }
    if (data.classList) {
        ReturnObject.classList = data.classList;
    }
    ReturnObject.value = data.value;
    ReturnObject.attributes = data.attributes;
    ReturnObject.events = data.events;
    ReturnObject.style = data.style;
    
    ReturnObject.parent = null;
    ReturnObject.TopLevel = null;

    return ReturnObject;
}

var TestButton = {
    type: "div",
    classList: "Blues",
    attributes: {
        hel: "WORLD"
    },
    style: {
        color: () => {
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            return '#' + randomColor;
        }
    },
    value: [{
        type: "h1",
        value: [
            {
                type: "h2",
                value: "SubAthon!"
            },
            {
                type: "div",
                value: [{
                    type: "h1",
                    id: "Test",
                    value: "Super Sub"
                }]
            }
        ],
        style: {
            color: () => {
                var randomColor = Math.floor(Math.random()*16777215).toString(16);
                return '#' + randomColor;
            }
        }
    }, {
        type: "div",
        value: {
            type: "h3",
            value: "Small h3"
        }
    }, {
        type: "div",
        classList: "Clickable",
        id: "clickMe",
        events: {
            click: function(e)  {
                e.preventDefault();
                alert("Clicking Worked!!");
                console.log(this);
            }
        },
        value: "Click me"
    }]
}
globalThis["TestElement"] = NestedGenerator(TestButton);

