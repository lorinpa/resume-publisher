/** Row entity
 *  @property id: unique identifier (key)
 *  @property location: top of document is row location 1. We increment
 *  the location value as rows are added below.
 *  @constructor
 */
var row = function(options) {
    this.init = function(options) {
        if (options && options.hasOwnProperty("id")) {
            this.id = options.id;
        }
        if (options && options.hasOwnProperty("location")) {
         this.location = options.location;
        }
    };
    this.setId = function(id) {
        this.id = id;
    };
    this.getId = function() {
        return this.id;
    };
    this.setLocation = function(location) {
        this.location = location;
    };
    this.getLocation = function() {
        return this.location;
    };
    this.init(options);
};
/** Row Collection
 *  A simple collection of row entities.
 *  @constructor
 *  @class
 */
var rowList = function() {
    this.list = [];
    /** Add new row entity to the collection */
    this.addRow = function(row) {
        this.list.push(row);
    };
    /** Delete row entity from the collection */
    this.deleteRow = function(row_id) {
        var len = this.list.length;
        var index = null;
        var elem = null;
        for (var nIndex=0; nIndex < len; nIndex++) {
            elem = this.list[nIndex];
            if (elem.getId()== row_id) {
                index = nIndex;
                break;
            }
        }
        if (index !== null) {
            this.list.splice(index,1);
        }
    };
    /** Get row entity by id (key) */
    this.getRow= function(row_id) {
        var len = this.list.length;
        var row = null;
        for (var nIndex=0; nIndex < len; nIndex++) {
            row = this.list[nIndex];
            if (row_id == row.getId()) {
                break;
            }
        }
        return row;
    };
    /** Get the maximum row location value
     *  we iterate through the list because the order is not guaranteed to
     *  be in either ascending or descending location order.
     */
    this.getLastRowLocation = function() {
        var len = this.list.length;
        var last =0;
        var elem = null;
        for (var nIndex =0; nIndex < len; nIndex++) {
            elem = this.list[nIndex];
            if (elem.getLocation()> last) {
                last = elem.getLocation();
            }
        }
        return last;
    };

    /** Replace the current collection with a new set of row entities.***/
    this.importList= function(import_list) {
        var json_list = JSON.parse(import_list);
        if (json_list && (json_list instanceof Array || json_list instanceof Object)) {
            var len = json_list.length;
            this.list.length=0;
            var dataRow = null;
            for (var nIndex = 0; nIndex < len; nIndex ++) {
                dataRow = json_list[nIndex];
                this.addRow(new row(dataRow));
            }
        }
    };
    /** Creates the option list for the add-column-to-row select control
    *   Sets the option value to row.id and option text to row.location.
    *   Note. We sort the list by location value
     */
    this.renderLocationSelect= function() {
        this.list.sort(function(a,b){
            return a.getLocation() - b.getLocation();
        });
        var strCache = [];
        var len = this.list.length;
        var elem = null;
        var op_start = "<option value=\"";
        var op_end = "\">";
        var op_close = "</option>";
        for (var nIndex= 0; nIndex < len; nIndex++) {
            elem = this.list[nIndex];
            strCache.push(op_start+elem.getId()+op_end+elem.getLocation()+op_close);
        }
        return strCache.join();
    };
};

/** Column entity.
 *  @property id: unique identifier (key)
 *  @property content: text or html. Holds the actual document cell value.
 *
 *  Note! We originally thought a column might be rendered in several locations.
 *  Thus we set the column's location in the row_column entity. Enabling a one to many locations
 *  relationship for columns.
 *  @constructor
 */
var column = function(options) {
    this.init= function(options) {
        if (options && options.hasOwnProperty("id")) {
            this.id = options.id;
        }
        if (options && options.hasOwnProperty("content")) {
            this.content = options.content;
        }
    };
    this.getId = function() {
        return this.id;
    };
    this.setId = function(id) {
        this.id = id;
    };
    this.getContent = function() {
        return this.content;
    };
    this.setContent = function(content) {
        this.content = content;
    };
    this.init(options);
};
/** Collection of column entities
 *
 *  @constructor
 */
