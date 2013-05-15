
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

var rowList = function() {
    this.list = [];
    this.addRow = function(row) {
        this.list.push(row);
    };

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
};

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

var columnList = function() {
    this.list = [];
    this.addColumn= function(col) {
        this.list.push(col);
    };
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
    this.init(options);
};

var grid = function(options) {
    this.list = [];
    this.addRowColumn= function(row_column) {
        this.list.push(row_column);
    };
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
    this.render = function() {
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
        current_row_id = first_row.getRowId();
        for (var nIndex =0; nIndex < len; nIndex++) {
            row_column = this.list[nIndex];
            row = lines.getRow(row_column.getRowId());
            column = columns.getColumn(row_column.getColumnId());
            if (current_row_id !== row.getId()) {
                docfrag.appendChild(tr);
                current_row_id = row.getId();
                tr = document.createElement("div");
                tr.setAttribute("class","row-fluid");
            }
            td = document.createElement("div");
            td.setAttribute("class","span1");
            td.innerHTML += column.getContent();
            tr.appendChild(td);
        }
        docfrag.appendChild(tr);
        table.appendChild(docfrag);
        return table;
    };
};

/** Here is our string test **/

var echo = function(str) {
    return str;
};


var line_one = new row({"id":1,"location":1});
var line_two = new row({"id":2,"location":2});
var lines = new rowList();
lines.addRow(line_one);
lines.addRow(line_two);
var line_one_copy = lines.getRow(1);
line_one_copy.getLocation();

var col_one = new column({"id":1,"content":"<p>I am col one</p>"});
var col_two = new column({"id":2,"content":"<p>I am col two</p>"});
var columns = new columnList();
columns.addColumn(col_one);
columns.addColumn(col_two);
var col_one_copy = columns.getColumn(1);
col_one_copy.getContent();

var row_one_col_one = new row_column({"id":1,"row_id":1,"column_id":1,"location":1});
var row_one_col_two = new row_column({"id":2,"row_id":1,"column_id":2,"location":2});

var row_two_col_one = new row_column({"id":3,"row_id":2,"column_id":1,"location":1});
var row_two_col_two = new row_column({"id":4,"row_id":2,"column_id":2,"location":2});

var g = new grid();
g.addRowColumn(row_one_col_one);
g.addRowColumn(row_one_col_two);
g.addRowColumn(row_two_col_one);
g.addRowColumn(row_two_col_two);



/** end of sting test **/


