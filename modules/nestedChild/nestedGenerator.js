function Generator(data) {

    if (!data instanceof Object) {
        return;
    }
    // debugger;
    let el = document.createElement(data.type || "div");
    // let el = document.createElement("div");

    if (data.id) {
        el.id = data.id;
    }

    if (data.classList) {
        if (data.classList instanceof Array) {

            console.log("Class Array");
            data.classList.forEach(ElementClass => {
                el.classList.add(ElementClass);
            })
        } else {
            el.classList.add(data.classList)
        }
    }

    if (data.value instanceof Array) {
        data.value.forEach(child => {
            if (child instanceof HTMLElement) {
                el.appendChild(child);
            }else if (child instanceof Object) {
                el.appendChild(Generator(child));
            } else {
                let c = document.createElement("span");
                c.innerHTML = child;
                el.appendChild(c);
            }
        });
    } else {
        if (data.value instanceof HTMLElement) {
            el.appendChild(data.value);
        } else if (data.value instanceof Object) {
            el.appendChild(Generator(data.value));
        } else {
            el.innerHTML = data.value;
        }
    }

    if (data.events) {
        if (data.events instanceof Object)
        {

            for (prop in data.events) {
                el.addEventListener(prop, data.events[prop]);
            }
        }
        
    }

    return el;
}

onload = () => {
document.body.appendChild(
    Generator (
        
        {
            type: "menu", 
            classList: ['TopMenu'],
            id : "menu",
            value: [
                
                {
                    type: "ul",
                    classList: "MenuContainer",
                    value: [
                        
                    {
                        type: 'li',
                        value: "Text",
                        events: {
                            click : (e) => {
                                e.preventDefault();
                                console.log("FUCK CLICKED!!");
                                console.log("E CLicked", e);
                            }
                        }
                    },
                    {
                        type: 'li',
                        value: "Test"
                    },
                    {
                        type: 'li',
                        value: "Test2"
                    },
                    {
                        type: 'li',
                        value: "Text2"
                    }
                    
                    
                ]
            }
            
        ]
    }
    
    ))
}