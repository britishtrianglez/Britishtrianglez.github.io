class Tab {
    constructor (name, container, options, parent) {
        this.__Data__ = {
            EventListener : {
                /**
                 * 
                 * @param {PointerEvent} e 
                 */
                TabClick : (e) => {
                    
                    if (e.path[0] == this.tabControl.closeButton)
                    {
                        return;
                    }

                    if (this.onSelect){
                        let Override = this.onSelect.call(this, e);
                        if (Override == undefined || Override == true)
                        {
                            this.parent.SelectedTab = this;
                        }
                    } else {
                        this.parent.SelectedTab = this;
                    }
                },
                closeButton : (e) => {
                    // e.preventDefault();
                    if(this.onClose){
                        let Override = this.onClose.call(this, e);
                        if (Override == undefined || Override == true){
                            this.parent.closeTab(this);
                        }
                    } else {
                        this.parent.closeTab(this);
                    }
                }
            }
        };
        
        this.parent= parent;


        this.slot = document.createElement("slot");
        this.slot.name = this.__Data__.name;
        this.slot.style.display = "none";
        this.container = container;

        // Create Tab Select Button
        this.tabControl = document.createElement("div");
        this.tabControl.classList.add("TabButton");
        // Put Text within span
        this.tabControl.span = document.createElement("span");
        this.tabControl.appendChild(this.tabControl.span);

        // Create Tab Close Button
        this.tabControl.closeButton = document.createElement("div");
        this.tabControl.closeButton.classList.add("TabCloseButton");

        // Add Close Button Style event
        this.tabControl.closeButton.addEventListener("mosueover", (e) => {
            this.tabControl.setAttribute("CloseHovered", true);
        })
        this.tabControl.closeButton.addEventListener("mouseleave", (e) => {
            this.tabControl.removeAttribute("CloseHovered");
        })

        this.tabControl.appendChild(this.tabControl.closeButton);
    
        this.Name = name;
        this.isDisabled = JSON.parse(options?.disabled || container.getAttribute("disabled") || false);
        this.isClosable = JSON.parse(options?.closable || container.getAttribute("closable") || false);
        this.isVisible = JSON.parse(options?.Visible || container.getAttribute("visible") || true)
    }

    deselectTab () {
        this.tabControl.removeAttribute("Selected");
        this.slot.style.display = "none";
    }
    selectTab () {
        this.tabControl.setAttribute("Selected", true);
        this.slot.style.display = "block";
    }
    // Set Visibilty
    get isVisible () {
        return this.__Data__.isVisible;
    }
    set isVisible (property) {
        if (property) {
            
            this.__Data__.isVisible = true;
            this.tabControl.style.display = "grid";


        } else {
            this.__Data__.isVisible = false;
            this.tabControl.style.display = "none";
        }
    }


    get isClosable () {
        return this.__Data__.isClosable;
    }
    set isClosable (property) {
        if (property) {
            this.__Data__.closeable = true;
            this.tabControl.closeButton.classList.remove("NoDisplay");
            this.tabControl.closeButton.addEventListener("click", this.__Data__.EventListener.closeButton);
        } else {
            this.tabControl.closeButton.classList.add("NoDisplay");
            this.tabControl.closeButton.removeEventListener("click", this.__Data__.EventListener.closeButton);
        }


    }
    get isDisabled () {
        return this.__Data__.disabled;
    }
    set isDisabled (property) {
        if (property) {
            this.__Data__.disabled = true;
            this.tabControl.setAttribute("Disabled", true);
            this.tabControl.removeEventListener("click", this.__Data__.EventListener.TabClick);
        } else {
            this.__Data__.disabled = false;
            this.tabControl.removeAttribute("Disabled");
            this.tabControl.addEventListener("click", this.__Data__.EventListener.TabClick);
        }
    }

    get Name () {
        return this.__Data__.name
    }
    set Name (property) {
        if (property == undefined || property == null || property == "")
        {
            property = "New Tab";
        }


        property = this.parent.getNewTabName(property);


        this.__Data__.name = property;
        
        // Rename Slot info
        this.slot.name = property;
        this.container.slot = property;
        // Change Tab Selector Text
        this.tabControl.span.innerText = property;


    }


    onSelect;
    onClose;
    

}

