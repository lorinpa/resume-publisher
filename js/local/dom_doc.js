/*** This section contains utility methods. ***/

/** Closes any dialogs who's markup contrains the "control-dlg" css class.  **/
var closeDialogControls = function() {
    var controls = document.querySelectorAll(".control-dlg");
    var len = controls.length;
    var dlg = null;
    var style = null;
    for (var nIndex = 0; nIndex < len; nIndex++) {
        dlg = controls[nIndex];
        style = dlg.style;
        style.setProperty("display", "none");
    }
};
/** We have several controls which display the current list of "rows". Rows meaning the lines in our docucment.
*   This method gets the current list of rows from our "grid" object. Then creates a list of <option> elements.
*   Injects the option elements in to a <select> control. The select control is identifed by a css "id" attribute.
*   The element_id method paramater identifes the <select> control.
*/
var reloadSelectControl = function(element_id) {
    var rl = g.getRowList();
    var row_selection_options = rl.renderLocationSelect();
    document.querySelector(element_id).innerHTML = row_selection_options;
};
/** Success Message Box -Display
*   Displays success messages in a consistent location (footer) and theme (color, etc)
*   Clears the status bar so that only the success message is displayed in the status bar.
* */
var showSuccessMessage = function(msg) {
    var successMsgBox = document.querySelector("#success-msg");
    var style = successMsgBox.style;
    style.setProperty("display", "block");
    successMsgBox.textContent = msg;
    hideErrorMessage();
    hideInfoMessage();
};
/** Success Message Box - Hide
*   Hides the success message box.
* */
var hideSuccessMessage = function() {
    var successMsgBox = document.querySelector("#success-msg");
    var style = successMsgBox.style;
    style.setProperty("display", "none");
};
/** Error Message Box - Display
*   Displays an error message in a consistent location and theme (color, etc.).
*   Clears the status bar so that only the error message is displayed in the status bar.
*/
var showErrorMessage = function(msg) {
    var errorMsgBox = document.querySelector("#error-msg");
    errorMsgBox.textContent = msg;
    var style = errorMsgBox.style;
    style.setProperty("display", "block");
    hideSuccessMessage();
    hideInfoMessage();
};

/** Error Message Box - Hide
*   Hides the error message box.
* */
var hideErrorMessage = function() {
    var errorMsgBox = document.querySelector("#error-msg");
    var style = errorMsgBox.style;
    style.setProperty("display", "none");
};

/** Information Message Box - Display
*   Displays an information message in a consistent location and theme (color, etc.).
*   Clears the status bar so that only the information message is displayed in the status bar.
*/
var showInfoMessage = function(msg) {
    var infoMsgBox = document.querySelector("#info-msg");
    var style = infoMsgBox.style;
    style.setProperty("display", "block");
    infoMsgBox.textContent = msg;
    hideSuccessMessage();
    hideErrorMessage();
};

/** Information Message Box - Hide
*   Hides the information message box.
* */
var hideInfoMessage = function() {
    var infoMsgBox = document.querySelector("#info-msg");
    var style = infoMsgBox.style;
    style.setProperty("display", "none");
};

/** Event Listeners.
 *  Adds listeners for clicks and select control changes.
 *  Note! Considering the relative small number of controls in this application. We decided to simply load
 *  the event listeners once and retain them during the application's life. As opposed to dynamically adding and
 *  removing listeners.
 *
 *  @constructor
*/
var AppRouter  =  function() {

        /** Responds to click on menu item : Rows->Add Row */
        document.querySelector("#add-row-link").addEventListener("click", function(event) {
            event.preventDefault();
            closeDialogControls();
            g.addBlankRow();
            var table = g.render();
            report.innerHTML = table.outerHTML;
            showSuccessMessage("Row Added.");
        });

        /** Responds to click on menu item : Columns->Add Column (to specific row) */
        document.querySelector("#add-column-link").addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            closeDialogControls();
            var rowList = g.getRowList();
            var rowCount =  rowList.list.length;
            if (rowCount && rowCount > 0) {
                reloadSelectControl("#add-column-to-row");
                var dlg = document.querySelector("#add-column-dlg");
                var style = dlg.style;
                style.display = "block";
            } else {
                showErrorMessage("You Must Add a Row First. Unable to process requiest.");
            }
        });

        /** General event handler for all of the application's dialogs.
        *   Note! So once a dialog is displayed, the EventManager services events like a button or link click.
        *
        * */
        var EventManager = function() {
            /** Services the Add Column (to row) Dialog */
            this.addColumnListener = function(event) {
                event.preventDefault();
                var row_id = document.querySelector("#add-column-to-row").value;
                g.addBlankColumnToRow(row_id);
                var report = document.getElementById("report");
                var table = g.render();
                report.innerHTML = table.outerHTML;
                showSuccessMessage("Column Added.");
            };
            /** Services dialogs that are rendered in the header. Listens for a click on the close-icon.
             *  Allows the user to cancel dialogs located in the header.
             */
            this.dlgListener = function(event) {
                var tagName = event.target.tagName;
                switch (tagName) {
                    case 'I':
                        closeDialogControls();
                    break;
                }
            };
            /** Selects the appropriate dom elements and adds event listeners to them.
             *
             */
            this.init = function() {
                document.querySelector("#add-column-to-row-button").addEventListener("click", this.addColumnListener, true);
                document.querySelector("#dlg-controls").addEventListener("click", this.dlgListener, true);
            };
            this.init();
        };

        try {
            var eventManager = new EventManager();
        } catch (error) {
            console.log("Error installing EventManager: " + error);
       }
};
