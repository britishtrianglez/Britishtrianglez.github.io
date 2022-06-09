class Tabs {
    /**
     * 
     * @param {HTMLElement} Element
     * @param { { linkToCss : Path, Scroll : Boolean } } options
     */
    constructor(Element, options) {
        const linkToCss = options?.linkToCss || Element.getAttribute("linkToCss") ||"modules/tabs/tabs.css";
        // linkToCss = linkToCss || "modules/tabs/tabs.css";
        this.Scroll = JSON.parse(options?.scroll || Element.getAttribute("Scroll"));

        
        
        
        this.CurrentTab;
        
        
        this.container = Element;
        this.TabList = {};
        
        this.DefaultTab = this.container.getAttribute("Default") || options?.default;
        
        this.container.classList.remove("TabInit");
        this.container.classList.add("TabContainer");

        this._root = this.container.attachShadow({ mode: "open" });
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
        // Stick Tabs to Top
        var fstChild;
        if (this.Scroll) {
            this.TabSelector.style.top = 0;
            this.ContentContainer.style.overflow = "scroll";
            fstChild = this.container.firstElementChild;
        }


        this._root.appendChild(this.ContentContainer);
        // Convert Children to Tabs

        Array.from(this.container.children).forEach(child => {
            this.InsertTab(
                child.getAttribute("name") || "Default",
                child);
        });
        if (this.Scroll) {
            setTimeout(() => {
                this.TabList[fstChild.slot].tab.setAttribute("Selected", true);
                this.CurrentTab = fstChild.slot;
            }, 500);
        }
        // Get First Element then find first availble tab
        if (!this.DefaultTab) {

            let nameCheck = this.container.firstElementChild.slot;
            let done =  this.SelectTabIfVisible(nameCheck); 
            while (done == false && this.TabList[nameCheck].tab.nextElementSibling) {
                console.log(`Try And Select Tab ${nameCheck}`);
                done = this.SelectTabIfVisible(this.TabList[nameCheck].tab.nextElementSibling.returnName);
                nameCheck = this.TabList[nameCheck].tab.nextElementSibling.returnName;
            }
            if (done == false && this.Lander) {
                this.SelectTab(this.Lander)
            } else if (done == false ) {

                this.SelectTab(this.ContentContainer.firstElementChild.slot);
            }
        } else {
            this.SelectTab(this.container.getAttribute("Default"));
        }
    }
    // Create Landing Element ( What is shown if no tabs are pressent )
    CreateLandingElement(TabContent) {
        TabContent.parentElement.removeChild(TabContent);
        this.container.prepend(TabContent);
        this.Lander = TabContent;
        // this.container.appendChild(container);
    }
    /** 
     * @param {String} name 
     * @param {HTMLElement} container 
     * @param { {closable: Boolean, disabled: Boolean, hidden:Boolean} } options
     */
    InsertTab(name, container, options) {
        // Find Names
        container.style.display = "block";
        options = {
            closable: JSON.parse(options?.closable || container.getAttribute("closable") || false),
            disabled: JSON.parse(options?.disabled || container.getAttribute("disabled") || false),
            hidden: JSON.parse(options?.hidden || container.getAttribute("hidden") || false),
        }


        if ((JSON.parse(container.getAttribute("landing")) || options?.landing) == true) {

            // debugger;
            if (JSON.parse(container.getAttribute("hidden")) != false)
            {
                options.hidden = true;
            }
                        
            options.closable = false;
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

            if (this.TabList[newName] != undefined) {
                found = false;
            }
            Iteration++;
        }

        // Insert new tab

        // Create Slot - To Show Tabs
        let Slot = document.createElement("slot");
        Slot.name = newName;
        if (!this.Scroll) {
            Slot.style.display = "none";
        }
        this.ContentContainer.appendChild(Slot);

        container.slot = newName;

        // Create Tab for tab ment
        let tab = document.createElement("div");
        tab.classList.add("TabButton");
        tab.innerText = newName;
        this.TabSelector.appendChild(tab);

        // Install CloseButton
        tab.closeButton = document.createElement("div");
        tab.closeButton.classList.add("TabCloseButton");

        // Add Style for Closebutton hover effecy
        tab.closeButton.addEventListener("mouseover", (e) => {
            tab.setAttribute("CloseHovered", true);
        });
        tab.closeButton.addEventListener("mouseleave", (e) => {
            tab.removeAttribute("CloseHovered");
        });
        tab.appendChild(tab.closeButton);

        container.style.transition = "background 0.5s ease";

        if (container.parentElement != this.container) {
            container.parentElement?.removeChild(container);
            this.container.appendChild(container);

        }

        // Enable Selecting Tabs ( i333f tab isn't disabled )
        tab.clickListen = (e) => {
            this.SelectTab(newName, true);
        }
        if (options?.disabled != true) {
            tab.addEventListener('click', tab.clickListen);

        } else {
            tab.setAttribute("disabled", true);
        }
        // Tab => Set anility to return name
        tab["returnName"] = newName;

        if (JSON.parse(container.getAttribute("landing")) == true) {
            this.Lander = newName;
        }

        this.TabList[newName] = {
            tab: tab,
            slot: Slot,
            isClosable: options?.closable || false,
            isDisabled: options?.disabled || false,
            isHidden: options?.hidden || false,
            selectTab: (shouldHighlight) => {
                if (this.Scroll) {
                    Slot.scrollIntoView();
                    container.scrollIntoView({ block: "start", behavior: "smooth" });
                    if (shouldHighlight) {
                        let oldColor = getComputedStyle(container).background;
                        container.style.background = "rgba(100,220,100,0.5)";
                        setTimeout(() => {
                            container.style.background = oldColor;
                        }, 1000)
                    }

                    tab.setAttribute("Selected", true);
                } else {
                    tab.setAttribute("Selected", true);
                    Slot.style.display = "block";
                }
            },
            deselectTab: () => {
                if (this.CurrentTab == newName) {
                    this.CurrentTab = undefined;
                }
                tab.removeAttribute("Selected");
                if (!this.Scroll) {
                    Slot.style.display = "none";
                }
            },
            ChangeClosable: (closable) => {
                if (closable != true) {
                    tab.closeButton.classList.add("NoDisplay");
                    tab.closeButton.removeEventListener("click", this.TabList[newName].closeTab);
                } else {
                    tab.closeButton.classList.remove("NoDisplay");
                    tab.closeButton.addEventListener("click", this.TabList[newName].closeTab);
                }
            },
            closeTab: () => {
                
                let done = false;
                // Check if selected tab is being closed ( if not ignore reselecting tab)
                if (this.CurrentTab != newName) {
                    done = true;
                }
                // Disable Tab ( Auto Deselets tab and removes listeners )
                this.DisableTab(newName);


                this.SelectNextTab(newName);
                
                Slot.parentElement.removeChild(Slot);
                tab.parentElement.removeChild(tab);
                container.parentElement.removeChild(container);

                if (this.Lander == newName) {
                    delete this.Lander;
                }

                this.TabList[newName] = undefined;
                delete this.TabList[newName];



            }
        }
        if (options?.disabled != true) {
            if (!this.Scroll) {
                this.SelectTab(newName);
            }
        } else {
            tab.setAttribute("disabled", true);
        }
        this.TabList[newName].ChangeClosable(options?.closable);

        if (options?.hidden) {
            this.HideTab(newName);
        }

    }
    SelectNextTab (name) {
        let done =false;
        let checkName = name;
        // Loops threw all siblin tabs for next available tab
        while (done == false && this.TabList[checkName].tab.nextElementSibling) {
            console.log(`Try And Select Tab ${checkName}`);
            done = this.SelectTabIfVisible(this.TabList[checkName].tab.nextElementSibling.returnName);
            checkName = this.TabList[checkName].tab.nextElementSibling.returnName;
        }
        // Loops threw all previous tabs for next available tab
        if (done == false) {
            checkName = name;
            console.log(`Try And Select Tab ${checkName}`);
            while (done == false && this.TabList[checkName].tab.previousElementSibling) {
                done = this.SelectTabIfVisible(this.TabList[checkName].tab.previousElementSibling.returnName);
                checkName = this.TabList[checkName].tab.previousElementSibling.returnName;
            }
        }
        // If no tabs where found select lander tab ( if availble )
        if (done == false && this.Lander) {
            this.SelectTab(this.Lander)
        }
    }
    CloseTab(name) {
        if (!this.TabList[name]) {
            throw new Error("Tab Don't Exist", name);
        }
        this.TabList[name]?.closeTab();
    }

    EnableClose(name) {
        if (!this.TabList[name]) {
            throw new Error("Tab Don't Exist", name);
        }
        this.TabList[name].ChangeClosable(true);
    }
    DisableClose(name) {
        if (!this.TabList[name]) {
            throw new Error("Tab Don't Exist", name);
        }
        this.TabList[name].ChangeClosable(false);
    }

    SelectTab(name, shouldHighlight) {
        if (!this.TabList[name]) {
            throw new Error("Tab Dont Exist", name);
        }
        this.TabList[this.CurrentTab]?.deselectTab();
        this.TabList[name].selectTab(shouldHighlight);
        this.CurrentTab = name;
    }
    SelectTabIfVisible(name, shouldHighlight) {
        console.log(`Try And Select Tab ${name}`);

        if (!this.TabList[name]) {
            throw new Error("Tab Don't Exist", name);
        }
        if (!this.TabList[name].isHidden) {
            this.SelectTab(name, shouldHighlight);
            return true;
        } else {
            return false;
        }
    }
    EnableTab(name) {
        if (!this.TabList[name]) {
            throw new Error("Tab Don't Exist", name);
        }

        this.TabList[name].tab.addEventListener("click", this.TabList[name].tab.clickListen)
        this.TabList[name].tab.removeAttribute("disabled");
    }
    DisableTab(name) {
        if (!this.TabList[name]) {
            throw new Error("Tab Don't Exist", name);
        }

        if (this.CurrentTab == name) {
            this.TabList[this.CurrentTab]?.deselectTab();
        }
        this.TabList[name].tab.removeEventListener("click", this.TabList[name].tab.clickListen)
        this.TabList[name].tab.setAttribute("disabled", true);
    }
    // Hide Tab
    HideTab(name, deselectTab) {
        if (!this.TabList[name]) {
            throw new Error("Tab Don't Exist", name);
        }
        if (deselectTab != false) {
            // this.TabList.deselectTab(name);
            if (this.CurrentTab == name) {
                this.TabList[this.CurrentTab]?.deselectTab();
                this.SelectNextTab(name);
            }
        }

        this.TabList[name].isHidden = true;
        this.TabList[name].tab.classList.add("NoDisplay");
    }
    ShowTab(name, selectTab) {
        if (!this.TabList[name]) {
            throw new Error("Tab Don't Exist", name);
        }
        if (selectTab == true) {
            this.SelectTab(name);
        }
        this.TabList[name].isHidden = false;
        this.TabList[name].tab.classList.remove("NoDisplay");
    }
    HideAll (deselect) {
        for (let tabName in this.TabList) {
            this.HideTab(tabName, deselect);
        }
    }
    UnhideAll () {
        for (let tabName in this.TabList) {
            this.ShowTab(tabName);
        }
    }
    // Toggle Closable
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
