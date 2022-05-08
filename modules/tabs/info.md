# TabInfo

Use Class `TabInit` to auto create tabs. All elements within this will be converted into selectable tabs. <br>
Default tabs are Visible and not Closable.
This will create a global veriable called `Tab_` + Iteration Number. If name `id` is set tab controller will be saved as this.

Tab controller can also be created by calling `new Tabs( Element, options )`;
options contain the attributes `Scroll`,`Default` and `linkToCss`.
Link to Css is the link to the style sheet to be imported into the tab element ( for the tab selecter , This is per tab controller. Default is `modules/tabs/tabs.css` ); 

Example
```js 
    let tab = document.getElementById("Tab Element container");
    const tabPannel = new Tabs(tab, { scroll: false, sefault: "Example Tab" }); 
```


# Tab Controller Attributes

|Attribute|Value Type|Description|
|--|--|--|
|Scroll| `Boolean` | Should the tab content be shown at once and allow scrolling ( Kind of brocken )|
| id | `String` | The name the tab controller will be saved as|
|default|`String`|The name of the tab that should be selected when loaded
|linkToCss|`String`|Link to Css is the link to the style sheet to be imported into the tab element ( for the tab selecter , This is per tab controller. Default is `modules/tabs/tabs.css` )|

## Insert Tab
This adds a new tab to the controller

Parameters
|Param|Value Type|Description|
|-|-|-|
|name|`String`|The name of the tab ( will be used to select tab, cannot be duplicates )
|container|`HTMLElement`|The Element that will be visiable when the tab is selected ( if element isn't within the the tab controller element it will be moved )|
|options|`Object`|Contains options for the tab

(The Option params are also imported from the attributes from the tab )

### Option Params
|option name|Value Type|Description|Default|
|-|-|-|-|
|closable|`Boolean`|Can the tab be closed | `false` |
|disabled|`Boolean`|Can the tab be switched to | `false`|
|hidden| `Boolean` |is the tab selector visible|`false`|
|landing|`Boolean` |is this the tab to show if there are no other tabs ( will set `hidden` to `true` unless `hidden` is `false`) | `false`



## TabController functions


|Function name|Params|Descrption|
|-|-|-|
|CloseTab| `Tab name` | Closes the tab with the passed name|
|EnableClose|` Tab name`| Shows close button on tab with passed name|
|DisableClose|`Tab Name`| Removes close button from tab with passed name|
|SelectTab|`Tab name` , `shouldHighlight`|Selects tab with passed name, if shouldHighlight is true will temporelly hightlight tab contents|
|SelectTabIfVisible|`TabName` , `shouldHighlight`|Selects tab with passed name if it isn't hidden, will return true or false depending on if tab is selected|
|EnableTab|`Tab Name`| Enables the tab with passed name, allows selecting tab ( via gui )  
|DisableTab|`Tab Name`| Disables the tab with passed name, removes ability to select tab (via gui)
|HideTab|`Tab Name` , `Should Deselect`|Removes tab selector from tab bar, if should deselect is true the next available tab will be selected|
|HideAll|`deselect`|Hides all tabs, if deselect is true deselects all tabs|
|UnhideAll|| Unhides all tabs|
|ShowTab|`Tab Name`, `Should Select`|Adds the tab select to tab bar, if should select is true selects said tab
|SelectNextTab|`Tab Name`| Finds the next tab that can be selected ( closest visible one after or before tab with name passed)|

Example
```js
let selectedNewTab = Tab_0.SelectTabIfVisible('First Tab', false);
```