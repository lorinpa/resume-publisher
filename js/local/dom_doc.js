/** Cell edit dialog.
 * This function constructs the html elements required to edit our document cell.
 * @class Cell edit dialog.
 * @constructor
 */
var form_gen = function(options) {
    this.init = function(options) {
        if (options && options.hasOwnProperty("href")) {
            this.href = href;
        }
        if (options && options.hasOwnProperty("row")) {
            this.row = options.row;
        }
        if (options && options.hasOwnProperty("column")) {
            this.column = options.column;
        }
        if (options && options.hasOwnProperty("content")) {
            this.content = options.content;
        }
        if (options && options.hasOwnProperty("css_class")) {
            this.css_class = options.css_class;
        }
        if (options && options.hasOwnProperty("elem")) {
            this.elem = options.elem;
        }
    };
    /** Renders the dialog.
    *   - Locates the dialog container elements (set to hidden).
    *   - Injects the dialog body elements with the cell chosen by the user (the cell link clicked on)
    * */
    this.render = function() {
        closeDialogControls();
        var editColumnContainer = document.querySelector("#edit-column-container");
        var row_input = document.createElement("input");
        row_input.setAttribute("type", "hidden");
        row_input.setAttribute("value", this.row);
        row_input.setAttribute("row_id", this.row);
        var column_input = document.createElement("input");
        column_input.setAttribute("type", 'hidden');
        column_input.setAttribute("value", this.column);
        column_input.setAttribute("column_id", this.column);
        var row_column = g.getRowColumn(this.row, this.column);
        var cell_col_span = document.querySelector("#cell-col");
        cell_col_span.textContent = row_column.getLocation();

        var rowList = g.getRowList();
        var rowObj = rowList.getRow(this.row);
        var cell_row_span = document.querySelector("#cell-row");
        cell_row_span.textContent = rowObj.getLocation();

        var text_area = document.createElement("textarea");
        text_area.setAttribute("rows", "8");
        text_area.setAttribute("cols", "120");
        text_area.setAttribute("id", "content-text-area");
        text_area.innerHTML = this.content;
        editColumnContainer.innerHTML = text_area.outerHTML;

        var css_fieldset = document.createElement("fieldset");
        var css_label = document.createElement("label");
        css_label.setAttribute("for", "css_clss_tf");
        css_label.appendChild(document.createTextNode("Style"));
        css_fieldset.innerHTML = css_label.outerHTML;
        var css_class_tf = document.createElement("input");
        css_class_tf.setAttribute("type", "text");
        css_class_tf.setAttribute("value", this.css_class);
        css_class_tf.setAttribute("id", "css_class_tf");
        css_fieldset.innerHTML += css_class_tf.outerHTML;
        editColumnContainer.innerHTML += css_fieldset.outerHTML;

        var button = document.createElement("button");
        button.setAttribute("id", "save-column");
        button.innerHTML = "Save";
        editColumnContainer.innerHTML += button.outerHTML;

        var delete_button = document.createElement("button");
        delete_button.setAttribute("id", "delete-column");
        delete_button.innerHTML = "Delete";
        editColumnContainer.innerHTML += delete_button.outerHTML;
        editColumnContainer.innerHTML += row_input.outerHTML;
        editColumnContainer.innerHTML += column_input.outerHTML;
        var control_panel = document.getElementById("edit-column-dlg");
        var style = control_panel.style;
        style.setProperty("display", "block");
    };
    this.init(options);
};


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

    /** Responds to click on menu item : Document->Set Title. */
    document.querySelector("#edit-title-link").addEventListener("click", function(event) {
        event.preventDefault();
        closeDialogControls();
        var dlg = document.querySelector("#edit-title-dlg");
        var style = dlg.style;
        style.display = "block";
    });

    /** Responds to click on menu item : Document->Load (from localStorage). */
    document.querySelector("#load-doc-link").addEventListener("click", function(event) {
        event.preventDefault();
        var table = document.querySelector("#report");
        g.load(table);
        showSuccessMessage("Document Loaded from Web Browser local database.");
    });
    /** Responds to click on menu item : Document->Store/Save  (to localStorage). */
    document.querySelector("#store-doc-link").addEventListener("click", function(event) {
        event.preventDefault();
        closeDialogControls();
        g.store();
        showSuccessMessage("Document Saved to Web Browser local database..");
    });

    /** Responds to click on menu item : Document->Save Data Export */
    document.querySelector("#save-json-link").addEventListener("click", function(event) {
        event.preventDefault();
        closeDialogControls();
        var link = g.toBlob();
        var dlg = document.querySelector("#export-json-dlg");
        dlg.style.setProperty("display", "block");
        var link_container = dlg.querySelector("#save-json");
        link_container.innerHTML = link.outerHTML;
    });

    /** Responds to click on menu item : Document->Import File Data */
    document.querySelector("#import-json-link").addEventListener("click", function(event) {
        event.preventDefault();
        closeDialogControls();
        var dlg = document.querySelector("#import-json-dlg");
        dlg.style.setProperty("display", "block");
    });

    /** Responds to click on menu item : Rows->Add Row */
        document.querySelector("#add-row-link").addEventListener("click", function(event) {
            event.preventDefault();
            closeDialogControls();
            g.addBlankRow();
            var table = g.render();
            report.innerHTML = table.outerHTML;
            showSuccessMessage("Row Added.");
        });

        /** Responds to click on menu item : Rows->Delete Row */
        document.querySelector("#delete-row-link").addEventListener("click", function(event) {
            event.preventDefault();
            closeDialogControls();
            reloadSelectControl("#delete-row");
            var dlg = document.querySelector("#row-delete-dlg");
            var style = dlg.style;
            style.display = "block";
        });

        /** Responds to click on menu item : Rows->Move Row Position */
        document.querySelector("#move-row-link").addEventListener("click", function(event) {
            event.preventDefault();
            closeDialogControls();
            reloadSelectControl("#change-row-position");
            reloadSelectControl("#new-row-position");
            var dlg = document.querySelector("#row-move-dlg");
            var style = dlg.style;
            style.display = "block";
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

        /** Responds to click in Delete Row Dialog->buttom  */
        document.querySelector("#delete-row-button").addEventListener('click', function(event) {
            var row_id = document.querySelector("#delete-row").value;
            g.deleteRow(row_id);
            document.querySelector("#report").innerHTML = g.render().outerHTML;
            reloadSelectControl("#delete-row");
            showSuccessMessage("Row Deleted.");
        });

         /** Responds to click on menu item : Document->Export. */
        document.querySelector("#export-doc-link").addEventListener("click", function(event) {
            event.preventDefault();
            closeDialogControls();
            var dlg = document.querySelector("#export-doc-dlg");
            var style = dlg.style;
            style.display = "block";
        });

        /** Responds to click on menu item : Document->Toggle Link Display. */
        document.querySelector("#toggle-doc-links-link").addEventListener("click", function(event) {
            event.preventDefault();
            var linkState = g.getUseLinks();
            var newState = linkState ? false : true;
            g.setUseLinks(newState);
            var table = g.render(newState);
            var report = document.querySelector("#report");
            report.innerHTML = table.outerHTML;
            showSuccessMessage("Document Link Display: " + newState + " .");
        });

        /** Responds to click on menu item : Document->Toggle Borders */
        document.querySelector("#toggle-doc-border-link").addEventListener("click", function(event) {
            event.preventDefault();
            g.toggleBorders();
            var newState = g.getUseLinks();
            var table = g.render(newState);
            var report = document.querySelector("#report");
            report.innerHTML = table.outerHTML;
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

            /** Determines which cell the user clicked.
            *   Looks through dom tree till it finds a link.
            *   Parses the link's href attribute and determine the row and column id of the cell we want to process
            *   (render in the Edit Cell Dialog).
            *
            *   Also captures when a user clicks the edit icon. The edit icons are displayed when the document "Grid" layout is set to display.
            *   The grid "Layout" allows the user to edit BLANK cells.
            */
            this.clickListener = function(event) {
                var tagName = event.target.tagName;
                event.preventDefault();
                event.stopPropagation();
                switch (tagName) {
                    case 'I':
                        var icon = event.target.className;
                        if (icon !== 'icon-pencil') {
                            closeDialogControls();
                            break;
                        }
                    case 'A':
                    default:
                        /*  * Note we have some redundent code -- editCellListenerll Handler does the same thing (below) */
                        var href = null;
                        var elem = event.target;
                        var not_found = true;
                        while (not_found) {
                            if (elem.href && elem.classList && elem.classList.contains("internal")) {
                                href = elem.href;
                                not_found = false;
                                break;
                            } else {
                                elem = elem.parentElement;
                                if (elem == null) {
                                    return;
                                }
                                // kind of a kludge -- we've reached the cell parent. So let's use querySelector and get the link
                                if (elem.hasAttribute("cell")) {
                                    elem =elem.querySelector("a.internal");
                                }
                            }
                        }
                        var elements = href.split("/");
                        var len = elements.length;
                        elem = null;
                        var srcElement = document.querySelector("a[href='" + "#" + href.split("#")[1] + "']");
                        for (var nIndex = 0; nIndex < len; nIndex++) {
                            elem = elements[nIndex];
                            if (elem.indexOf("#op") != -1) {
                                var row_id = elements[(nIndex + 2)];
                                var column_id = elements[(nIndex + 4)];
                                var columnList = g.getColumnList();
                                var column = columnList.getColumn(column_id);
                                var row_column = g.getRowColumn(row_id, column_id);
                                var fg = new form_gen({"row": row_id, "column": column_id,
                                    "content": column.getContent(), "css_class": row_column.getCssClass(), "elem": srcElement});
                                fg.render();
                                break;
                            }
                        }
                        break;
                }
            };

            /** Services dialogs that are rendered in the header. Listens for a click on the close-icon.
             *  Allows the user to cancel dialogs located in the header.
             */
            this.dlgListener = function(event) {
                var tagName = event.target.tagName;
                switch (tagName) {
                    case 'I':
                        //console.log("got icon click");
                        closeDialogControls();
                    break;
                    case 'BUTTON':
                        if (event.target.id && event.target.id ==='edit-title-button') {
                            var title = document.querySelector("#edit-title-tf").value;
                            document.title = title;
                            g.setTitle(title);
                            showSuccessMessage("Document title set to "+ title);
                        }
                    break;
                }
            };

            /** Services the edit-cell dialog (when the dialog is displayed to the user).
             *  The edit-cell dialog allows the user to change content, set css classes on the containing <div> element.
             *  The edit cell dialog also allows the user to Delete the cell.
             *  The user can cancel the edit dialog by clicking on the "close-icon".
             *
             */
            this.editCellListener = function(event) {
                event.preventDefault();
                var src = event.target.tagName;
                switch (src) {
                    case 'BUTTON':
                        var edit_dlg = document.querySelector("#edit-column-dlg>div[id='edit-column-container']");
                        var content = edit_dlg.querySelector("#content-text-area").value;
                        var css_class = edit_dlg.querySelector("#css_class_tf").value;
                        var row_id = edit_dlg.querySelector("input[row_id]").value;
                        var column_id = edit_dlg.querySelector("input[column_id]").value;
                        var columnList = g.getColumnList();
                        var column = columnList.getColumn(column_id);
                        var row_column = g.getRowColumn(row_id, column_id);
                        var operation = event.target.id;
                        switch (operation) {
                            case 'save-column':
                                column.setContent(content);
                                row_column.setCssClass(css_class);
                                showSuccessMessage("Column Save Successfully.");
                                break;
                            case 'delete-column':
                                g.deleteRowColumn(row_column);
                                // since a column can used in more than one row or location,
                                // we can't delete column if there are other instances remaining
                                if (g.getNumColumnReferences(column) === 0) {
                                    columnList.deleteColumn(column);
                                }
                                if (g.getNumColumnsInRow(row_id) === 0) {
                                    g.deleteRow(row_id);
                                }
                                showSuccessMessage("Column Deleted.");
                                break;
                        }
                        edit_dlg.querySelector("input[row_id]").value = "";
                        edit_dlg.querySelector("input[column_id]").value = "";
                        var report = document.getElementById("report");
                        var table = g.render();
                        report.innerHTML = table.outerHTML;
                        var dlg = document.querySelector("#edit-column-dlg");
                        var style = dlg.style;
                        style.setProperty("display", "none");
                        break;
                    case "I":
                        if (event.target.classList.contains("close-dlg-icon")) {
                            closeDialogControls();
                        }
                        break;
                }
            };

            /** Services the Import File Data Dialog.
             *  The user clicks on a file browse button (and dialog).
             *  This routine then reads the selected file. Checks that the file reader is complete.
             *  Reads the file's content as text.
             *  The file chosen must of been created by our Data Export routine. That means the file contrains
             *  a json object who contains 3 json arrays: rows, columns and row_columns
             *  This routine processes each array and at the end re-paints the document.
             *
             *  Note! We might want to move some of this logic in to the "grid" object.
             *  In general, the event listeners are located here. Once the file content is read in to memory. The remaining
             *  logic might be better housed in the grid.
            */
            this.importFileListener = function(event) {
                event.preventDefault();
                var file = event.target.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = function(file_event) {
                        if (this.readyState === this.DONE) {
                            var result = file_event.target.result;
                            var data = JSON.parse(result);
                            if (data && data instanceof Object) {
                                for (var segment in data) {
                                    //console.log(segment);
                                    switch (segment) {
                                        case 'rows':
                                            var rowList = g.getRowList();
                                            rowList.importList(data['rows']);
                                        break;
                                        case 'columns':
                                            var columnList = g.getColumnList();
                                            columnList.importList(data['columns']);
                                        break;
                                        case 'row_columns':
                                            var temp = data['row_columns'];
                                            var temp_list = JSON.parse(temp);
                                            g.importList(temp_list);
                                            var doc_div = document.querySelector("#report");
                                            var table = g.render();
                                            doc_div.innerHTML = table.outerHTML;
                                            // let's close the dialog and display a status
                                            closeDialogControls();
                                            showSuccessMessage("File Data Imported.")
                                        break;
                                        case 'title':
                                            var title = data['title'];
                                            g.setTitle(title);
                                            document.title = title;
                                        break;
                                    }
                                }
                            }
                        }
                    };
                }
            };

             /** Services the Change Row Position Dialog */
            this.changeRowPositionListener = function(event) {
                var origin_row_id = document.querySelector("#change-row-position").value;
                var destination_row_id = document.querySelector("#new-row-position").value;
                g.changeRowPosition(origin_row_id, destination_row_id);
                var report = document.getElementById("report");
                var table = g.render();
                report.innerHTML = table.outerHTML;
                showSuccessMessage("Row Position Changed.");
            };

            /** Selects the appropriate dom elements and adds event listeners to them.
             *
             */
            this.init = function() {
                document.querySelector("input#import-json").addEventListener("change", this.importFileListener, false);
                document.querySelector("#change-row-position-button").addEventListener("click", this.changeRowPositionListener, false);
                document.querySelector("#report").addEventListener("click", this.clickListener, true);
                document.querySelector("#edit-column-dlg").addEventListener("click", this.editCellListener, true);
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
