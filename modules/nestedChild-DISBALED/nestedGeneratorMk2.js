globalThis.NestedGenerator = (data) => {
    if (data instanceof Element) {
        return data;
    }
    if (!data instanceof Object) {
        return;
    }

    let el = document.createElement(data.type || "div");
    // let el = document.createElement("div");

    if (data.id) {

        if (data.id instanceof Function) {
            data.id = data.id();
        }

        el.id = data.id;
    }

    if (data.classList) {

        if (data.classList instanceof Function) {
            data.classList = data.classList();
        }

        if (data.classList instanceof Array) {
            data.classList.forEach(ElementClass => {
                el.classList.add(ElementClass);
            })
        } else {
            el.classList.add(data.classList)
        }
    }

    if (data.value instanceof Function) {
        data.value = data.value();
    }

    if (data.value instanceof Array) {
        data.value.forEach(child => {
            if (child instanceof HTMLElement) {
                el.appendChild(child);
            } else if (child instanceof Function) {
                el.appendChild(NestedGenerator(child()));
            } else if (child instanceof Object) {
                el.appendChild(NestedGenerator(child));
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
            el.appendChild(NestedGenerator(data.value));
        } else if (data.value instanceof Function) {
            el.appendChild(NestedGenerator(data.value()));
        } else {
            el.innerHTML = data.value;
        }
    }
    if (data.attributes) {
        if (data.attributes instanceof Object) {
            for (let prop in data.attributes) {

                if (data.attributes[prop] instanceof Function) {

                    el.setAttribute(prop, data.attributes[prop]());

                } else {
                    el.setAttribute(prop, data.attributes[prop]);
                }

            }
        }
    }
    if (data.events) {
        if (data.events instanceof Object) {

            for (let prop in data.events) {
                el.addEventListener(prop, data.events[prop]);
            }
        }

    }

    if (data.update instanceof Function) {
        
        


    }

    return el;
}
