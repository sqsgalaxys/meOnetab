// chrome 打开 mhtmlxs 文件
// /Users/sqsgalaxys/Downloads/OneDrive/Tools/chromeExtensions/meOnetab/mhtmlxs.js

(function(document) {
    document.body.setAttribute("style", "background-color: gray;");

    var enteredTextNode = document.getElementsByTagName("pre")[0];
    var enteredText = enteredTextNode.innerHTML;
    // text --> line --> link
    // https://stackoverflow.com/questions/21711768/split-string-in-javascript-and-detect-line-break
    // var numberOfLineBreaks = (enteredText.match(/\n/g)||[]).length;
    // alert('Number of breaks: ' + numberOfLineBreaks);
    // create a tag
    var links = document.createElement("div"); 
    var lines = enteredText.split("\n");
    var currentDiv = document.getElementById("div1"); 
    lines.forEach(function(line) {
        if (line) {
            var link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
            link.href = line.split('  |  ')[0].replace(' ','');
            link.innerHTML = line.split('  |  ')[1].replace(' ','');
            link.setAttribute("style", "font-size: 1.8em;");
            links.appendChild(link);  
            var newLine = document.createElement("div"); 
            newLine.innerHTML = '\n';
            links.appendChild(newLine);  
        }
    });
    document.body.insertBefore(links,enteredTextNode); 
    enteredTextNode.hidden = true;
    // document.body.insertBefore(enteredText,links);

    // show a tag
    // hide pre tag
    // var div = document.createElement("div");
    // div.appendChild(document.createTextNode(fld.value));


}(document));
