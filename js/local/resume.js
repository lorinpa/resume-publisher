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
    }
    this.setCssClass=function(css_class) {
        this.css_class = css_class;
    }
    this.init(options);
};
/** Grid represents the resume document.
 *  Similar to a "worksheet". Puts the row,columns and cells together
 *  to form the resume document.
 *  @property list: collection of row_column entitys (cells)
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
            inks;
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
    }
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

    /** Creates a document cell. The render_links_arg parameter determines whether
     *  we add a parent link around the cell. A parent link allows the user to click
     *  on the cell to invoke the edit cell dialog.
     *
     *  If the grid's useBorders value is set to true, this method adds additional editing
     *  hints to the display. This method adds a border to each cell as well as a clickable
     *  icon. The "edit icon" allows the user to select cells which have either no content or
     *  a non-displayable content such as &nbsp;.
     *
     *  Npte! This method logically renders the user's resume document. Thus, this method is
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
            td.setAttribute("cell","true");
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
    this.init(options);
};

