
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
    this.render = function(lines,columns) {
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




