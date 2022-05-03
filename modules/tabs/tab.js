class Tabs {
    /**
     * 
     * @param {HTMLElement} Element 
     */
     constructor (Element, linkToCss) {
        linkToCss = linkToCss || "modules/tabs/tabs.css";

        this.CurrentTab;

        this.container = Element;
        this.TabList = {};
        
        this.container.classList.remove("TabInit");
        this.container.classList.add("TabContainer");

        this._root = this.container.attachShadow({mode: "open"});
        // Input CSS
        let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = linkToCss;
        this._root.appendChild(link);

        // Generate Tab Selector
        this.TabSelector = document.createElement("div");
        this.TabSelector.classList.add("TabMenu");

        this._root.appendChild(this.TabSelector);

        // Content Area
        this.ContentContainer = document.createElement("div");
        this.ContentContainer.classList.add("TabContent");
        this._root.appendChild(this.ContentContainer);

        // Convert Children to Tabs
        Array.from(this.container.children).forEach(child => {
            this.InsertTag(
                child.getAttribute("name")||"Default",
                child );
        })


        // Array.from(this.container.getElementsByClassName("Tab")).forEach(tab => {
            
        //     this.InsertTag(tab.getAttribute("name")||"Default", tab);

        // })


        
    }
    /**
     * 
     * @param {String} name 
     * @param {HTMLElement} container 
     * @param { {closable: Boolean, Disabled: Boolean} } options
     */
    InsertTag (name, container, options) {
        // Find Names

        options = {
            closable : JSON.parse( options?.closable || container.getAttribute("closable") || false),
            Disabled : JSON.parse( options?.Disabled || container.getAttribute("disabled") || false)
        }
        
        var found = false;
        var newName = name;
        var Iteration = 0;
        while (found == false) {
            found = true;
            if (Iteration == 0) {
                newName = name;
            } else {
                newName = name + " " + Iteration;
            }

            if (this.TabList[newName] != undefined)
            {
                found = false;
            }
            Iteration++;
        }

        // Insert new tab

        // Create Slot
        let Slot = document.createElement("slot");
            Slot.name = newName;
            Slot.style.display = "none";
            this.ContentContainer.appendChild(Slot);
        
        container.slot = newName;
        // Create Switch
        let tab = document.createElement("div");
            tab.classList.add("TabButton");
            tab.innerText = newName;
            this.TabSelector.appendChild(tab);
        
            
            
            
            if (container.parentElement != this.parentElement) {
                
                container.parentElement.removeChild(container);
                this.container.appendChild(container);
                
            }

            // Enable Selecting Tabs ( i333f tab isn't disabled )
            tab.clickListen = (e) => {
                this.SelectTab(newName);
            }
            if (options?.Disabled != true) {
                tab.addEventListener('click',tab.clickListen);

            } else {
                tab.setAttribute("disabled", true);
            }

            this.TabList[newName] = {
                tab : tab,
                slot: Slot,
                isClosable: options?.closable || false,
                isDisabled: options?.Disabled || false,
                selectTab: () => {
                    tab.setAttribute("Selected", true);
                    Slot.style.display = "block";
                },
                deselectTab : () => {
                    tab.removeAttribute("Selected");
                    Slot.style.display = "none";
                }
            }
            if (options?.Disabled != true) {
                this.SelectTab(newName);
            } else {
                tab.setAttribute("disabled", true);
            }

            
        }

        SelectTab (name) {
            if (!this.TabList[name]) 
            {
                throw new Error("Tab Dont Exist", name);
            }
            
            this.TabList[this.CurrentTab]?.deselectTab();
            this.TabList[name].selectTab();
            this.CurrentTab = name;
        }
        EnableTab (name) {
            if (!this.TabList[name]) {
                throw new Error ("Tab Don't Exist", name);
            }

            this.TabList[name].tab.addEventListener("click", this.TabList[name].tab.clickListen )
            this.TabList[name].tab.removeAttribute("disabled");
        }
        DisableTab (name) {
            if (!this.TabList[name]) {
                throw new Error ("Tab Don't Exist", name);
            }

            if (this.CurrentTab == name) {
                this.TabList[this.CurrentTab]?.deselectTab();
            }
            this.TabList[name].tab.removeEventListener("click", this.TabList[name].tab.clickListen )
            this.TabList[name].tab.setAttribute("disabled", true);
        }
        // Toggle Closable
        // Hide Tab
    }

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        let TabIndex = 0;
        Array.from(document.getElementsByClassName("TabInit")).forEach(tab => {
            if (tab.id != "") {
                globalThis[tab.id] = new Tabs(tab);
            } else {
                globalThis["Tab_"+TabIndex] = new Tabs(tab);
            }
        })
    }
}