var columnList = function() {
    this.list = [];
    /** Add column entity to the collection */
    this.addColumn= function(col) {
        this.list.push(col);
    };

    /** Delete column entity from the collection */
    this.deleteColumn = function(column) {
        var id = column.getId();
        var len = this.list.length;
        var index = null;
        var elem = null;
        for (var nIndex=0; nIndex < len; nIndex++) {
            elem = this.list[nIndex];
            if (elem.getId()== id) {
                index = nIndex;
                break;
            }
        }
        if (index !== null) {
            this.list.splice(index,1);
        }
    };

    /** Get column entity by id value (key). */
    this.getColumn= function(column_id) {
        var len = this.list.length;
        var col = null;
        for (var nIndex =0; nIndex < len; nIndex++) {
           col = this.list[nIndex];
           if (column_id == col.getId()) {
                break;
           }
        }
        return col;
    };

    /** Replace collection with new list of column entities. */
    this.importList= function(import_list) {
        var json_list = JSON.parse(import_list);
        if (json_list && (json_list instanceof Array || json_list instanceof Object)) {
            var len = json_list.length;
            this.list.length = 0;
            var dataRow = null;
            for (var nIndex = 0; nIndex < len; nIndex ++) {
                dataRow = json_list[nIndex];
                this.addColumn(new column(dataRow));
            }
        }
    };
};
/** Cell entity.
 *  Note! This should be refactored to read "cell" instead of row_column.
 *  @property id: unique indentifier (key)
 *  @property row_id: foreign key reference to related row entity
 *  @property colum_id: foreign key reference to related column entity
 *  @property location: defines left to right location within the containing row. The left most
 *  cell is defined as location 1. location values are incremented as cells are added to the
 *  right (within a specific row).
 *  css_class: value should be a css class definition located in any of the document's css files.
 *  Note! this application makes heavy use of Twitter Bootstap. Thus, the default css_class value is span1.
 *  There are 12 span values to a row. See the Twitter Boostrap docs for more detailed info.
 *  @constructor
 */
var row_column = function(options) {
    this.init = function(options) {
        if (options && options.hasOwnProperty("id")) {
            this.id = options.id;
        }
        if (options && options.hasOwnProperty("row_id")) {
            this.row_id = options.row_id;
        }
        if (options && options.hasOwnProperty("column_id")) {
            this.column_id = options.column_id;
        }
        if (options && options.hasOwnProperty("location")) {
            this.location = options.location;
        }
        if (options && options.hasOwnProperty("css_class")) {
            this.css_class = options.css_class;
        }
    };
    this.getId = function() {
        return this.id;
    };
    this.setId = function(id) {
        this.id = id;
    };
    this.getRowId=function() {
        return this.row_id;
    };
    this.setRowId = function(id) {
        this.row_id = row_id;
    };
    this.getColumnId = function() {
        return this.column_id;
    };
    this.setColumnId=function(column_id){
        this.column_id = column_id;
    };
    this.getLocation = function() {
        return this.location;
    };
    this.setLocation = function(location) {
        this.location = location;
    };
    this.getCssClass=function() {
        return this.css_class;
    };
    this.setCssClass=function(css_class) {
        this.css_class = css_class;
    };
    this.init(options);
};
/** Grid represents the resume document.
 *  Similar to a "worksheet". Puts the row,columns and cells together
 *  to form the resume document.
 *  @property list: collection of row_column entities (cells)
 *  @property rowList: instance or row_list
 *  @property columnList: instance of column_list
 *  @property useBorders: boolean determines outline view on or off
 *  @property useLink: boolean determine whether cell edit links are on or off
 *  @property title: string stores the document's title value. Defaults to "Resume", the user
 *  has the option to set a custom tile (E.G. their name).
 *  @class
 */
