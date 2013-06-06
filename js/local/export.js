
var cleanUp = function(a) {
    a.textContent = 'Downloaded';
    a.dataset.disabled = true;

    // Need a small delay for the revokeObjectURL to work properly.
    setTimeout(function() {
        window.URL.revokeObjectURL(a.href);
        location = 'webapp.html'
    }, 1500);
};

var downloadFile = function() {
    var container = document.querySelector('#container');
    var output = container.querySelector('output');
    var MIME_TYPE = 'text/html';

    window.URL = window.webkitURL || window.URL;

    var prevLink = output.querySelector('a');
    if (prevLink) {
        window.URL.revokeObjectURL(prevLink.href);
        output.innerHTML = '';
    }

    // construct our new document
    var charset = '<meta charset="utf-8"></meta>\n';
    var viewPort = '<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">\n';
    var doc = document.createElement("html");
    var body = document.createElement('body');
    var head = document.createElement("head");
    var title = document.querySelector("title").cloneNode(true);
    head.appendChild(title);
    head.innerHTML += charset;
    head.innerHTML += viewPort;
    // clone the style or we loose of formatting in our application
    var style = document.querySelector('#bootstrap').cloneNode(true);
    head.appendChild(style);
    var resume_style = document.querySelector("#resume-style");
    head.appendChild(resume_style);
    var report = g.render(false);
    var docTypeStr = "<!DOCTYPE html>\n";
    body.innerHTML = report.outerHTML;
    doc.appendChild(head);
    doc.appendChild(body);
    var bb = new Blob([docTypeStr, doc.outerHTML], {type: MIME_TYPE});
    var a = document.createElement('a');
    a.download = container.querySelector('input[type="text"]').value;
    a.href = window.URL.createObjectURL(bb);
    a.textContent = 'Download ready';

    a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');

    output.appendChild(a);

    a.onclick = function(e) {
        if ('disabled' in this.dataset) {
            return false;
        }
        cleanUp(this);
    };
};