class Tabs {
    /**
     * 
     * @param {HTMLElement} Element 
     * @param {{ linkToCss : Path, Scroll : Boolean }} options 
     */
    constructor(Element, options) {


        const linkToCss = options?.linkToCss || Element.getAttribute("linkToCss") ||"modules/tabs/tabs.css";
        this.container = Element;

        this.__Data__ = {
            DefaultTab: undefined,
            CurrentTab: undefined
        }

        this.TabList = {};

        // Set Default tab
        this.DefaultTab = this.container.getAttribute("Default") || options?.default;

        // Create Classlist for tab container
        this.container.classList.remove("TabInit");
        this.container.classList.add("TabContainer");

        // Attach Root
        this._root = this.container.attachShadow({mode:"open"})
        // Input CSS
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = linkToCss;
        this._root.appendChild(link);
        // Create selecter element
        this.TabSelecter = document.createElement("div");
        this.TabSelecter.classList.add("TabMenu");
        this._root.appendChild(this.TabSelecter);

        // Create Content Area
        this.ContentConainer = document.createElement("div");
        this.ContentConainer.classList.add("TabContent");
        this._root.appendChild(this.ContentConainer);
        

        let FirstChild;
        Array.from(this.container.children).forEach(child => {
            let resp = this.InsertTab(
                child.getAttribute("name") || "Default",
                child);
        if (FirstChild == undefined) {
            FirstChild = resp;
        }

        });

        // Select Default or first child
        this.SelectedTab = this.container.getAttribute("default") || FirstChild;
    }
    getNewTabName (name) {
        let found = false;
        let newName = name;
        let iteration = 0;
        while (found = false)
        {
            found = true; 
         
            // Inrement name number
            if (iteration == 0) {
                newName = name 
            } else {
                newName = name + " " + iteration;
            }
            if (this.TabList[newName] != undefined) {
                found = false;
            }
            iteration++;
        }

        return newName;
    }
    InsertTab (name, container, options) {
        let newTab = new Tab(name,container,options, this);
        this.TabSelecter.appendChild(newTab.tabControl);
        this.TabList[newTab.Name] = newTab;
        this.ContentConainer.appendChild(newTab.slot);
        return newTab.Name;
    }
    // Close Tab
    closeTab (tab) {
        if (tab instanceof Tab) {
            if (!this.TabList[tab.Name])
            {
                throw new Error ("Tab Don't Exist in tablist :", tab)
            }

            console.log("Closing Tab!!!", tab.Name);
        } else {
            if (!this.TabList[tab]) {
                throw new Error ("Tab Don't Exist in tablist :", tab);
            }

            console.log("Closing tab!!!", tab);
        }
    }
    // Current - Selected tab
    get SelectedTab () {
        return this.__Data__.CurrentTab;
    }
    set SelectedTab (tab) {
        if (tab instanceof Tab) {
            if (!this.TabList[tab.Name]) {
                throw new Error("Tab Don't Exist in this TabList", tab);
            }
            // debugger;
            this.SelectedTab?.deselectTab();
            this.TabList[tab.Name].selectTab();
            this.__Data__.CurrentTab = tab;
        } else {
            if (!this.TabList[tab]) {
                throw new Error("Tab Don't Exist in TabList", tab);
            }
            this.SelectedTab = this.TabList[tab];

            // this.SelectedTab?.deselectTab();
            // this.TabList[tab].selectTab();
            // this.__Data__.CurrentTab = tab;
        }


    }

    // Set Default Tab
    get DefaultTab () {
        if ( this.__Data__.DefaultTab ) {
            return this.__Data__.DefaultTab
        } else {
            return null;
        }
    }
    set DefaultTab (property) {

        if (property != undefined && property != null && property != "")
        {
            this.__Data__.DefaultTab = property
        }

    }
}

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        let TabIndex = 0;
        Array.from(document.getElementsByClassName("TabInit")).forEach(tab => {
            if (tab.id != "") {
                globalThis[tab.id] = new Tabs(tab);
            } else {
                globalThis["Tab_" + TabIndex] = new Tabs(tab);
            }
        })
    }
}
