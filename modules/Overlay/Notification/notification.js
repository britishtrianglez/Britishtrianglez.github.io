export function NotificationPlugin (linkToCss) {
    return {
        
        CurrentNotifications: [],
        
        
        /**
         * 
         * @param {CNotification} Notification 
         */
        addNotification(Notification) {
            this.CurrentNotifications.push(Notification);
            setTimeout(()=>{
                Notification._Elements.Main.removeAttribute("changing");
            }, 10);
            this._Element.appendChild(Notification._Elements.Main);
            Notification.parent = this._Element;
            // debugger;
            if (Notification._Elements.CloseBtn != "noClose") {

                Notification._Elements.CloseBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    
                    Notification.closeNotification(this._Element, e);
                    
                })
            }

            Notification._CloseOverride = () => {
                let NotIndex = this.CurrentNotifications.indexOf(Notification);
                this.CurrentNotifications.splice(NotIndex,1);
            }

        },
        /**
         * @param {HTMLElement} container 
         */
        init (container) {
            let cssLink = document.createElement("link");
                cssLink.rel = "stylesheet";
                cssLink.href = linkToCss;
            container.appendChild(cssLink)
                       
            this._Element = document.createElement("div");
            this._Element.classList.add("Notification_List_Container");
            container.appendChild(this._Element);
        }
    }
};

export class CNotification {
    /**
     * 
     * @param {String} title 
     * @param {String} message 
     * @param { {closable: Boolean, timeout: Int | false} } options 
     */
    constructor(title, message, options) {
        this._Elements = {
            Main: document.createElement("div"),
            TopBar: document.createElement("div"),
            Title: document.createElement("span"),
            CloseBtn: options?.closable == false ? "noClose" : document.createElement("span"),
            Message: document.createElement("div"),
            makeNotification: function () {
                this.Main.setAttribute("changing", true);
                this.Message.classList.add("Notification-Message");
                
                this.TopBar.classList.add("Notification-TopBar");
                this.Title.classList.add("Notification-Title");
                
                this.Main.append(this.TopBar, this.Message);
                this.TopBar.append(this.Title);

                if (options?.closable != false) {
                    this.CloseBtn.classList.add("Notification-CloseBtn");
                    this.TopBar.appendChild(this.CloseBtn);           
                }

                this.Main.classList.add("Notifications-Container");
            }
        }

        if (options?.timeout != false )
        {
            this._timeout = options?.timeout || 20000
        } else if (options?.timeout == false) {
            this._isTimeout = false;
        } 



        this._Elements.makeNotification();

        this.title = title;
        this.message = message;
    }
    set parent (param) {
        this._parent = param;
        if (this._isTimeout != false) {
            this.timeout = this._timeout;
            this.shouldPauseOnHover = true;
        }


    }
    get node() {
        return this._Elements?.Main || undefined;
    }

    set shouldPauseOnHover (shouldDoit) {
        this.MouseEnter = () => {
            this._Elements.Main.setAttribute("hovered", true);
            this.HandleTimeout(true);
            let MLeave = () => {
                this._Elements.Main.removeAttribute("hovered");
                this._Elements.Main.removeEventListener("mouseleave", MLeave);
                this.HandleTimeout(false)
            };
            
            this._Elements.Main.addEventListener("mouseleave", MLeave);
            
        }
        if (shouldDoit) {
            this._Elements.Main.addEventListener("mouseenter", this.MouseEnter);
        } else {
            this._Elements.Main.removeEventListener("mouseenter", this.MouseEnter);
        }
    }

    get timeout () {
        return this._timeout;
    }
    set timeout (param) {
        if (isNaN(param) && param != true && param != false )
        {
            console.log(`${param} was timeout`)
            throw new Error(`${param} is not a number or ${false}`);
        }

        if (param == false) {
            this.HandleTimeout(true);
            this.shouldPauseOnHover = false;
        } else if (param == true ) {
            this.shouldPauseOnHover = true;
            this.HandleTimeout(false);
        } else {
            this.shouldPauseOnHover = true;
            this._timeout = param;
            this.HandleTimeout(false)
        }

    }
    HandleTimeout (shouldPause) {
        
        if (shouldPause == true) {
            clearTimeout(this._timeoutHandler);
        } else {
                clearTimeout(this._timeoutHandler);
                this._timeoutHandler = setTimeout(() => {
                    this.closeNotification();
                }, this._timeout)
            }
    
    }
    get message() {
        return this._message;
    }
    set message(newMessage) {
        this._message = newMessage;
        this._Elements.Message.innerHTML = newMessage;
    }

    get title() {
        return this._title;
    }
    set title(newTitle) {
        this._title = newTitle;
        this._Elements.Title.innerHTML = this._title;
    }

    closeNotification (parent, event) {       
        let shouldClose =true;
        
        if (this.onClose instanceof Function)
        {
            shouldClose = this.onClose.call(this);
        }

        if (shouldClose != false) {

            
            this._Elements?.Main?.setAttribute("changing", true);
            setTimeout(() => {
                this.HandleTimeout(true);
                this.shouldPauseOnHover = false;

                this?._parent?.removeChild(this._Elements.Main, event);
                
                if (this._CloseOverride instanceof Function)
                {
                    this._CloseOverride();
                }
                
                for (let prop in this) {
                    this[prop] = null;
                    delete this[prop];
                }


                // delete this;
            }, 300);
                   
        }

    }

    _CloseOverride
    onClose
}