var grid = function(options) {
    this.list = [];
    this.init = function(options) {
        if (options && options.hasOwnProperty("list")) {
            this.list = options.list;
        }

        if (options && options.hasOwnProperty("rowList")) {
            this.rowList = options.rowList;
        }

        if (options && options.hasOwnProperty("columnList")) {
            this.columnList = options.columnList;
        }

        if (options && options.hasOwnProperty("useBorders")) {
            this.userBorders = options.userBorders;
        } else {
            this.userBorders = false; // default
        }

        if (options && options.hasOwnProperty("useLinks")) {
            this.useLinks = options.useLinks;
        } else {
            this.useLinks = true; // default
        }

        if (options && options.hasOwnProperty("title")) {
            this.title = options.title;
        } else {
            this.title = 'Resume'; // default
        }
    };
    this.setTitle=function(title){
        this.title = title;
    };
    this.getTitle=function() {
        return this.title;
    };
    this.setUseLinks=function(useLinks) {
        this.useLinks = useLinks;
    };
    this.getUseLinks=function(){
        return this.useLinks;
    };
    this.setUseBorders=function(userBorders) {
        this.userBorders = userBorders;
    };
    this.getUseBorders = function() {
        return this.userBorders;
    };
    this.toggleBorders=function() {
        if (this.userBorders === true) {
            this.userBorders = false;
        } else {
            this.userBorders= true;
        }
    };
    /** Add row_column cell entity to the list collection */
    this.addRowColumn= function(row_column) {
        this.list.push(row_column);
    };

      /** Delete row_column cell entity from the list collection */
    this.deleteRowColumn = function(row_column) {
        var id = row_column.getId();
        var len = this.list.length;
        var index = null;
        var elem = null;
        for (var nIndex=0; nIndex < len; nIndex++) {
            elem = this.list[nIndex];
            if (elem.getId()== id) {
                index = nIndex;
                break;
            }
        }
        if (index !== null) {
            this.list.splice(index,1);
        }
    };
    /** Counts the number of times a column entity id is referred to in this row_column list collection */
    this.getNumColumnReferences=function(column) {
        var len = this.list.length;
        var elem = null;
        var count = 0;
        var id = column.getId();
        for (var nIndex=0; nIndex < len; nIndex++) {
            elem = this.list[nIndex];
            if (elem.getColumnId() == id) {
                count++;
            }
        }
        return count;
    };

    /** Check to see if we this row is empty **/
    this.getNumColumnsInRow=function(row_id) {
        var len = this.list.length;
        var elem = null;
        var count = 0;
        for (var nIndex=0; nIndex < len; nIndex++) {
            elem = this.list[nIndex];
            if (elem.getRowId() == row_id) {
                count++;
            }
        }
        return count;
    };

    /** Delete a row entity from this row_list instance.
    *   Moves the location values of all rows below the deleted row.
    * */
    this.deleteRow=function(row_id) {
        var row_position = null;
        var row_column = null;
        var row  = null;
        var column = null;
        var row_column_delete_list = [];
        var column_delete_list = [];
        var len = this.list.length;
        for (var nIndex= 0; nIndex < len; nIndex++) {
            row_column = this.list[nIndex];
            if (row_column && (row_column.getRowId() == row_id)) {
                row_column_delete_list.push(row_column);
                column_delete_list.push(this.columnList.getColumn(row_column.getColumnId()));
            }
        }
        len = row_column_delete_list.length;
        for (var nIndex=0; nIndex < len; nIndex++) {
            row_column = row_column_delete_list[nIndex];
            this.deleteRowColumn(row_column);
        }
        len = column_delete_list.length;
        for (var nIndex=0; nIndex < len; nIndex++) {
            column = column_delete_list[nIndex];
            if (this.getNumColumnReferences(column) === 0){
                this.columnList.deleteColumn(column);
            }
        }
        row = this.rowList.getRow(row_id);
        row_position = row.getLocation();
        this.rowList.deleteRow(row_id);
        // finally renumber the location values
        len = this.list.length;
        var location = null;
        for (var nIndex=0; nIndex < len; nIndex++){
            row_column = this.list[nIndex];
            row = this.rowList.getRow(row_column.getRowId());
            if (row.getLocation() > row_position) {
                location = row.getLocation();
                if (location > 0) {
                    location = location -1;
                    row.setLocation(location);
                }
            }
        }
    };

    /** Get a row_column cell entity */
    this.getRowColumn = function(row_id, column_id){
        var row_column = null;
        var len = this.list.length;
        for (var nIndex=0;nIndex < len; nIndex++) {
            row_column = this.list[nIndex];
            if (row_id == row_column.getRowId() && column_id == row_column.getColumnId()  ){
                break;
            }
        }
        return row_column;
    };
    /** Get this instance of rowList **/
    this.getRowList = function() {
        return this.rowList;
    };
    /** Get this instance of columnList. */
    this.getColumnList = function() {
        return this.columnList;
    };

    /** Gets the greatest value for column location in the set of row columns identified by row_id.
    *   We use this method after a user chooses to delete a column. If there are no columns remaining in the
    *   row, we remove the row also.
    *   @param row_id identifies the row_column stored in this row_column collect list. The row_column is identified by
    *   where row_column.row_id field equals the row_id parameter value.
    * */
    this.getLastColumnLocation= function(row_id) {
        var last = 0;
        row_id = parseInt(row_id);
        var len = this.list.length;
        var elem  = null;
        for (var nIndex=0; nIndex < len; nIndex++) {
            elem = this.list[nIndex];
            if (elem.getRowId()  == row_id && elem.getLocation() > last) {
                last = elem.getLocation();
            }
        }
        return last;
    };

    /** Replace this row_column collection list */
    this.importList=function(row_column_list) {
        var self = this;
        this.list.length = 0;
        function importRowColumn(element, index, array) {
            self.addRowColumn(new row_column(element));
        }
        row_column_list.forEach(importRowColumn);
    };

    /** Adds a new row. Internally we add a new row entity, column entity and a row_column cell */
    this.addBlankRow = function() {
        // allows the user to add a logical row -- internally a new
        // row, column (content filled with default/placeholder) and row_column
        var self = this;
        var rows = this.getRowList();
        var last_row_location  =  rows.getLastRowLocation();
        last_row_location +=1;
        var id = new Date().getTime();
        this.rowList.addRow( new row( {"id":id,"location":last_row_location}));
        this.columnList.addColumn( new column({"id":id,"content":"Blank Column"}));
        this.addRowColumn(new row_column({"row_id":id,"column_id":id, "id":id,"location":1,"css_class":"span2"}));
    };
    /** Add a new column to the row identified by row_id. Internally we add a new column entity and row_column cell to relate the
     *  column to the row.
    */
     this.addBlankColumnToRow=function(row_id) {
        var id = new Date().getTime();
        var last_column_location = this.getLastColumnLocation(row_id);
        last_column_location +=1;
        this.columnList.addColumn( new column({"id":id,"content":"Blank Column"}));
        this.addRowColumn(new row_column({"row_id":row_id,"column_id":id, "id":id,"location":last_column_location,"css_class":"span2"}));
        this.sortByRowLocation();

    };
    /** Sorts this row_column collection list by row location in ascending order
    *
    */
    this.sortByRowLocation=function() {
         var row_a, row_b;
         var row_result;
         var result = null;
         var self = this;
         this.list.sort(function(a,b){
            row_a = self.rowList.getRow(a.getRowId());
            row_b = self.rowList.getRow(b.getRowId());
            row_result = row_a.getLocation() - row_b.getLocation();
            if (row_result === 0) {
                result = a.getLocation() - b.getLocation();
            } else {
                result = row_result;
            }
            return result;
        });
     };

    /** Resets row locations.
    *   Logically, the row identified by origin_row_id is inserted after the row
    *   identified by destination_row_id. We determine the direction of the change.
    *   If we are moving a row up, any rows which currently are above (have a row position
    *   who's location value is greater than the origin row's location value), have their locations
    *   reduced. In other words, those rows are pushed down.
    *
    *   If the move direction is down. Then any rows below (rows who's location values are less than the location
    *   value of the origin row are incremented) are pushed up.
    *
    *   If the user selects the same row for both origin and destination, this method performs no action. Simply returns.
    * */
    this.changeRowPosition=function(origin_row_id, destination_row_id){
        var origin_row = this.rowList.getRow(origin_row_id);
        var destination_row = this.rowList.getRow(destination_row_id);
        var o_location = origin_row.getLocation();
        var d_location = destination_row.getLocation();
        if ( o_location == d_location) {
            return;
        }

        var direction = (o_location > d_location) ? 'down' : 'up';
        var elem = null;
        var len = this.rowList.list.length;
        var elem_loc = null;
        switch(direction) {
            case 'down':
                for (var nIndex=0; nIndex < len; nIndex++){
                    elem = this.rowList.list[nIndex];
                    elem_loc = elem.getLocation();
                    if (elem_loc > d_location && elem_loc < o_location) {
                        elem_loc +=1;
                        elem.setLocation(elem_loc);
                    }
                    if (elem_loc == o_location) {
                        // if we found the destination element
                        destination_row.setLocation((d_location +1));
                        origin_row.setLocation(d_location);
                        this.sortByRowLocation();
                        break;
                    }
                }
            break;
            case 'up':
                for (var nIndex=0; nIndex < len; nIndex++){
                    elem = this.rowList.list[nIndex];
                    elem_loc = elem.getLocation();
                    if (elem_loc > o_location && elem_loc < d_location) {
                        elem_loc -=1;
                        elem.setLocation(elem_loc);
                    }
                    if (elem_loc == d_location) {
                        // if we found the destination element
                        destination_row.setLocation((d_location -1));
                        origin_row.setLocation(d_location);
                        this.sortByRowLocation();
                        break;
                    }
                }
            break;
        }
    };

    /** Creates a document cell. The render_links_arg parameter determines whether
     *  we add a parent link around the cell. A parent link allows the user to click
     *  on the cell to invoke the edit cell dialog.
     *
     *  If the grid's useBorders value is set to true, this method adds additional editing
     *  hints to the display. This method adds a border to each cell as well as a clickable
     *  icon. The "edit icon" allows the user to select cells which have either no content or
     *  a non-displayable content such as &nbsp;.
     *
     *  Note! This method logically renders the user's resume document. Thus, this method is
     *  used by the "export to HTML" function.
     *
     *  @param render_links_arg sets whether "edit links" are rendered around each document cell. Note!
     *  these links are only visible for cells that contain content. To allow the user to edit cells whose content
     *  is empty, set the grid.userBorders property to true.
     */
    this.render = function(render_links_arg) {
        var render_links = (render_links_arg === false) ? false : true;
        var table = document.createElement("div");
        table.setAttribute("class","container-fluid");
        var headerfrag = document.createDocumentFragment();
        var tr = document.createElement("div");
        tr.setAttribute("class","row-fluid");
        var docfrag = document.createDocumentFragment();
        var len = this.list.length;
        var row_column = null;
        var row = null;
        var column = null;
        var current_row_id  = null;
        var first_row = this.list[0];
        var td = null;
        var link = null;

        var edit_icon_div = document.createElement("div");
        var icon_elem = document.createElement("i");
        edit_icon_div.style.setProperty("float","right");
        icon_elem.classList.add('icon-pencil');
        edit_icon_div.appendChild(icon_elem);
        current_row_id = first_row.getRowId();
        for (var nIndex =0; nIndex < len; nIndex++) {
            row_column = this.list[nIndex];
            row = this.rowList.getRow(row_column.getRowId());
            column = this.columnList.getColumn(row_column.getColumnId());
            if (current_row_id !== row.getId()) {
                docfrag.appendChild(tr);
                current_row_id = row.getId();
                tr = document.createElement("div");
                tr.setAttribute("class","row-fluid");
            }
            td = document.createElement("div");
            td.setAttribute("class",row_column.getCssClass());
            if (render_links) {
                link = document.createElement("a");
                link.setAttribute("href", "#op/row/"+current_row_id+"/column/"+column.getId());
                link.setAttribute("class","internal");
                link.appendChild(edit_icon_div.cloneNode(true));
                td.appendChild(link);
             }
            td.innerHTML += column.getContent();
            if (this.userBorders === true) {
                td.classList.add("cell-border");
            }
            tr.appendChild(td);
        }
        docfrag.appendChild(tr);
        table.appendChild(docfrag);
        return table;
    };

    /** Saves the 3 collection list to the browser's localStorage database. The 3 collection lists
     *  are rows, columns and row_columns (cells).
     *
     *  Note! Logically we use the browser's localStorage database to persist the user's work. However,
     *  the localStorage database is limited in size and not transportable. Thus, we also provide and
     *  recommend the user save their work to an external text file (Save Data Export function).
     */
    this.store = function() {
        try {
            localStorage.setItem("rows",JSON.stringify(this.rowList.list));
            localStorage.setItem("columns",JSON.stringify(this.columnList.list));
            localStorage.setItem("row_columns",JSON.stringify(this.list));
            localStorage.setItem("title",this.title);
        } catch(error) {
            console.log("store() error : " + error);
        }
    };
    /** Replaces the 3 collection lists (rows, columns and row_columns) with data stored
     *  in the browser's localStorage database.
     *
     *  Note! We currently do not provide a validation where the localStorage database is empty.
     *
     *  @param el The element used to store the rendered product of this grid (user's resume document).
     */
    this.load = function(target_el) {
        try {
            this.rowList.length =0;
            this.columnList.length=0;
            this.list.length =0;
            var title;

            this.rowList.importList(localStorage.getItem("rows"));
            this.columnList.importList(localStorage.getItem("columns"));
            this.importLocalList(localStorage.getItem("row_columns"));
            title = localStorage.getItem("title");
            this.setTitle(title);
            document.title = title;
            if (target_el) {
                target_el.appendChild(this.render());
            }

        } catch(error) {
            console.log("load() error "+ error );
        }
    };
    /** Converts a JSON array to a collection of row_columns (cells).
     *  This method then replaces the current row_column collection list with
     *  the data contained in the JSON array (import_list paramater).
     *
     *  @param JSON array of row_list (cell) entities.
     */
    this.importLocalList= function(import_list) {
        var json_list = JSON.parse(import_list);
        if (json_list && (json_list instanceof Array || json_list instanceof Object)) {
            var len = json_list.length;
            var dataRow = null;
            for (var nIndex = 0; nIndex < len; nIndex ++) {
                dataRow = json_list[nIndex];
                this.addRowColumn(new row_column(dataRow));
            }
        }
    };
    /** Makes a copy of the grid's 3 collection lists (rows, columns and row_columns/cells).
     *  This method creates a JSON object which contains 3 JSON arrays (rows, columns and row_columns).
     *
     *  Note! This method is used by the "Save Data Export" function. Prepares the users document in JSON
     *  format, so the user can store the data in an external flat (text) file.
     *  @returns Users document in JSON format.
     */
    this.toJson = function() {
        var data = {
            "rows":JSON.stringify(this.rowList.list),
            "columns":JSON.stringify(this.columnList.list),
            "row_columns":JSON.stringify(this.list),
            "title":this.title
        };
        return data;
    };
    /** Creates a document in memory (AKA blob). The document contains
     *  the user's document in JSON format.
     *
     *  This method also creates a link to the document. The link is set
     *  to the appropriate json mime type  The result is, the user clicks on the link and
     *  the browser displays a file dial:og. Allowing the user to save a transportable backup
     *  of the document data.
     *
     *  @returns Link element for user to download document data in JSON format.
     *
     */
    this.toBlob= function() {
        if (! window.URL) {
            // handle opera and safari
            showErrorMessage("Sorry this function is not supported by your web browser.");
            return;
        }
        var mime_type = "application/json";
        var data = JSON.stringify(this.toJson());
        var bb = new Blob([data], {type: mime_type});
        var a = document.createElement('a');
        a.download = container.querySelector('input[type="text"]').value;
        a.download = 'resume.json';
        a.href = window.URL.createObjectURL(bb);
        a.textContent = 'Download ready';
        a.dataset.downloadurl = [mime_type, a.download, a.href].join(':');
        return a;
    };
    this.init(options);
};
