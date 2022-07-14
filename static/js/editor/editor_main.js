            //  import {  toogleTxtFormBlock, initDoc, formatDoc, validateMode, setDocMode, printDoc } from './text_format.js';
    //   const toogleTxtFormBlock = requirejs(['text_format.js']);
    let resizing = false;
    let contentFile = [];
    let saveFileButton = document.createElement('button');

    const isTemplate = JSON.parse(document.getElementById('template').textContent);
    const isVerify = JSON.parse(document.getElementById('verify').textContent);
    const isViewer = JSON.parse(document.getElementById('doc_viewer').textContent);


    window.onload = (event) => {
        const fileData = JSON.parse(document.getElementById('file-data').textContent);
        renderFile(fileData);
    }

    const rejectDocument = (event) => {

    };

    const rejectDocumentForm = (event) => {
        const domTargetDiv = document.getElementById('editor-container');
        const contentFormHolder = document.createElement('div');
        contentFormHolder.style.position = 'absolute';
        contentFormHolder.style.top = '0';
        contentFormHolder.style.left = '0';
        contentFormHolder.style.width = '100%';
        contentFormHolder.style.height = '100%';
        contentFormHolder.style.background = '#3338';
        contentFormHolder.style.display = 'flex';
        contentFormHolder.style.justifyContent = 'center';
        contentFormHolder.style.alignItems = 'center';
        contentFormHolder.style.zIndex = 100;

        const modelContent = document.createElement('div');
        modelContent.style.height = '40vh';
        modelContent.style.width = '50vw';
        modelContent.style.backgroundColor = '#fff';
        modelContent.style.borderRadius = '3%';
        modelContent.style.display = 'flex';
        modelContent.style.flexDirection = 'column';
        modelContent.style.padding = '3%';
        modelContent.style.justifyContent = 'space-between';

        const formHead = document.createElement('h4');
        formHead.innerHTML = 'Reason of rejecting document'

        const messageInput = document.createElement('textarea');
        messageInput.placeholder = 'Message';
        messageInput.className = 'form-control';
        messageInput.style.resize = 'none';
        messageInput.id = 'reject-message';

        const submitInputButton = document.createElement('button');
        submitInputButton.innerHTML = 'Submit';
        submitInputButton.className = 'btn btn-outline-danger';

        submitInputButton.onclick = (event) => {
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            const company_id = JSON.parse(document.getElementById('company_id').textContent);
            const requestURL = `/editor/${company_id}/reject-document-request/`;
            const rejectDocumentRequest = new Request(requestURL, {headers: {'X-CSRFToken': csrftoken}} );

            const documentID = JSON.parse(document.getElementById('documentID').textContent);
            const rejectReason = document.getElementById('reject-message');
            console.log('Clicked the reject btn')

            body = {
                file_id: documentID,
                reason: rejectReason.value
            }

            fetch(rejectDocumentRequest, {
                method: 'POST',
                mode: 'same-origin',
                body: JSON.stringify(body)
            }).then(async function(response) {
                contentFormHolder.remove()
                const fileObject = await response.json();
                alert("Document rejected and sent for processing...")
                window.location.assign(fileObject.url)
            });
        };

        modelContent.append(formHead)
        modelContent.append(messageInput)
        modelContent.append(submitInputButton)
        contentFormHolder.append(modelContent)
        domTargetDiv.append(contentFormHolder);
    };

    if (isTemplate && !isViewer) {
        const txtBtn = document.getElementById("txt-btn");
        const imgBtn = document.getElementById("img-btn");
        const tableBtn = document.getElementById("table-btn");
        const dateBtn = document.getElementById("date-btn");
        const signatureBtn = document.getElementById("signature-btn");
        const dropDownBtn = document.getElementById("dropdown-btn");
        const txtP = document.getElementById("edP-btn");
        let dragged;

        txtBtn.ondragstart = (event) => {
            event.dataTransfer.setData("text/plain", "TEXT_BUTTON");
            dragged = event.target;

        }

        imgBtn.ondragstart = (event) => {
            event.dataTransfer.setData("text/plain", "IMG_BUTTON");
            dragged = event.target;

        }

        tableBtn.ondragstart = (event) => {
            event.dataTransfer.setData("text/plain", "TABLE");
            dragged = event.target;
        }

        dateBtn.ondragstart = (event) => {
            event.dataTransfer.setData("text/plain", "DATE");
            dragged = event.target;
        }

        signatureBtn.ondragstart = (event) => {
            event.dataTransfer.setData("text/plain", "SIGN");
            dragged = event.target;

        }
        dropDownBtn.ondragstart = (event) => {
                event.dataTransfer.setData("text/plain", "DROPDOWN");
                 dragged = event.target;

            }
        txtP.ondragstart = (event) => {
                event.dataTransfer.setData("text/plain", "EDIT_P");
                 dragged = event.target;
        }

    }
let modalTxtForm = document.getElementById("modalTxtForm");
let toolBoxTools = document.getElementById("toolbox-tools");
        toolBoxTools.style.display = "none";
// New Fomart Code

$(document).ready(function() {
    getDate('dd-mm-yyyy');
var mySelectElements = document.getElementsByClassName("form-select");
for(var i = 0; i < mySelectElements.length; i++){
	console.log(mySelectElements[i]);
	if(mySelectElements[i].classList.contains("auth-user")){
	    mySelectElements[i].style.display = 'none';
	}
}
// Add drag and resize option to panel
$("#toolbox-tools").draggable({
handle: ".panel-heading",
stop: function(evt, el) {
    // Save size and position in cookie
    /*
    $.cookie($(evt.target).attr("id"), JSON.stringify({
        "el": $(evt.target).attr("id"),
        "left": el.position.left,
        "top": el.position.top,
        "width": $(evt.target).width(),
        "height": $(evt.target).height()
    }));
    */
}
}).resizable({
handles: "e, w, s, se",
stop: function(evt, el) {
    // Save size and position in cookie
    /*
    $.cookie($(evt.target).attr("id"), JSON.stringify({
        "el": $(evt.target).attr("id"),
        "left": el.position.left,
        "top": el.position.top,
        "width": el.size.width,
        "height": el.size.height
    }));
    */
}
});


// Expand and collaps the toolbar
$("#toggle-toolbox-tools").on("click", function() {
var panel = $("#toolbox-tools");

if ($(panel).data("org-height") == undefined) {
    $(panel).data("org-height", $(panel).css("height"));
    $(panel).css("height","41px");
} else {
    $(panel).css("height", $(panel).data("org-height"));
    $(panel).removeData("org-height");
}

$(this).toggleClass('fa-chevron-down').toggleClass('fa-chevron-right');
});


// Make toolbar groups sortable
$( "#sortable" ).sortable({
stop: function (event, ui) {
    var ids = [];
    $.each($(".draggable-group"), function(idx, grp) {
        ids.push($(grp).attr("id"));
    });

    // Save order of groups in cookie
    //$.cookie("group_order", ids.join());
}
});
$( "#sortable" ).disableSelection();


// Make Tools panel group minimizable
$.each($(".draggable-group"), function(idx, grp) {
var tb = $(grp).find(".toggle-button-group");

$(tb).on("click", function() {
    $(grp).toggleClass("minimized");
    $(this).toggleClass("fa-caret-down").toggleClass("fa-caret-up");

    // Save draggable groups to cookie (frue = Minimized, false = Not Minimized)
    var ids = [];
    $.each($(".draggable-group"), function(iidx, igrp) {
        var itb = $(igrp).find(".toggle-button-group");
        var min = $(igrp).hasClass("minimized");

        ids.push($(igrp).attr("id") + "=" + min);
    });

    $.cookie("group_order", ids.join());
});
});



// Close thr panel
$(".close-panel").on("click", function() {
$(this).parent().parent().hide();
});


// Add Tooltips
$('button').tooltip();
$('.toggle-button-group').tooltip();

});





// End of New Fomat COde

/* Font and text styling javascript*/

var oDoc, sDefTxt;

function initDoc() {
oDoc = document.getElementById("textBox");
sDefTxt = oDoc.innerHTML;
if (document.compForm.switchMode.checked) { setDocMode(true); }
}

function formatDoc(sCmd, sValue) {
if (validateMode()) { document.execCommand(sCmd, false, sValue); oDoc.focus(); }
}

function validateMode() {
if (!document.compForm.switchMode.checked) { return true ; }
alert("Uncheck \"Show HTML\".");
oDoc.focus();
return false;
}

function setDocMode(bToSource) {
var oContent;
if (bToSource) {
oContent = document.createTextNode(oDoc.innerHTML);
oDoc.innerHTML = "";
var oPre = document.createElement("pre");
oDoc.contentEditable = false;
oPre.id = "sourceText";
oPre.contentEditable = true;
oPre.appendChild(oContent);
oDoc.appendChild(oPre);
document.execCommand("defaultParagraphSeparator", false, "div");
} else {
if (document.all) {
  oDoc.innerHTML = oDoc.innerText;
} else {
  oContent = document.createRange();
  oContent.selectNodeContents(oDoc.firstChild);
  oDoc.innerHTML = oContent.toString();
}
oDoc.contentEditable = true;
}
oDoc.focus();
}
/*
function printDoc() {
if (!validateMode()) { return; }
var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
oPrntWin.document.open();
/*oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
oPrntWin.document.close();
}
*/


// const toogleTxtForm =  ()=>{
//                 if (modalTxtForm.style.display === "none") {
//                     initDoc();
//                     modalTxtForm.style.display = "block";
//                         } else {
//                             modalTxtForm.style.display = "none";
//                         }
//             }


const toogleTxtFormBlock =  ()=>{
if (toolBoxTools.style.display === "none") {
    initDoc();
    toolBoxTools.style.display = "block";
        }
 $('.portlet').css('display', 'none');
}



/*end of Font and text styling javascript*/





    if (isTemplate){
        saveFileButton = document.getElementById('save-template-btn');
        arrangeFileButton = document.getElementById('arrange-template-btn');
    } else if (!isVerify && !isViewer) {

        saveFileButton = document.getElementById('save-btn');
        //Adding document in workflow
        wfButton = document.getElementById("addToWorkFlowButton");
        wfButton.addEventListener("click", addWorkflow, false);

    }
    else{
        let hDiv  = document.getElementsByClassName("holderDIV");
        //  hDiv.style.border="none";
        //      hDiv.classList.add("ff");
        console.log("Yourt Hdivs");
        console.log(hDiv);
        for (const [key, value] of Object.entries(hDiv)) {
             console.log("Your div in object");
  console.log(key, value);
}
        for (item of hDiv){
            console.log("Your div");
        console.log(item);
             item.style.border="none";
             item.classList.add("ff");
        }
    }

    saveFileButton.onclick = (event) => {
        const data = saveDocument();
        sendSaveDocumentRequest(data);
        console.log("File saved");
    }

//checking if all fields are full
function failer(e_message, docName){
    // let alertFailMessage = '<button type="button" class="close" data-dismiss="alert">&times;</button><strong>Error! '+ e_message+ '</strong>'+ docName + ' file not saved succesfully.';
    let alertFailMessage = '<button type="button" class="close" data-dismiss="alert">&times;</button><strong>Error! '+ e_message+ '. Document not saved succesfully.';

    let alertBox = document.getElementById('showAlert');
    let alertFall = document.createElement('div');
    alertFall.setAttribute('class', 'alert');
    alertFall.classList.add("alert-danger", 'alert-dismissible');
        alertFall.innerHTML =alertFailMessage;

            alertBox.append(alertFall);
    }
function checkFields(docName){
    let currrUser = document.getElementById('current-user').innerHTML;
    let authUserClass =  document.getElementsByClassName("auth_user_class");
    let authUserClassSub =  document.getElementsByClassName("auth_user_class_sub");

    for(let i =0 ; i<authUserClass.length; i++){
        if (authUserClass[i].innerHTML == currrUser ){
            console.log("found culrpit");
            console.log(authUserClass[i]);
            finder = true;
            let culpritParent = authUserClass[i].parentNode
            while(finder){
                if(culpritParent.classList.contains("holder-menu")){
                    finder=false;
                    break;

                }
                culpritParent = culpritParent.parentNode;
            }
            console.log("found culrpit PArent");
            console.log(culpritParent);
            let currentNode = culpritParent;
            let nextSibling = currentNode.nextElementSibling;
            let prevSibling = currentNode.previousElementSibling;
            check = true;
            if(nextSibling == null ){
               check = false;
            }
            while(nextSibling || check) {
                console.log("nextSibling");
                console.log(nextSibling);
                 if(nextSibling == null ){
               check = false;
               break;
            }
                if(nextSibling.tagName=='INPUT'){
                    if(nextSibling.getAttribute('type') === 'file'){
                        console.log("Image File Reached");
                        console.log("NO Check needed");
                        let e_message = "Kindly attach an image"

                        check = false;
                        failer(e_message, docName);
                        return "error";
                    }
                    //  if(nextSibling.classList.contains("date")){
                    //      if(nextSibling.value == ""){
                    //          console.log("Date is empty");
                    //         console.log("Please Fill");
                    //      }else{
                    //          console.log("Date is filled");

                    //      }

                    //     check = false;
                    // }
                }
                if(nextSibling.tagName=='DIV'){

                    if(nextSibling.classList.contains("editPara")){
                        console.log("Edit Para ");
                        console.log("NO Check needed");
                        check = false;
                    }
                    if(nextSibling.classList.contains("container")){
                        //  let dateInput = document.getElementsByClassName("date");
                         let dateInput = nextSibling.getElementsByClassName("date");

                         if(dateInput[0].value == ""){
                             console.log("Date is empty");
                            console.log("Please Fill");
                            let e_message = "Kindly fill in a date"
                            failer(e_message,docName);
                            return "error";
                         }else{
                             console.log("Date is filled");

                         }
                        check = false;
                    }
                }
                if(nextSibling.tagName=='ADDRESS'){
                    if(nextSibling.classList.contains("dropDownDiv")){
                        console.log("Drop Down");
                        console.log("nextSibling.value")
                        console.log(nextSibling.value)
                        if(nextSibling.value == null || nextSibling.value == "0"){
                            console.log("Please fill dropdown");
                            let e_message = "Kindly select in the dropdown"
                            failer(e_message,docName);
                            return "error";
                        }
                        else{
                            console.log("Drop down filled");
                        }

                        check = false;
                    }
                    if(nextSibling.classList.contains("tableDiv")){
                        console.log("Table");
                        console.log("More work needed");
                        check = false;
                    }
                }
                if(nextSibling.tagName=='TEXTAREA'){
                    if(nextSibling.value.length == 0)
                        {
                             console.log("Please fill");
                             let e_message = "Kindly fill in the text"
                            failer(e_message,docName);
                            return "error";
                        }
                    else{
                        console.log("Already filled ");
                    }
                    check =false;

                }
                if(nextSibling.tagName=='BUTTON'){
                    if(nextSibling.classList.contains("signature-btn")){
                        console.log("Please Sign");
                        check = false;
                        let e_message = "Kindly sign the document"
                            failer(e_message,docName);
                            return "error";

                    }
                }
                nextSibling = nextSibling.nextElementSibling;
            }
if(prevSibling == null ){
               check = false;
            }
            if(check){

               while(prevSibling || check) {
                console.log("prevSibling");
                console.log(prevSibling);
                if(prevSibling.tagName=='INPUT'){
                    if(prevSibling.getAttribute('file') === 'file'){
                        console.log("Image File Reached");
                        console.log("NO Check needed");

                        check = false;
                        let e_message = "Kindly select an image"
                            failer(e_message,docName);
                            return "error";
                    }
                     if(prevSibling.classList.contains("date")){
                         if(prevSibling.value == ""){
                             console.log("Date is empty");
                            console.log("Please Fill");
                            let e_message = "Kindly fill in the date"
                            failer(e_message, docName);
                            return "error";
                         }else{
                             console.log("Date is filled");

                         }

                        check = false;
                    }
                }
                if(prevSibling.tagName=='DIV'){

                    if(prevSibling.classList.contains("editPara")){
                        console.log("Edit Para ");
                        console.log("NO Check needed");
                        check = false;
                    }
                }
                if(prevSibling.tagName=='ADDRESS'){
                    if(prevSibling.classList.contains("dropDownDiv")){
                        console.log("Drop Down");
                        if(prevSibling.value =="0"){
                            console.log("Please fill dropdown");
                            let e_message = "Kindly select a choice"
                            failer(e_message, docName);
                            return "error";
                        }
                        else{
                            console.log("Drop down filled");
                        }

                        check = false;
                    }
                    if(prevSibling.classList.contains("tableDiv")){
                        console.log("Table");
                        console.log("More work needed");
                        check = false;
                    }
                }
                if(prevSibling.tagName=='TEXTAREA'){
                    if(prevSibling.value.length == 0)
                        {
                             console.log("Please fill");
                             let e_message = "Kindly fill in text area"
                            failer(e_message, docName);
                            return "error";
                        }
                    else{
                        console.log("Already filled ");
                    }
                    check =false;

                }
                if(prevSibling.tagName=='BUTTON'){
                    if(prevSibling.classList.contains("signature-btn")){
                        console.log("Please Sign");
                        check = false;
                        let e_message = "Kindly sign the document";
                            failer(e_message , docName);
                            return "error";
                    }
                }
                prevSibling = prevSibling.previousElementSibling;
            }

            }
        }
    }
    console.log("auth_user_class checkFields");
    console.log(authUserClass);
    console.log("auth_user_class_sub checkFields");
    console.log(authUserClassSub.length);
    console.log("document.getElementById('current-user')")
    console.log(currrUser)
    return 'success';
}

    //saving file
    const sendSaveDocumentRequest = (data) => {
        const documentName = JSON.parse(document.getElementById('documentName').textContent);
        const requestURL = isTemplate ? '/editor/api/save-template/' :'/editor/api/save-file/';
        console.log("requestURL");
        console.log(requestURL);
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        let saveFileRequest = new Request(requestURL, {headers: {'X-CSRFToken': csrftoken}} );
        //  if(requestURL == "error"){
        //     return false;
        // }
        const documentID = JSON.parse(document.getElementById('documentID').textContent);
        // const documentName = JSON.parse(document.getElementById('documentName').textContent);
        let alertBox = document.getElementById('showAlert');
        let alertSuc = document.createElement('div');

        alertSuc.setAttribute('class', 'alert');
        alertSuc.classList.add("alert-success", 'alert-dismissible');

        // let butCl = document.createElement('button');
        // butCl.setAttribute('class', 'close');
        // butCl.setAttribute('type', 'button');
        // butCl.setAttribute('data-dismiss', 'alert');
        // let t = document.createTextNode('&times;');
        // butCl.appendChild(t);


        const body = {
            file_id: documentID,
            file_name: documentName,
            content: data,
            is_template: isTemplate
        }

if(requestURL != "error"){
        fetch(saveFileRequest, {
            method: 'POST',
            mode: 'same-origin',
            body: JSON.stringify(body)
        }).then(async function(response) {
            const fileObject = await response.json();
            console.log(fileObject)
            documentID.textContent = fileObject.file.file_id
            documentName.textContent = fileObject.file.name;
            let alertSuccessMessage = '<button type="button" class="close" data-dismiss="alert">&times;</button><strong>Success! </strong>'+ fileObject.file.name + ' file saved succesfully.';
        // alertSuc.append(butCl);
            alertSuc.innerHTML =alertSuccessMessage;

            alertBox.append(alertSuc);

            // alert(fileObject.file.name +' - file saved.')
        })}
        else{
            let e_message = "Please correct and resave";

            failer(e_message, documentName);
            return "error";
        }
    }






    function addWorkflow() {
        const data = saveDocument();
        sendSaveDocumentRequest(data);
        const company_id = JSON.parse(document.getElementById('company_id').textContent);

        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const requestURL =  `/editor/${company_id}/add-document/`;
        const addDocument2WFRequest = new Request(requestURL, {headers: {'X-CSRFToken': csrftoken}} );

        const documentID = JSON.parse(document.getElementById('documentID').textContent);
        const documentName = JSON.parse(document.getElementById('documentName').textContent);

        console.log('DocumentID in processing...', documentID)
        body = {
            file_id: documentID
        }

        fetch(addDocument2WFRequest, {
            method: 'POST',
            mode: 'same-origin',
            body: JSON.stringify(body)
        }).then(async function(response) {
            const fileObject = await response.json();
            alert("Document sent for processing...")
            window.location.assign(fileObject.url)

        });
    };
    let saver_sig = document.querySelector("#save_sig");
 if(saver_sig != null ){


saver_sig.addEventListener("click", function(event) {
        //  document.getElementById("output-box").innerHTML += "Sorry! <code>preventDefault()</code> won't let you check this!<br>";
         event.preventDefault();



        // event.preventDefault();

        let feedBack = checkFields("Dpcument Name");
        console.log("feedBack components");
        console.log(feedBack);
        if (feedBack =='error'){
            failer("Check Erorrs please", "docName")
        }else{
            const data = saveDocument();
        console.log("Data components");
        console.log(data);
        const dataInput = document.getElementById("documentData");
        dataInput.value = JSON.stringify(data);
        const submitBTN = document.getElementById("Signed");
        console.log("submitBTN");
        console.log(submitBTN);
        // submitBTN.submit();
        document.getElementById("signature-form").submit();
        }





}, false);
}

    const signSubmit = (event) => {
        // event.preventDefault();

        // let feedBack = checkFields("Dpcument Name");
        // console.log("feedBack components");
        // console.log(feedBack);
        if (feedBack =='error'){
             console.log("Data components second form button errroe");
            failer("Check Erorrs please", "docName")
        }else{
            const data = saveDocument();
        console.log("Data components second form button");
        console.log(data);
        const dataInput = document.getElementById("documentData");
        dataInput.value = JSON.stringify(data);
        const submitBTN = document.getElementById("Signed");
        submitBTN.submit();
        }


    };


    function getResizer(attr1, attr2){
        const resizer = document.createElement('span');
        resizer.style.width = '5px';
        resizer.style.height = '5px';
        resizer.style.display = 'block';
        resizer.className = 'resizeBtn';
        resizer.style.position = 'absolute';
        resizer.style.backgroundColor = '#00aaff';

        if ( attr1 === 'top') {
            resizer.style.top = '-3px';
        } else {
            resizer.style.bottom = '-3px';
        }

        if ( attr2 === 'left') {
            resizer.style.left = '-3px';
        } else {
            resizer.style.right = '-3px';
        }

        if ( attr1 == 'top' && attr2 === 'right' || attr1 == 'bottom' && attr2 === 'left'){
            resizer.onmouseover = (event) => {
                event.target.style.cursor = 'nesw-resize';
            };
        } else {
            resizer.onmouseover = (event) => {
                event.target.style.cursor = 'nwse-resize';
            };
        }

        if (isTemplate) {
            resizer.onmousedown = (event) => {
                let initX = event.screenX;
                let initY = event.screenY;
                resizing = true;
                event.preventDefault();
                const holder = event.target.parentNode;

                const holderSize = (function () {
                    const holderSize = {
                        width : parseInt(holder.style.width.slice(0, -2)) ,
                        height : parseInt(holder.style.height.slice(0, -2)),
                        top : parseInt(holder.style.top.slice(0, -2)),
                        left : parseInt(holder.style.left.slice(0, -2))//elemLeft : 0
                    }
                    return Object.seal(holderSize);
                })();

                window.addEventListener('mousemove', resizeElement);
                function resizeElement(ev) {
                    if(attr1 == 'bottom' && attr2 == 'right') {
                        holder.style.width = ((ev.screenX - initX) + holderSize.width) + 'px';
                        holder.style.height = ((ev.screenY - initY) + holderSize.height) + 'px';

                    } else if(attr1 == 'bottom' && attr2 == 'left')  {
                        holder.style.left = (holderSize.left + (ev.screenX - initX)) + 'px';
                        holder.style.width = (holderSize.width - (ev.screenX - initX)) + 'px';
                        holder.style.height = ((ev.screenY - initY) + holderSize.height) + 'px';
                    } else if(attr1 == 'top' && attr2 == 'left')  {
                        holder.style.top = (holderSize.top + (ev.screenY - initY)) + 'px';
                        holder.style.left = (holderSize.left + (ev.screenX - initX)) + 'px';
                        holder.style.width = (holderSize.width - (ev.screenX - initX)) + 'px';
                        holder.style.height = (holderSize.height - (ev.screenY - initY)) + 'px';
                    } else if(attr1 == 'top' && attr2 == 'right')  {
                        holder.style.top = (holderSize.top + (ev.screenY - initY)) + 'px';
                        holder.style.width = (holderSize.width + (ev.screenX - initX)) + 'px';
                        holder.style.height = (holderSize.height - (ev.screenY - initY)) + 'px';
                    }

                }

                window.addEventListener('mouseup', stopResizing);
                function stopResizing(ev){
                    window.removeEventListener('mousemove', resizeElement);
                    window.removeEventListener('mouseup', stopResizing);
                    resizing = false;

                }
            }
        }
        return resizer;
    }



//Get Editable Div Field
function getParaField(){
        const textP = document.createElement('div');
        textP.setAttribute("contenteditable", true);
        textP.setAttribute("class", "editPara");
        textP.setAttribute("id", "textBox");
        const textPara = document.createElement('p');
        // textPara.innerHTML = "Input Here"
        textP.appendChild(textPara);
        textP.type = 'text';
        textP.style.width = '100%';
        textP.style.height = '100%';
        textP.style.margin = '1%';

        textP.style.fontSize = '1em';
        textP.style.border = 'none';
        textP.style.resize = 'none';
        textP.style.backgroundColor = '#0000';
        textP.style.borderRadius = '0px';
        textP.style.outline = '0px';
        textP.style.overflow = 'overlay';
         if (isTemplate) {
                  textP.onclick= (ev)=>{
            console.log("clicked");
    //         requirejs(['text_format'], function (text_format) {
    // //   const headerEl = document.getElementById("header");
    // //   headerEl.textContent = lodash.upperCase("hello world");
    toogleTxtFormBlock();
    // });

        }
                }



        return textP;
    }



    //Get Text Field
    function getTextField(){
        const textField = document.createElement('textarea');
        textField.type = 'text';
        textField.style.width = '100%';
        textField.style.height = '100%';
        textField.style.margin = '0px';
        textField.style.fontSize = '1em';
        textField.style.border = 'none';
        textField.style.resize = 'none';
        textField.style.backgroundColor = '#0000';
        textField.style.borderRadius = '0px';
        textField.style.outline = '0px';
        textField.style.overflow = 'overlay';
        textField.addEventListener('click', (event)=>{
            if(isTemplate){
                console.log("is template isn get Text field");
                $('.portlet').css('display', 'block');
            }
    // focusInEvent(event);
});
        return textField;
    }

        //Create Dropdown with id passed
        function getDropDownField(id){
            console.log("id = ".concat(id.toString()));
            let dropDownDiv = document.createElement("address");
            dropDownDiv.setAttribute("id", "dropDownDiv".concat(id.toString()));
            dropDownDiv.setAttribute("class", "dropDownDiv");
            dropDownDiv.style.width = "200px";


            let selectField = document.createElement('select');

            selectField.setAttribute("id", id.toString());
            // selectField.setAttribute("class", "selectDropDown");
            // selectField.setAttribute("class", "form-select");
            selectField.setAttribute("class", "custom-select");
            // selectField.classList.add( "selectpicker");




            let defaultOptionField = document.createElement('option');
            defaultOptionField.value="0"
            defaultOptionField.text = " "
            selectField.add(defaultOptionField)

            dropDownDiv.append(selectField)
            dropDownDiv.addEventListener('dblclick', function (e) {
  handleDropDwnDouble(e);
});
dropDownDiv.addEventListener('click', (event)=>{
            if(isTemplate){
                console.log("is template isn get Text field");
                $('.portlet').css('display', 'block');
            }
    // focusInEvent(event);
});
            return dropDownDiv;

        }



        //Create Dropdown2 with id passed
        function getDropDownField2(id){
            //display automatic empty drop down
            console.log("id = ".concat(id.toString()));
            let dropDownDiv = document.createElement("address");
            dropDownDiv.setAttribute("id", "dropDownDiv".concat(id.toString()));
            dropDownDiv.setAttribute("class", "dropDownDiv");
            dropDownDiv.style.width = "200px";
            let divField = document.createElement('div');
            divField.setAttribute("class", "dropdown");
            divField.setAttribute("id", id.toString());
            let buttField = document.createElement('button');
            buttField.setAttribute("class", "btn");
            buttField.classList.add( "btn-secondary", "dropdown-toggle");
            buttField.setAttribute("data-toggle", "dropdown");
            buttField.setAttribute("type", "button");
            let spanField = document.createElement('span');
            spanField.setAttribute('class', 'caret');
            buttField.append(spanField);
            let ulField = document.createElement('ul');
            ulField.setAttribute("class", "dropdown-menu");
            let liField = document.createElement('li');
            liField.value="0"
            liField.text = " "
            ulField.appendChild(liField);
            divField.append(buttField);
            divField.append(ulField);
            dropDownDiv.append(divField)
            dropDownDiv.addEventListener('click', (event)=>{
            if(isTemplate){
                console.log("is template isn get Drop Down");
                $('.portlet').css('display', 'block');
            }

});
            return dropDownDiv;

        }

//Create Table with id passed
        function getTableField(id){
          console.log("getTable id = ".concat(id.toString()));
            let tableDiv = document.createElement("address");
            // let editBtn =getEditTableBtn();
            tableDiv.setAttribute("id", "tableDiv".concat(id.toString()));
            tableDiv.setAttribute("class", "tableDiv");
            tableDiv.style.width = "100%";
            // tableDiv.style.height = "80%";
            tableDiv.style.height = "100%";

            tableDiv.style.top = "inherit";
            tableDiv.style.left = "inherit";
            // tableDiv.style.position = "absolute";
            // tableDiv.style.cursor = 'inherit';
            let table = document.createElement("table");
            let thead = document.createElement("thead");
            let tbody = document.createElement("tbody");
            table.setAttribute("class", "form-table form-table-sm float-right");
            table.setAttribute("id", "t".concat(id.toString()));
            table.style.height = "100%";
            table.style.width = "100%";
            table.style.top = "inherit";
            table.style.left = "inherit";
            // Creating and adding data to first row of the table
            let row_1 = document.createElement('tr');
            let heading_1 = document.createElement('td');
            heading_1.innerHTML = "          ";
            let heading_2 = document.createElement('td');
            heading_2.innerHTML =  "          ";
            let heading_3 = document.createElement('td');
            heading_3.innerHTML = "          ";

            row_1.appendChild(heading_1);
            row_1.appendChild(heading_2);
            row_1.appendChild(heading_3);
            thead.appendChild(row_1);

            // Creating and adding data to second row of the table
            let row_2 = document.createElement('tr');
            let row_2_data_1 = document.createElement('td');
            row_2_data_1.innerHTML = "           ";
            let row_2_data_2 = document.createElement('td');
            row_2_data_2.innerHTML = "          ";
            let row_2_data_3 = document.createElement('td');
            row_2_data_3.innerHTML = "           ";

            row_2.appendChild(row_2_data_1);
            row_2.appendChild(row_2_data_2);
            row_2.appendChild(row_2_data_3);
            tbody.appendChild(row_2);


            table.appendChild(thead);
            table.appendChild(tbody);
            // tableDiv.appendChild(editBtn);
            tableDiv.append(table);



            tableDiv.addEventListener('dblclick', function (e) {
              handleTableEditBtn(e);
            });
            console.log("Before exit of tableDIv");
            console.log(tableDiv);
            return tableDiv;

        }
          //Create The Table to fill in custom field values

function createTableForm(defaulTb){
                          var elementEditable = document.getElementById("editable_table");
            console.log("defaultb");
            console.log(defaulTb);
            // var originalVersion = {...defaulTb};
            var modal = document.getElementById("myModal2");
            // Get the button that opens the modal
            // var btn = document.getElementById("myBtn");
            mdTable = document.getElementById("tbl");

            // console.log("defaultb2");
            // console.log(defaulTb);
            let reqIdWitht = defaulTb.getAttribute('id');
            // console.log("reqIdWitht ".concat(reqIdWitht.toString()));
            reqId = reqIdWitht.match(/(\d+)/)[0];
            // console.log("reqId ".concat(reqId.toString()));
            defaulTb.setAttribute("id", "tb".concat(reqId));
            // defaulTb.classList.add("table" ,"table-borded", "table-striped", "table-list");
            defaulTb.classList.add("table" ,"table-borded", "table-list");

            //Assigning
            submitTableChanges  = document.getElementById("submitTableChanges");
            changedTable  = document.getElementById("newModalTable");
            changedTableCln = changedTable.cloneNode(true);
            changedTableParentCln = changedTable.parentNode;


            // if (changedTable != "undefined" || changedTable != null){
                if(changedTable){
                    changedTable.parentNode.replaceChild(defaulTb, changedTable);
            }
            else{

                elementEditable.append(defaulTb);
            }

            modal.style.display = "block";//apply
            var tbid = "#tb".concat(reqId.toString());
            $(tbid).SetEditable({
                    $addButton: $('#add')
                });


            submitTableChanges.onclick = (e) =>{
                e.preventDefault();
                changedTable  = document.getElementById("tb".concat(reqId));
            divTable  = document.getElementById("tableDiv".concat(reqId));
        if (document.getElementById(reqIdWitht)){
            defaultTableField = document.getElementById(reqIdWitht);
            // console.log("default Table Normals times");


            defaultTableField.parentNode.removeChild(defaultTableField);
           }
           var tr_length = changedTable.rows[1].cells.length
           var changedTableLength = changedTable.rows.length;
           if (changedTable.rows[1].cells[tr_length-1].classList.contains("crud_buttons")){

           for (var y = 1; y < changedTableLength; y++){
               changedTable.rows[y].deleteCell(tr_length-1);
           }
        }
            changedTable.deleteRow(0);
           changedTable.setAttribute("id", reqIdWitht);
           changedTable.style.zIndex = 7;

           divTable.append(changedTable);
        //    changedTableCln
        // console.log("Before Append of clone = ");
        // console.log(changedTableCln);
        // console.log("Before Append of element editabl");
        // console.log(elementEditable);

           elementEditable.appendChild(changedTableCln);
        //   console.log("after Append of clone = ");
        // console.log(changedTableCln);
        // console.log("after Append of element editabl");
        // console.log(elementEditable);
             divTable.append(changedTable);
                divTable.addEventListener('dblclick', function (e) {
  handleTableEditBtn(e);
});

changedTableCln.addEventListener('dblclick', function (e) {
  handleTableEditBtn(e);
});
elementEditable.append(changedTableCln);
elementEditable.addEventListener('dblclick', function (e) {
  handleTableEditBtn(e);
});
            modal.style.display = "none";
            }

            var span = document.getElementsByClassName("close2")[0];
            span.style.display = "none";
            span.onclick = function(e) {

                e.preventDefault();
                changedTable  = document.getElementById("tb".concat(reqId));

            divTable  = document.getElementById("tableDiv".concat(reqId));
            if (document.getElementById(reqIdWitht)){
            defaultTableField = document.getElementById(reqIdWitht);
            // console.log("default Table Normals times");

            defaultTableField.parentNode.removeChild(defaultTableField);
            }
            var tr_length = changedTable.rows[1].cells.length
           var changedTableLength = changedTable.rows.length;
           if (changedTable.rows[1].cells[tr_length-1].classList.contains("crud_buttons")){
           for (var y = 1; y < changedTableLength; y++){

               changedTable.rows[y].deleteCell(tr_length-1);
           }}
            changedTable.deleteRow(0)
            changedTable.setAttribute("id", reqIdWitht);
            divTable.append(changedTable);
                 divTable.append(changedTable);
                divTable.addEventListener('dblclick', function (e) {
  handleTableEditBtn(e);
});

changedTableCln.addEventListener('dblclick', function (e) {
  handleTableEditBtn(e);
});
elementEditable.append(changedTableCln);
elementEditable.addEventListener('dblclick', function (e) {
  handleTableEditBtn(e);
});
            modal.style.display = "none";
                            }
        }

//Create The Dropdown Form to fill in custom field values
        function createDropDownForm (defaulSl){
           defaulSl.setAttribute("name", "list");
            defaulSl.setAttribute("size", 1);
            let reqId = defaulSl.getAttribute('id');
            defaulSl.setAttribute("id", "sl".concat(reqId));
            defaulSl.addEventListener('change', function() {
                this.setAttribute("selected", true);
                    });
            submitChangesBtn  = document.getElementById("submitChanges");
            changedDropDown  = document.getElementById("newModalDropdown");

            if (changedDropDown != undefined){
            changedDropDown.parentNode.replaceChild(defaulSl, changedDropDown);
            }
            else{
                element = document.getElementById("changeDropdownForm");
                element.append(defaulSl);
            }

    const addDropdownItemBtn = document.querySelector('#addDropdownItemBtn');
    const removeDropdownItemBtn = document.querySelector('#removeDropdownItemBtn');

    const inputItem = document.querySelector('#name');


        addDropdownItemBtn.onclick = (e) => {
        e.preventDefault();
        let newDropdown = document.querySelector("#sl".concat(reqId));
        // validate the option
        if (inputItem.value == '') {
            alert('Please enter the name.');
            return;
        }
        // create a new option
        const option = new Option(inputItem.value, inputItem.value);
        // add it to the list
        newDropdown.add(option, undefined);

        // reset the value of the input
        inputItem.value = '';
        inputItem.focus();
    };

    // remove selected option
    removeDropdownItemBtn.onclick = (e) => {
        e.preventDefault();
        let newDropdown = document.querySelector("#sl".concat(reqId));
        // save the selected option
        let selected = [];

        for (let i = 0; i < newDropdown.options.length; i++) {
            selected[i] = newDropdown.options[i].selected;
        }

        // remove all selected option
        let index = newDropdown.options.length;
        while (index--) {
            if (selected[index]) {
                newDropdown.remove(index);
            }
        }
    };
            var modal = document.getElementById("myModal");
            // Get the button that opens the modal
            var btn = document.getElementById("myBtn");
            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];
            modal.style.display = "block";
           submitChangesBtn.onclick = (e) =>{
                e.preventDefault();

            changedDropDown  = document.getElementById("sl".concat(reqId));

            divDropDown  = document.getElementById("dropDownDiv".concat(reqId));
        //   if (document.getElementById(reqId)!= "undefined" || document.getElementById(reqId) != null){
        if (document.getElementById(reqId)){
            defaultSelectField = document.getElementById(reqId);
            console.log("default selected Normals times");

            // console.log(defaultSelectField.parentNode);
            // divDropDown.removeChild(defaultSelectField);
            defaultSelectField.parentNode.removeChild(defaultSelectField);
           }
            changedDropDown.setAttribute("id", reqId);
            divDropDown.append(changedDropDown);
            modal.style.display = "none";
            }

            span.onclick = function(e) {
                  e.preventDefault();
                changedDropDown  = document.getElementById("sl".concat(reqId));

            divDropDown  = document.getElementById("dropDownDiv".concat(reqId));
        //   if (document.getElementById(reqId)!= "undefined" || document.getElementById(reqId)!= null){
            if (document.getElementById(reqId)){
               console.log("deafult Selectf Field in spna click");
            defaultSelectField = document.getElementById(reqId);
            console.log(defaultSelectField);
            // divDropDown.removeChild(defaultSelectField);
            defaultSelectField.parentNode.removeChild(defaultSelectField);
           }
            changedDropDown.setAttribute("id", reqId);
            divDropDown.append(changedDropDown);
            modal.style.display = "none";
            }
        }

    function handleDropDwnDouble(eventclk){


                console.log("handleDropDwn Double");
                var big_elemet = eventclk.target.parentNode.parentNode.children
                console.log("big element");
                console.log(big_elemet);
                var newSelect = "";
                var newSelectId= " ";
                for(var i=0; i<big_elemet.length; i++){
                    childd = big_elemet[i];
                    if (childd.tagName == 'ADDRESS'){
                    console.log("i is address ".concat(i.toString()));
                    console.log("child = ".concat(childd.toString()));
                    newSelect=childd;

                }else{
                    console.log("i is NOT address ".concat(i.toString()));
                    console.log("child = ".concat(childd.toString()));

                }
                }
                // if (newSelect != "undefined" && newSelect != null){
                if(newSelect){
                createDropDownForm(newSelect.children[0]);

                }
                else{
                    console.log("Undefined NewSelect");
                    newSelectId = newSelect.getAttribute('id');
                    var getDigit = newSelectId.match(/(\d+)/);
                    console.log("newDigit = ".concat(getDigit.toString()));

                    let myNewSelect = document.createElement("select");
                    myNewSelect.setAttribute("id", getDigit.toString());
                    createDropDownForm(myNewSelect);
                }

    }



        //Handle Edit when Clicked
        function  getEditBtn(){
            const editBtn = document.createElement('span');
            editBtn.style.textAlign = 'center';
            editBtn.style.fontSize = '0.8em';
            editBtn.style.margin = '5px';
            editBtn.style.display = 'none';
            editBtn.className = 'closeBtn';
            editBtn.innerHTML = '<i class="fas fa-edit" style="color: #000;"></i>';
            editBtn.classList.add("float-right", "col-md-4");
            editBtn.onmouseover = (event) => {
                event.target.style.cursor = 'pointer';
                event.target.style.color = '#f00';
            };

            editBtn.onmouseout = (event) => {
                event.target.style.color = '#000';
            };

            editBtn.onclick = (eventclk) => {
                eventclk.preventDefault();
                handleDropDwnDouble(eventclk);
            };
            return editBtn;
        }
        function handleTableEditBtn(eventclk){

                    // var big_element = eventclk.target.parentNode.parentNode
                // console.log("big sjsjsj");
                // console.log(big_element);
                        var big_element = eventclk.target.parentNode.parentNode
                        var big_elementtest = eventclk.target.parentNode.parentNode.parentNode.parentNode
                        if (big_element.tagName != "ADDRESS"){
                            console.log("Not address");
                            big_element = eventclk.target.parentNode.parentNode.parentNode.parentNode
                        }
                    console.log("big sjsjsj");
                    console.log(big_element);
                    console.log("big element test sjsjsj");
                    console.log(big_elementtest);
                var newTable = big_element;
                var newTableId = " ";
                if (newTable ){
                // if (Number(newTable.children.length) > 0){// undefined  && newTable.children[0] != "undefined" && newTable.children[0] != null && newTable.children[0] != 0 ){
                    console.log("Passed Table Id hhhhhh====");
                console.log(newTable.children.length);
                lenNewTable = newTable.children.length;
                var passTable = "";
                for (var i = 0 ; i< lenNewTable; i++){
                    childdd = newTable.children[i];

                    if (childdd.tagName == "TABLE"){
                        console.log("i for table is address ".concat(i.toString()));
                    console.log("table child = ".concat(childdd.toString()));
                    passTable = childdd;

                    }
                }
                    createTableForm(passTable);

                }
                else{
                    console.log("Undefined NewTable");
                    newTableId = childd.getAttribute('id');
                    var getDigit = newTableId.match(/(\d+)/);
                    console.log("newDigit = ".concat(getDigit[0].toString()));

                    let myNewTable = document.createElement("table");
                    myNewTable.setAttribute("id", "t".concat(getDigit[0].toString()));
                    createTableForm(myNewTable);

                }

}

    //Handle Edit when Clicked
     function  getEditTableBtn(){
           const editBtn = document.createElement('span');
            editBtn.style.textAlign = 'center';
            editBtn.style.fontSize = '0.8em';
            editBtn.style.margin = '5px';
            editBtn.className = 'closeBtn';
            editBtn.setAttribute("id", "tableEditor");
            editBtn.innerHTML = '<i class="fas fa-table" style="color: #000;"></i>';
            editBtn.classList.add( "col-md-3");
            editBtn.onmouseover = (event) => {
                event.target.style.cursor = 'pointer';
                event.target.style.color = '#f00';
            };

            editBtn.onmouseout = (event) => {
                event.target.style.color = '#000';
            };

            editBtn.onclick = (eventclk) => {
                eventclk.preventDefault();
            handleTableEditBtn(eventclk);
            };
            return editBtn;
        }

    //First  Date field Genarator
    function getDateField(value){

        const dateBTN = document.createElement('button');
        dateBTN.className = 'btn-secondary';
        dateBTN.style.width = '100%';
        dateBTN.style.height = '100%';
        dateBTN.style.display = 'flex';
        dateBTN.style.cursor = 'pointer';
        dateBTN.style.justifyContent = 'center';
        dateBTN.style.alignItems = 'center';
        dateBTN.style.borderWidth = '2px';
        dateBTN.style.borderStyle = 'outset';
        dateBTN.style.borderColor = '-internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133))';
        dateBTN.innerHTML = '<p style="margin: 0px 20px">Date</p><i class="fa fa-calendar" aria-hidden="true"></i>';


        dateBTN.ondblclick = (ent) => {

            const modelContainer = getModelContainer();
            const modelContent = getModelContent();
            modelContent.style.backgroundColor = '#fff';


            let dd = undefined;
            if( value ){
                dd = value
            } else {
                const d = new Date();
                dd = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                console.log(dd)
            }


            const dateField = document.createElement('input');
            dateField.type = 'date';
            dateField.value = dd;

            dateField.style.width = '50%';
            dateField.style.height = '80%';
            dateField.style.fontSize = '1em';
            dateField.style.border = 'none';
            dateField.style.resize = 'none';
            dateField.style.backgroundColor = '#0000';
            dateField.style.borderRadius = '0px';
            dateField.style.outline = '0px';
            dateField.style.overflow = 'overlay';


            modelContent.append(dateField);
            modelContainer.append(modelContent);

            modelContainer.onclick = (ev) => {
                if(ev.target.dataset.name === 'containerDIV'){
                    ev.target.remove()
                }
            }

            const pageCont = document.getElementsByClassName('doc-container');
            pageCont[0].append(modelContainer);

        }

        return dateBTN;
    }

function getDateEditButton(){
const editBtn = document.createElement('span');
            editBtn.style.textAlign = 'center';
            editBtn.style.fontSize = '0.8em';
            editBtn.style.display = 'none';
            editBtn.style.margin = '5px';
            editBtn.className = 'closeBtn';
            editBtn.setAttribute("id", "getFormat2");
            editBtn.innerHTML = '<i class="fas fa-calendar" style="color: #000;"></i>';
            editBtn.classList.add("float-right", "col-md-4");
            editBtn.onmouseover = (event) => {
                event.target.style.cursor = 'pointer';
                event.target.style.color = '#f00';
            };

            editBtn.onmouseout = (event) => {
                event.target.style.color = '#000';
            };

            return editBtn;
}
     // Second Date field Generator
       function getDate(formatWanted){
                console.log("reqFormat after call getDate");
                console.log(formatWanted);
                console.log("isTemplate");
                console.log(isTemplate);
if(isTemplate){

                    $('.date').datepicker({

                    format: formatWanted
                    }

                    );
$('.date').click(function(){
    console.log("date clicked");
//   $("p:first").addClass("intro");
$(".table-condensed").addClass("table-success");
// $(".table-condensed").css('border-radius', '30px');
// $(".table-condensed").css('border-radius', '30px');

});}
                    }
    function resetter(){
        console.log("$('.date') after  page sec check");
                        console.log($('.date'));
                        $('.date').datepicker({

                    format: "dd/mm/yy",
                    }

                    );
$('.date').click(function(){
    console.log("date after refres clicked");
//   $("p:first").addClass("intro");
$(".table-condensed").addClass("table-success");
// $(".table-condensed").css('border-radius', '30px');
// $(".table-condensed").css('border-radius', '30px');

});
$('.date').datepicker("refresh");
    }
     function getDateField2(value, dateFormat){
            let modal =document.getElementById("myModal3");
            let editDateBtn =getDateEditButton();
            var divCont = document.createElement('div');
            divCont.style.width = "100%";
            divCont.style.height = "100%";
            divCont.className = "container";
            var getFormatBut = document.createElement('button');
            getFormatBut.setAttribute('id', 'getFormat' );
            getFormatBut.innerHTML = 'Get Format<i class="fa fa-calendar" aria-hidden="true"></i>';
            var dateField = document.createElement("input");
            dateField.setAttribute("type","text");
            dateField.classList.add("form-control", "date");
            dateField.style.width = "100%";
            if (value != "default"){
                dateField.setAttribute("value", value);
            }

            divCont.style.height = "100%";

            dateField.setAttribute("placeholder", "Pick A Date");
            var submitDateFormat = document.getElementById("submitDateFormat");
            var span = document.getElementsByClassName("close3")[0];
            // getFormatBut.onclick= (ev)=>{
            //     modal.style.display = "block";

            // }

            editDateBtn.onclick= (ev)=>{
                modal.style.display = "block";

            }
if (dateFormat != "default"){
                // dateField.setAttribute("value", value);
                console.log("$('.date') befroe");
                console.log($('.date'));
                // getDate(dateFormat);
                editDateBtn.style.display = "none";
                    console.log("dateFormat is not default");
                console.log(typeof dateFormat);
                    $('.date').datepicker({

                    format: "dd/mm/yy",
                    }

                    );
$('.date').click(function(){
    console.log("date clicked");
//   $("p:first").addClass("intro");
$(".table-condensed").addClass("table-success");
// $(".table-condensed").css('border-radius', '30px');
// $(".table-condensed").css('border-radius', '30px');

});
$('.date').datepicker("refresh");
console.log("$('.date') after");
                console.log($('.date'));
            }
            submitDateFormat.onclick = (env) =>{
                reqFormat = $( "#myselect option:selected" ).val();
                console.log("reqFormat after click");
                console.log(reqFormat);
                console.log(typeof reqFormat);
                getDate(reqFormat);
                modal.style.display = "none";



            }
            span.onclick = (env)=> {
                modal.style.display = "none";
            }
            // divCont.append(getFormatBut);
            divCont.append(editDateBtn);

            divCont.append(dateField);
divCont.addEventListener('click', (event)=>{
            if(isTemplate){
                console.log("is template isn get Date FIled");
                $('.portlet').css('display', 'block');
            }

});


            return divCont;
}

    function getImageField() {
        const imgField = document.createElement('input');
        imgField.type = 'file';

        imgField.style.margin = '20%';
        imgField.style.cursor = 'pointer';
        imgField.style.border = 'none';
        imgField.style.resize = 'none';
        imgField.style.fontSize = 'xx-small';
        imgField.style.backgroundColor = '#0000';
        imgField.style.borderRadius = '0px';
        imgField.style.outline = '0px';
        imgField.style.overflow = 'overlay';
        imgField.setAttribute('accept', 'image/*');
        imgField.innerText = 'Choose image';

        imgField.onchange = (ev) => {
            const image = document.createElement('img');
            image.src = URL.createObjectURL(ev.target.files[0]);
            image.style.width = '100%';
            image.style.height = '95%';
            image.style.marginTop = '4%';
            image.style.cursor = 'grab';
            image.setAttribute('draggable', false);

            image.setAttribute('tabindex', 0);

            const cont = ev.target.parentNode
            cont.replaceChild( image, ev.target);
        }
        imgField.addEventListener('click', (event)=>{
            if(isTemplate){
                console.log("is template isn get Image field");
                $('.portlet').css('display', 'block');
            }

});
        return imgField;
    }

    function renderImageField() {
        const image = document.createElement('img');
        image.style.width = '100%';
        image.style.height = '95%';
        image.style.marginTop = '4%';
        image.style.cursor = 'grab';
        image.setAttribute('draggable', false);
        image.setAttribute('tabindex', 0);
        return image;
    }

    function getModelContainer(){
        const containerDIV = document.createElement('div');
        containerDIV.style.width = '100%';
        containerDIV.style.height = '100%';
        containerDIV.style.top = '0';
        containerDIV.style.position = 'absolute';
        containerDIV.style.backgroundColor = '#22222277';
        containerDIV.style.display = 'flex';
        containerDIV.style.justifyContent = 'center';
        containerDIV.style.alignItems = 'center';
        containerDIV.style.zIndex = 100;
        containerDIV.setAttribute('data-name', 'containerDIV');



        return containerDIV
    }

    function getModelContent(){
        const modelContent = document.createElement('div');
        //modelContent.style.height = '50vh';
        modelContent.style.width = '50vw';
        modelContent.style.backgroundColor = '#fffc';
        modelContent.style.borderRadius = '3%';
        modelContent.style.display = 'flex';
        modelContent.style.flexDirection = 'column';

        return modelContent

    }


     function addCanEditor(ev) {
            let signField ;
            if(ev.target.dataset.img === 'isign'){
                signField = ev.target
            } else {
                signField = ev.target
            }

            const containerDIV = getModelContainer();
            const svgEditor = getModelContent();

            const canvas = document.createElement('canvas');
            const width = window.innerWidth / 2;
            const height = window.innerHeight / 3 ;
            //console.log(screen.innerWidth, screen.innerHeight)
            canvas.setAttribute('width', ((window.innerWidth / 2) - (window.innerWidth / 20) ) + 'px');
            canvas.setAttribute('height', height + 'px');
            canvas.style.border = '1px solid black';
            canvas.style.backgroundColor = '#fff';
            canvas.style.margin = '5%';
            canvas.setAttribute('draggable', false);

            const ctx = canvas.getContext('2d');
            let drawing = false;
            const pointArry = [];
            let startp = {
                x: 0,
                y: 0
            };

            canvas.onmousedown = (ev) => {
                drawing = true;
                startp.x = ev.pageX - (width / 2) - (window.innerWidth / 40);
                startp.y = ev.pageY - (height / 2) - (window.innerHeight / 8);

                const p = {
                        x: ev.pageX - (width / 2) - (window.innerWidth / 40),
                        y: ev.pageY - (height / 2) - (window.innerHeight / 8)
                    }
                pointArry.push(p)
            }
            canvas.onmouseup = (ev) => {
                drawing = false
                while(pointArry.length){
                    pointArry.pop()
                }

            }
            canvas.onmousemove = (ev) => {
                if( drawing ){
                    const p = {
                        x: ev.pageX - (width / 2) - (window.innerWidth / 40),
                        y: ev.pageY - (height / 2) - (window.innerHeight / 8)
                    }
                    pointArry.push(p);
                }
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(startp.x, startp.y);
                for(let i = 0; i < pointArry.length ; ++i){
                    ctx.lineTo(pointArry[i].x,pointArry[i].y)
                }
                ctx.stroke();

            }

            const menuCanvas = document.createElement('div');
            menuCanvas.style.display = 'flex';
            menuCanvas.style.justifyContent = 'center';
            menuCanvas.style.marginBottom = '5%';

            const clearBtn = document.createElement('button');
            clearBtn.innerHTML = 'Clear';
            clearBtn.className = 'btn btn-outline-danger';

            clearBtn.onclick = (ev) => {
                ctx.clearRect(0, 0, width, height);
            }

            const acceptBtn = document.createElement('button');
            acceptBtn.innerHTML = 'Accept';
            acceptBtn.className = 'btn btn-outline-success';
            acceptBtn.style.marginLeft = '5%';

            acceptBtn.onclick = (evnt) => {
                console.log("accept clicked");
                const canImg = new Image();
                canImg.src = canvas.toDataURL();
                canImg.style.width = '100%';
                canImg.style.height = '100%';
                canImg.style.cursor = 'pointer';
                canImg.setAttribute('data-img', 'isign');
                canImg.setAttribute('tabindex', 0);
                canImg.setAttribute('draggable', false);
                canImg.addEventListener('dblclick', addCanEditor, false);

                canImg.onclick = (ev) => {
                    if (ev.target.dataset.img === 'isign'){
                        ev.target.focus()
                    }
                }
                console.log("signField");
                console.log(signField);
                console.log("signFieldParentElemetn");
                console.log(signField.parentElement);
                const container = signField.parentElement
                container.removeChild(signField);

                container.append(canImg);

                containerDIV.remove();
            }


            const uploadSign = getImageField();
            uploadSign.style.margin = '0px'
            uploadSign.onchange = (ev) => {
                const image = document.createElement('img');
                image.src = URL.createObjectURL(ev.target.files[0]);
                image.style.width = '100%';
                image.style.height = '95%';
                image.setAttribute('tabindex', 0);

                image.onload = (evnt) => {
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                }
            };

            menuCanvas.append(uploadSign);
            menuCanvas.append(clearBtn);
            menuCanvas.append(acceptBtn);

            svgEditor.append(canvas);
            svgEditor.append(menuCanvas);
            containerDIV.append(svgEditor);

            containerDIV.onclick = (ev) => {
                if(ev.target.dataset.name === 'containerDIV'){
                    ev.target.remove()
                }
            }

            const pageCont = document.getElementById('editor-container');
            pageCont.append(containerDIV);
        }


    function getSignField() {
        const signF = document.createElement('button');
        signF.className = 'btn-secondary signature-btn';
        signF.style.width = '100%';
        signF.style.height = '100%';
        signF.style.display = 'flex';
        signF.style.cursor = 'pointer';
        signF.style.justifyContent = 'center';
        signF.style.alignItems = 'center';
        signF.style.borderWidth = '2px';
        signF.style.borderStyle = 'outset';
        signF.style.borderColor = '-internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133))';
        signF.innerHTML = 'Signature...<i class="fa fa-pencil"></i>';
        signF.addEventListener('dblclick', addCanEditor, false)
        signF.addEventListener('click', (event)=>{
            if(isTemplate){
                console.log("is template isn get Signature");
                $('.portlet').css('display', 'block');
            }
    focusInEvent(event);
});
        return signF
    }

    function getDeleteBtn(){
        const closeBtn = document.createElement('span');
        closeBtn.style.textAlign = 'center';
        closeBtn.style.fontSize = '0.8em';
        closeBtn.style.margin = '5px';
        closeBtn.className = 'closeBtn';
        closeBtn.innerHTML = '<i class="fas fa-trash" style="color: #000;"></i>';

        closeBtn.onmouseover = (event) => {
            event.target.style.cursor = 'pointer';
            event.target.style.color = '#f00';
        };

        closeBtn.onmouseout = (event) => {
            event.target.style.color = '#000';
        };

        if (isTemplate) {
            closeBtn.onclick = (eventclk) => {
                eventclk.preventDefault();
                if(eventclk.target.parentNode.parentNode.parentNode.parentNode.className != 'pdf-file'){
                    eventclk.target.parentNode.parentNode.parentNode.parentNode.remove();
                }

            };
        }

        return closeBtn;
    }

    //select user on fields 'select-option' field
    function getSelectOptionsField(auth_user){
        const select = document.createElement('select');
        select.className = "form-select form-select-sm auth-user";
        let  check = true;

        const userList = document.getElementById('user-list');

        const defOpt = document.createElement('option');
        defOpt.innerHTML = "Select User";
        defOpt.setAttribute("value", null);




        for(let item of userList.children){
            const opt = document.createElement('option');
            opt.innerHTML = item.innerHTML;
            opt.setAttribute("value", item.innerHTML);

            if(item.innerHTML === auth_user){
                 console.log("item.innerHTML === auth_user working");
                console.log("auth_user");
                console.log(auth_user);
                opt.setAttribute('selected', true);
                 opt.classList.add('selected');
                 opt.classList.add('auth_user_class');
                check = false;
            }
            select.append(opt);

        }
          if (check){
            console.log("Check == false not working");
                console.log("auth_user");
                console.log(auth_user);
            defOpt.setAttribute('selected', true);
            defOpt.classList.add('selected');
            defOpt.classList.add('auth_user_class');
            }
            select.append(defOpt);


        if (!isTemplate) {
            select.setAttribute('disabled', true)
        }

        return select;
    }

    //Draggin element over page
    const dragElementOverPage = ( event ) => {

        let holder;
        if(!resizing){
            let initX = event.screenX;
            let initY = event.screenY;


            /* Ensure That target has changed */
            var counterCheck = true;
            var tempTarget =  event.target;
            var hitTarget = "";
            while(counterCheck){
                // if(tempTarget.className === 'holderDIV'){
                if(tempTarget.classList.contains("holderDIV")){
                    hitTarget = tempTarget;
                    counterCheck = false;
                }
                tempTarget = tempTarget.parentNode;
            }

            holder = hitTarget;
            const holderPos = (function () {
                const holderPos = {
                    top : parseInt(holder.style.top.slice(0, -2)),
                    left : parseInt(holder.style.left.slice(0, -2))
                }
                return Object.seal(holderPos);
            })();

            window.addEventListener('mousemove', moveObject);
            function moveObject(ev) {
                ev.preventDefault();
                const diffX = ev.screenX - initX;
                const diffY = ev.screenY - initY;
                holder.style.top = ( holderPos.top + diffY ) + 'px';
                holder.style.left = ( holderPos.left + diffX ) + 'px';

            }

            window.addEventListener('mouseup', stopMove);
            function stopMove(ev){
                window.removeEventListener('mousemove', moveObject);
                window.removeEventListener('mouseup', stopMove);

            }
        }
    }

//Handle SUbmenu for table elements
function handleUserPermissions(childer, cell_index,row_index, tableId){

            let tab = document.getElementById(tableId);
            td = tab.rows[row_index].cells[cell_index];
            console.log("intended td is ");
            console.log(td);
                        child_holder = childer;
console.log("Older holder orions");
    console.log(childer);
console.log("Older holder orions parents");
    // console.log(childer.parentNode);
    console.log(child_holder);
                        // child.style.display = 'flex';
                        console.log("focusinvent fo loop if holder subb");
                console.log(childer.className);
                // let holder_options = childer.getElementsByTagName('OPTION');
                let holder_options = td.getElementsByTagName('OPTION');
                console.log(td.getElementsByTagName('OPTION'));
                // user_portlet_select = document.getElementById("user_portlet_select");
                user_portlet_select_sub = $("#user_portlet_select_sub");
                // user_portlet_select.attr(multiple, false);
                const count = holder_options.length;
                console.log("countsub");
                console.log(count);
                // holder_options.forEach((opt) => {
                //             // note.style.backgroundColor = 'yellow';
                //             user_portlet_select.appendChild(opt);
                //         });
                 $('#user_portlet_select_sub').empty();
                 let tempText = "";
                 let tempIndex = 0;
                for (let i = 0; i < count; i++) {
                    // notes[i].style.backgroundColor = "yellow";
                    let tempClone = holder_options[i].cloneNode(true);

                          if (holder_options[i].classList.contains('selected')) {
                        // holder_options[i].classList.remove('selected')
                        console.log("my classList contained selected sub");
                       console.log(tempText);
                        tempText = holder_options[i].text;
                        tempIndex = i;
                         console.log(tempText);
                         console.log(tempIndex);
    // do some stuff
}
if (holder_options[i].classList.contains('auth_user_class_sub')) {
                        // border_style = '1px solid 	#008000';
                        border_style = '2px solid green';

    // do some stuff
}
                    user_portlet_select_sub.append(tempClone);

                }
                   $("#user_portlet_select_sub").selectpicker({
    noneSelectedText: tempText});
                // user_portlet_select.attr('noneSelectedText', tempText);
    //             $(".selectpicker").multiselect({
    // noneSelectedText: tempText,});

                $("#user_portlet_select_sub").selectpicker("refresh");
                let curr= $("#user_portlet_select_sub").find('option').eq(tempIndex);

                console.log(user_portlet_select_sub);
                let select_element = childer.getElementsByTagName('SELECT')[0];
                console.log("select element ");
                console.log(select_element);
                select_element.style.display = 'none';
//                 $('#delete_element_portlet').on('click', function(){
//                     console.log("holder_delete_button");
//                     console.log(child_holder.getElementsByClassName('closeBtn')[0].parentNode.parentNode.parentNode);
//                     child_holder.getElementsByClassName('closeBtn')[0].parentNode.parentNode.parentNode.remove();
//   });
                 $('#user_portlet_select_sub').on('change', function(){
                            console.log("Old holder orions sub");
    console.log(child_holder);
                     console.log("Changed user_portlet_select");
    let selected = $(this).find("option:selected").val();
    console.log("Selected user_portlet_select sub");
    console.log(selected);
     for (let i = 0; i < count; i++) {
                    // notes[i].style.backgroundColor = "yellow";
                    console.log("For loop holder_options[i].value user_portlet_select sub");
                    console.log(td.getElementsByTagName('OPTION')[i].value);
                    // holder_options[i].setAttribute("selected", false);
                    holder_options[i].removeAttribute("selected");
                    if (td.getElementsByTagName('OPTION')[i].classList.contains('selected')) {
                        td.getElementsByTagName('OPTION')[i].classList.remove('selected');
                         td.getElementsByTagName('OPTION')[i].classList.remove('auth_user_class');

    // do some stuff
}

                   if(holder_options[i].value == selected){
                       console.log("Match made user_portlet_selectsub");
                        console.log("td for sec");
                        // td.getElementsByTagName('OPTION')[i].classList.add('auth_user_class_sub_test');
                        console.log(td);
                    //   holder_options[i].setAttribute("selected", true);
                       td.getElementsByTagName('OPTION')[i].classList.add('selected');
                       td.getElementsByTagName('OPTION')[i].classList.add('auth_user_class');
                       td.getElementsByTagName('OPTION')[i].setAttribute("selected", true);;
                    //   holder_options[i].classList.add('selected');
                    //   holder_options[i].classList.add('auth_user_class');
                   }
                }
        console.log("New holder orions sub");
    console.log(child_holder);

    //alert(selected);
    // $('#selectzkh').empty();
    //  $(".selectpicker").selectpicker({
    //     noneSelectedText : 'Pr' // by this default 'Nothing selected' -->will change to Please Select
    // });
  });



}

    //Function to run when Input is focused
    const focusInEvent = (eventh) => {

        let border_style = '1px solid rgb(255 191 0)';
        /*const pdfFile = document.getElementById('pdf-file');

        const fileFields = pdfFile.getElementsByClassName('holderDIV');

        for ( let elem of fileFields ){
            deFocusElement(elem)


        older comments
        }*/



        // let tableCharacter = "Default";
        // if (eventh.target.tagName == "TD"){
        //   tableCharacter = event.target.parentNode.parentNode.parentNode.parentNode
        // }
        // console.log("Target focusInvent");
        // console.log(eventh.target);
        // console.log("Main Character");
        // console.log(tableCharacter.parentNode);
        // eventh.preventDefault();
        // eventh.target.style.outline = '0px';
        // if (eventh.target.parentNode.className === 'holderDIV'){// || tableCharacter.parentNode.classList.contains("holderDIV")){
        //     eventh.target.parentNode.style.border = '1px solid rgb(255 191 0)';
        //     eventh.target.parentNode.style.zIndex = '5';
        //     for(child of eventh.target.parentNode.children){
        //     console.log(".parentNode");

        //         if(child.className === 'resizeBtn'){

        //             child.style.display = 'block';
        //         }
        //         if(child.className === 'holder-menu'){
        //             child.style.display = 'flex';
        //         }
        //     }

        // }





            // if (tableCharacter != "Default"){
            //     console.log("Passed test");
            // for(child of tableCharacter.parentNode.children){
            // console.log(".maincharacter childres");

            //     if(child.className === 'resizeBtn'){

            //         child.style.display = 'block';
            //     }
            //     if(child.className === 'holder-menu'){
            //         child.style.display = 'flex';
            //     }
            // }

            // }



        // }




        // if (eventh.target.parentNode.parentNode.parentNode.className === 'holderDIV'){
        //     console.log(".parentNode.parentNode.parentNode");
        //     eventh.target.parentNode.style.border = '1px solid rgb(255 191 0)';
        //     eventh.target.parentNode.style.zIndex = '5';
        //     for(child of eventh.target.parentNode.children){
        //         if(child.className === 'resizeBtn'){
        //             child.style.display = 'block';
        //         }
        //         if(child.className === 'holder-menu'){
        //             child.style.display = 'flex';
        //         }
        //     }
        // }





let all_marked = document.getElementsByClassName('element_on_edit');
for (var i=0; i<all_marked.length; i++) {
  all_marked[i].classList.remove('element_on_edit');
}
          console.log("focusinvent new");
                console.log(eventh.target);

            var counterCheck = true;
                var tempTarget =  eventh.target;
                var hitTarget = "";
                var bttmTble = "";
                var rightTble = "";
                let holder = "";
                while(counterCheck){
                    // if(tempTarget.className === 'holderDIV'){
                        console.log("focusinvent loop");
                console.log(tempTarget);
                        if(tempTarget.className === 'resizeBtn'){
                            tempTarget.style.display = 'block';
                    }
                    if(tempTarget.className === 'holder-menu'){
                        tableId = "";
                        cell_index = "";
                        row_index = ""
                        c = true;
                        d = tempTarget.parentNode;
                        tempTarget.style.display = 'flex';
                        console.log("tempTarget through parentElement holder menu");

                        console.log(tempTarget.parentNode.parentNode);
                        console.log("tempTarget through this cell index");
                        console.log(tempTarget.parentNode.parentNode.cellIndex);
                        while(c){
                            if(d.tagName == "TD"){
                                cell_index = d.cellIndex;
                                row_index = d.parentNode.rowIndex ;

                            }
                            if(d.tagName == "TABLE"){
                                tableId = d.id;
                                c =false;
                            }
                            d = d.parentNode
                        }
                        console.log("cellindex ");
                        console.log(cell_index);
                        console.log("rowindex ");
                        console.log(row_index);
                        console.log("table id ");
                        console.log(tableId);
                        handleUserPermissions(tempTarget,cell_index,row_index, tableId );
                    }
                    if(tempTarget.nextElementSibling){
                    if(tempTarget.nextElementSibling.className === 'holder-menu'){
                        tempTarget.style.display = 'flex';
                        console.log("tempTarget through Nextsibling holder menu");
                        console.log(tempTarget.nextElementSibling);
                    }}
                    if(tempTarget.previousElementSibling){
                    if(tempTarget.previousElementSibling.className === 'holder-menu'){
                        if (tempTarget.previousElementSibling.parentNode.classList.contains("holderDIV")){
                            console.log("Handled elsewhere");
                        }else{
                            tableId = "";
                        cell_index = "";
                        row_index = ""
                        c = true;
                        d = tempTarget.previousElementSibling.parentNode.parentNode ;
                            tempTarget.style.display = 'flex';
                        console.log("tempTarget through previousElementSibling holder menu");
                        console.log(tempTarget.previousElementSibling);
                        console.log("tempTarget through previousElementSibling PArent holder menu");
                        console.log(tempTarget.previousElementSibling.parentNode);
                         while(c){
                            if(d.tagName == "TD"){
                                cell_index = d.cellIndex;
                                row_index = d.parentNode.rowIndex ;

                            }
                            if(d.tagName == "TABLE"){
                                tableId = d.id;
                                c =false;
                            }
                            d = d.parentNode
                        }
                        console.log("cellindex ");
                        console.log(cell_index);
                        console.log("rowindex ");
                        console.log(row_index);
                        console.log("table id ");
                        console.log(tableId);
                        // handleUserPermissions(tempTarget,cell_index,row_index, tableId );

                        handleUserPermissions(tempTarget.previousElementSibling ,cell_index,row_index, tableId);
                        }

                    }}
                    if(tempTarget.classList.contains("holderDIV")){
                        console.log("focusinvent holderdiv found");
                        console.log(tempTarget.style.border);
                        hitTarget = tempTarget;
                        hitTarget.style.border = border_style;
                        hitTarget.style.zIndex = '5';
                        for(child of tempTarget.children){
                            console.log("focusinvent fo loop");
                console.log(child.className);
                    if(child.className === 'resizeBtn'){
                        child.style.display = 'block';
                        console.log("focusinvent fo loop if resie");
                console.log(child.className);
                    }
                    if(this.child.className === 'holder-menu'){
        this.child.classList.add('element_on_edit');
console.log("For this options");
    console.log(this.child);
    console.log(this);
                        let child_holder = this.child;
console.log("Older holder orions");
    console.log(child);
    console.log(child_holder);
                        this.child.style.display = 'flex';
                        console.log("focusinvent fo loop if holder");
                console.log(this.child.className);
                let marked = document.getElementsByClassName('element_on_edit');
                let holder_options_main = marked[0].getElementsByTagName('OPTION');
                console.log(this.child.getElementsByTagName('OPTION'));
                // user_portlet_select = document.getElementById("user_portlet_select");
                user_portlet_select = $("#user_portlet_select");
                // user_portlet_select.attr(multiple, false);
                const count = holder_options_main.length;
                console.log("count");
                console.log(count);
                // holder_options.forEach((opt) => {
                //             // note.style.backgroundColor = 'yellow';
                //             user_portlet_select.appendChild(opt);
                //         });
                 $('#user_portlet_select').empty();
                 let tempText = "";
                 let tempIndex = 0;
                for (let i = 0; i < count; i++) {
                    // notes[i].style.backgroundColor = "yellow";
                    let tempClone = holder_options_main[i].cloneNode(true);

                          if (holder_options_main[i].classList.contains('selected')) {
                        // holder_options[i].classList.remove('selected')
                        console.log("my classList contained selected");
                       console.log(tempText);
                        tempText = holder_options_main[i].text;
                        tempIndex = i;
                         console.log(tempText);
                         console.log(tempIndex);
    // do some stuff
}
if (holder_options_main[i].classList.contains('auth_user_class')) {
                        // border_style = '1px solid 	#008000';
                        border_style = '2px solid green';

    // do some stuff
}
                    user_portlet_select.append(tempClone);

                }
                   $("#user_portlet_select").selectpicker({
    noneSelectedText: tempText});
                // user_portlet_select.attr('noneSelectedText', tempText);
    //             $(".selectpicker").multiselect({
    // noneSelectedText: tempText,});

                $("#user_portlet_select").selectpicker("refresh");
                let curr= $("#user_portlet_select").find('option').eq(tempIndex);

                console.log(user_portlet_select);
                child.style.display = 'none';
                $('#delete_element_portlet').on('click', function(){
                    console.log("holder_delete_button");
                    console.log(child_holder.getElementsByClassName('closeBtn')[0].parentNode.parentNode.parentNode);
                    marked[0].getElementsByClassName('closeBtn')[0].parentNode.parentNode.parentNode.remove();
  });
   $('#delete-btnn').on('click', function(){
                    console.log("holder_delete_button");
                    console.log(child_holder.getElementsByClassName('closeBtn')[0].parentNode.parentNode.parentNode);
                    marked[0].getElementsByClassName('closeBtn')[0].parentNode.parentNode.parentNode.remove();
  });
                 $('#user_portlet_select').on('change', function(){
                            console.log("Old holder orions");
    console.log(child_holder);
                     console.log("Changed user_portlet_select");
    var selected = $(this).find("option:selected").val();
    console.log("Selected user_portlet_select");
    console.log(selected);

     for (let i = 0; i < count; i++) {
                    // notes[i].style.backgroundColor = "yellow";
                    console.log("For loop holder_options[i].value user_portlet_select");
                    console.log(marked[0].getElementsByTagName('OPTION')[i].value);
                    // holder_options[i].setAttribute("selected", false);
                    marked[0].getElementsByTagName('OPTION')[i].removeAttribute("selected");
                    if (marked[0].getElementsByTagName('OPTION')[i].classList.contains('selected')) {
                        console.log("Marked contains Selected");
                        console.log(marked[0].getElementsByTagName('OPTION')[i])
                        marked[0].getElementsByTagName('OPTION')[i].classList.remove('selected');
                         marked[0].getElementsByTagName('OPTION')[i].classList.remove('auth_user_class');

    // do some stuff
}

                   if(marked[0].getElementsByTagName('OPTION')[i].value == selected){
                       console.log("Match made user_portlet_select");
                       marked[0].getElementsByTagName('OPTION')[i].setAttribute("selected", true);
                       marked[0].getElementsByTagName('OPTION')[i].classList.add('selected');
                       marked[0].getElementsByTagName('OPTION')[i].classList.add('auth_user_class');
                   }
                }
        console.log("New holder orions");
    console.log(marked[0]);

    //alert(selected);
    // $('#selectzkh').empty();
    //  $(".selectpicker").selectpicker({
    //     noneSelectedText : 'Pr' // by this default 'Nothing selected' -->will change to Please Select
    // });
  });
                    }
                }
                        counterCheck = false;
                    }
                    tempTarget = tempTarget.parentNode;
                }

                holder = hitTarget;





    };

    // de focus elements
    function deFocusElement (elem) {
        elem.style.border = '1px dotted rgb(255 191 0)';
        elem.style.zIndex = '2';

        for(child of elem.children){
            if(child.className === 'resizeBtn' || child.className === 'holder-menu'){
                child.style.display = 'none';
            }
        }
    };

    // not in circuit
    function deFocusElementss (eventh) {
        eventh.target.parentNode.style.border = '1px dotted rgb(255 191 0)';
        eventh.target.parentNode.style.zIndex = '2';
        let hM;
        for(child of eventh.target.parentNode.children){
            if(child.className === 'resizeBtn'){
                child.style.display = 'none';
            }

            if(child.className === 'holder-menu'){
                hM = child;
            }
        }

        if( hM ){
            setTimeout(function() {
                hM.style.display = 'none';
            }, 200);
        }
    };

    function getHolderMenu(auth_user){
        //putting functional menu on holder

        const HMContainer = document.createElement('div');

        HMContainer.style.height = '100%';
        HMContainer.style.padding = '5px';
        HMContainer.style.display = 'flex';
        HMContainer.style.alignItems = 'center';
        HMContainer.style.justifyContent = 'center';
        HMContainer.style.backgroundColor = 'rgb(129 129 129 / 50%)';

        HMContainer.append(getSelectOptionsField(auth_user));

        if (isTemplate) {
            HMContainer.append(getDeleteBtn());
        }



        const holderMenu = document.createElement('div');
        holderMenu.className = 'holder-menu';
        holderMenu.style.height = '35px';
        holderMenu.style.display = 'flex';
        holderMenu.style.justifyContent = 'center';
        holderMenu.style.width = '100%';
        holderMenu.style.borderRadius = '0%';
        holderMenu.style.position = 'absolute';
        holderMenu.style.right = '0px';
        holderMenu.style.top = '-40px';

        holderMenu.append(HMContainer);
        //holderMenu.style.transform = 'translateX(-50%)';

        return holderMenu
    }

      function getTableCellWidths(){
        //get all tables
        let widthArray = []
        let heightArray = []
        widthArray[0]= "None";
        let addressList = document.querySelectorAll("address");
        for (let i = 0; i<addressList.length; i++){
            let temp = "";
            let tempWidth = ""
            let tempCellWidth = ""
            let tempCellHeight = ""
            let tempArr = []
            let id = addressList[i].getAttribute("id").match(/(\d+)/)[0];
            temp = "t"+(id).toString();
            for (let r = 0; r<addressList[i].children.length; r++){
            if (addressList[i].children[r].tagName == "TABLE"){
                console.log("addressList[i].children[i].rows[0].cells[0] In TABLE");
                let tempEle = addressList[i].children[r].rows[0].cells[0];
                if (tempEle == undefined){
                    console.log("Temp ele is undefined");
                    console.log(addressList[i].children[r].rows[1].cells[0]);
                    tempEle = addressList[i].children[r].rows[1].cells[0];
                }
                 console.log(addressList[i].children[r].rows[0]);
                tempCellWidth = window.getComputedStyle(tempEle, null).getPropertyValue("width");
                tempCellHeight = window.getComputedStyle(tempEle, null).getPropertyValue("height");
                tempArr.push(tempCellWidth);
                tempArr.push(tempCellHeight);
                widthArray[id] = tempArr

            }
            }
        }
        return widthArray;
    }

    function handleTextEditPara (holderDIV, inputField, inputType){
        console.log("Input type is "+ inputType);

        console.log("Input filed is ");
        console.log(holderDIV);
           var myDiv =  holderDIV.append(inputField);
                    let cellWidths = getTableCellWidths();
                    let myTd  = document.createElement('td');
                    holderDIV.style.width = "100%";
                    holderDIV.style.height = "100%";
                    var holder_obj = '';
                    var genSelect = '<select class="form-select form-select-sm auth-user" style="width:inherit; display:none;">';
                    for (var y=0 ; y< holderDIV.children.length; y++){
                        // console.log("childY");
                        // console.log(holderDIV.children[y]);
                            if(holderDIV.children[y].className === "holder-menu"){
                                // console.log("===");
                            holder_obj = holderDIV.children[y]
                            // console.log("holder_obj.children[0].children[c].options[1].value)");
                            // console.log(holder_obj.children[0].children[0].options[1].value);
                            for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                    // console.log((holder_obj.children[0].children[c].options[0].value));
                                    for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){
                                        //  genSelect.concat('<option value="'.concat(holder_obj.children[0].children[c].options[k].value).concat('">').concat(holder_obj.children[0].children[c].options[k].value).concat('</option>'));
                                          let tempOpt = holder_obj.children[0].children[c].options[k]
                                          let selected = false;
                                          let auth_user_class = false;

                                          let autVal = tempOpt.value ;

                                        let autValOp = autVal
                                        autUserOptTrim = autValOp.substring(0, Math.min(4,autValOp.length));

                                        if (autVal == "null"){
                                            autValOp = "Select User";
                                        }
                                        else{
                                            autValOp =autUserOptTrim;
                                        }
                                         if(tempOpt.classList.contains("selected")){
                                              selected = true;

                                          }
                                          if(tempOpt.classList.contains("auth_user_class")){
                                              auth_user_class = true;

                                          }
                                        //  genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                        if (selected && auth_user_class) {
                                            	// statement
                                        	genSelect = genSelect + '<option selected = "true" class = "selected auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(selected  && !auth_user_class){
                                            	// statement
                                    	genSelect = genSelect + '<option selected = "true" class = "selected" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(!selected  && auth_user_class){
                                            	// statement
                                	genSelect = genSelect + '<option class = "auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else{
                                              genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                            }
                                        // console.log(genSelect);

                                    }

                                }
                            }
                            break;
                        }

                    }
                    genSelect.concat('</select>')
                    let holderMenuStr = '<div class="holder-menu" style=" height: inherit; width:100%; display: flex; flex-direction: column;  border-radius: 0%; background-color: #fff;">'
                         + genSelect+
                        '</div>';
                    // console.log("event.target.tagName == 'TD'")
                    // console.log(inputField);
                    // console.log(holderDIV);

                    // console.log(myTd);
                    targetTD= event.target
                    let testDiv = document.createElement("div");
                    let textPara = document.createElement("p");

                    var stringToHTML = function (str) {
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(str, 'text/html');
                            return doc.body;
                        };
                    let cellI =""; //intendedTd.children[0].rows[0].cells[0];
                    let typeOfConcern = ""
                        if (inputType === "TEXT_BUTTON"){
                            // console.log("TEXT BUTTON SELECY");
                    //      typeOfConcern = '<textarea style="width:inherit; height: 80%; margin: 1%;\
                    // font-size: 1em; border: none; resize: none; background-color:\
                    // rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow:\
                    // overlay;" bold;"></textarea>';
                    typeOfConcern = '<textarea style="width:inherit;  height: 40px;  rows=\"4\" cols=\"50\" maxlength=\"200\"  display: block;\
                    cursor: pointer; justify-content: center; align-items: center; border-width: 2px;\
                    border-style: outset; outline: 0px;"></textarea>';

                        //  var myWDiv = '<div>'+holderMenuStr + typeOfConcern+ '</div>';
                         let myWDiv = '<div style="width: 100%;">'.concat(holderMenuStr).concat(typeOfConcern).concat( '</div>');
                    var td = '<td>'+myWDiv+'</td>';
                    var tr = '<tr>'+td+'</tr>';
                    var table1 = '<table>'+tr+'</table>';
                    // console.log(inputField);

                    // td.innerText = "This one replace that";
                    // targetTD.parentNode.replaceChild(targetTD, td);
                    let intendedTd = stringToHTML(table1);
                    // console.log(intendedTd.children[0].rows[0].cells[0]);
                     cellI = intendedTd.children[0].rows[0].cells[0];

                        }
                        else if (inputType === "EDIT_P"){
                            // console.log("EDIT P CONCERBED")
                            typeOfConcern = '<div contenteditable="true" id="textBox" style="width: 100%; \
                    height: 80%; margin: 1%; font-size: 1em; border: none; \
                    resize: none; background-color: rgba(0, 0, 0, 0);\
                     border-radius: 0px; outline: 0px; overflow: overlay;">\
                     <p></p> </div>';
                    let myWDiv = '<div style= width:inherit;>'+holderMenuStr + '</div>';
                    //   var myWDiv = '<div>'+holderMenuStr + typeOfConcern+ '</div>';
                    // let myWDiv = '<div style="width: inherit;">'.concat(holderMenuStr).concat(typeOfConcern).concat( '</div>');

                    let td = '<td>'+myWDiv+'</td>';
                    let tr = '<tr>'+td+'</tr>';
                    let table1 = '<table>'+tr+'</table>'
                    // console.log("event.style.wodth");
                    // console.log(event.target.parentNode.parentNode.parentNode.getAttribute("id"));
                    let intendedTd = stringToHTML(table1);
                    // console.log("parafiled Indeded");
                    // console.log(intendedTd.children[0].rows[0].cells[0]);
                    cellI = intendedTd.children[0].rows[0].cells[0];

                    testDiv.setAttribute("id", "textBox");
                    testDiv.setAttribute("contenteditable", true);
                    testDiv.style.width = 'inherit';
                    testDiv.style.height = '40px';
                    testDiv.onclick = ()=>{
                        toogleTxtFormBlock();
    //                     requirejs(['text_format'], function (text_format) {
    // //   const headerEl = document.getElementById("header");
    // //   headerEl.textContent = lodash.upperCase("hello world");
    // text_format.toogleTxtFormBlock();
    // });
                    }
                    // textPara.innerHTML = "Input Here";
                    testDiv.appendChild(textPara);



                    cellI.appendChild(testDiv);
                    // console.log("CELLI");
                    // console.log(cellI);

                        }

                    let targetId = event.target.parentNode.parentNode.parentNode.getAttribute("id")
                    let tdI =  targetId.match(/(\d+)/)[0]
                    // console.log("Much Imported Id "+tdI);
                    // console.log(cellWidths[tdI]);
                    // fIwidth =   (cellWidths[tdI][0].match(/(\d+)/)[0] -20).toString()+"px";
                    // fIheight =   (cellWidths[tdI][1].match(/(\d+)/)[0] -20).toString()+"px";
                    fIwidth =   (cellWidths[tdI][0].match(/(\d+)/)[0]).toString()+"px"
                    fIheight =   (cellWidths[tdI][1].match(/(\d+)/)[0]).toString()+"px"

                    // console.log(fIwidth);
                    // console.log(fIheight);
                    cellI.style.width = fIwidth;
                    cellI.style.height = fIheight;

                    targetTD.replaceWith(cellI);

    }
    //Handle Table
    function handleTableCase( ){
                let inputField = undefined;
                var tableElements = document.querySelectorAll('.tableDiv');
                var needed_length = tableElements.length
                for (i = 0; i <needed_length ; i++) {

                    tableElements[i].removeAttribute("id");
                    tableElements[i].setAttribute("id", "tableDiv".concat((i+1).toString()))
                    tableElements[i].children[0].removeAttribute("id");
                    tableElements[i].children[0].setAttribute("id", "t".concat((i+1).toString()))
                    var getDigit = "hdhdhd288888829292".match(/(\d+)/);

                }


                inputField = getTableField(needed_length+1);
                console.log("inputField.children[1].rows");
                console.log(inputField.children[0].rows);
                row_length = inputField.children[0].rows.length;
                col_len = inputField.children[0].rows[0].cells.length;
                for (let y = 0; y <row_length; y++){
                    for (let x = 0; x<col_len; x++){
                        inputField.children[0].rows[y].cells[x].addEventListener('click', event => {
                            console.log("CLicked tables");
                             console.log(event.target)
                            event.target = inputField.parentNode;
                            // console.log(event.target.parentNode.parentNode.parentNode.parentNode);
                            console.log("New Target Click Tables");
                            console.log(event.target)
                            focusInEvent(event);

                        });
                    }
                }
        return inputField

    }
    //Handle Date case for table
    function handleDateCase(holderDIV){

        //    var myDiv =  holderDIV.append(inputField);
                    let cellWidths = getTableCellWidths();
                    let myTd  = document.createElement('td');
                    holderDIV.style.width = "100%";
                    holderDIV.style.height = "100%";
                    holderDIV.style.display = "none";
                    var holder_obj = '';
                    var genSelect = '<select class="form-select form-select-sm auth-user" style="width:inherit; display:none;">';
                    for (var y=0 ; y< holderDIV.children.length; y++){
                        // console.log("childY");
                        // console.log(holderDIV.children[y]);
                            if(holderDIV.children[y].className === "holder-menu"){
                                // console.log("===");
                            holder_obj = holderDIV.children[y]
                            // console.log("holder_obj.children[0].children[c].options[1].value)");
                            // console.log(holder_obj.children[0].children[0].options[1].value);
                            for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                    // console.log((holder_obj.children[0].children[c].options[0].value));
                                    for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){
                                        //  genSelect.concat('<option value="'.concat(holder_obj.children[0].children[c].options[k].value).concat('">').concat(holder_obj.children[0].children[c].options[k].value).concat('</option>'));
                                          let autVal = holder_obj.children[0].children[c].options[k].value ;
                                        let autValOp = autVal
                                        let selected = false;
                                          let auth_user_class = false;
                                        autUserOptTrim = autValOp.substring(0, Math.min(4,autValOp.length));

                                        if (autVal == "null"){
                                            autValOp = "Select User";
                                        }
                                        else{
                                            autValOp =autUserOptTrim;
                                        }
                                        //  genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                         if (selected && auth_user_class) {
                                            	// statement
                                        	genSelect = genSelect + '<option selected = "true" class = "selected auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(selected  && !auth_user_class){
                                            	// statement
                                    	genSelect = genSelect + '<option selected = "true" class = "selected" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(!selected  && auth_user_class){
                                            	// statement
                                	genSelect = genSelect + '<option class = "auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else{
                                              genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                            }
                                        // console.log(genSelect);

                                    }

                                }
                            }
                            break;
                        }

                    }
                    genSelect.concat('</select>')

                    // let holderMenuStr = '<div class="holder-menu" style=" height: 30px; width:inherit; display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
                    //      + genSelect+
                    //     '</div>';
                    let holderMenuStr = '<div class="holder-menu" style=" height: inherit; width:100%; display: flex; flex-direction: column;  border-radius: 0%; background-color: #fff;">'
                         + genSelect+
                        '</div>';
                    // console.log("event.target.tagName == 'TD'")
                    // console.log(inputField);
                    // console.log(holderDIV);

                    // console.log(myTd);
                    targetTD= event.target
                    let testDiv = document.createElement("div");
                    let textPara = document.createElement("p");

                    var stringToHTML = function (str) {
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(str, 'text/html');
                            return doc.body;
                        };
                    let cellI =""; //intendedTd.children[0].rows[0].cells[0];
                    let inputTypeC = '<input type="text" class="form-control date2" placeholder="Pick A Date" style="width: inherit; height: 90%; display: block;  border-width: 2px; border-style: outset; outline: 0px;">'
                    var myWDiv = '<div>'+holderMenuStr + inputTypeC+ '</div>';
                    var td = '<td>'+myWDiv+'</td>';
                    var tr = '<tr>'+td+'</tr>';
                    var table1 = '<table>'+tr+'</table>';
                      // td.innerText = "This one replace that";
                    // targetTD.parentNode.replaceChild(targetTD, td);
                    let intendedTd = stringToHTML(table1);
                    // console.log(intendedTd.children[0].rows[0].cells[0]);
                     cellI = intendedTd.children[0].rows[0].cells[0];

                    let targetId = event.target.parentNode.parentNode.parentNode.getAttribute("id")
                    let tdI =  targetId.match(/(\d+)/)[0]
                    // console.log("Much Imported Id "+tdI);
                    // console.log(cellWidths[tdI]);
                    // fIwidth =   (cellWidths[tdI][0].match(/(\d+)/)[0] -20).toString()+"px"
                    // fIheight =   (cellWidths[tdI][1].match(/(\d+)/)[0] -20).toString()+"px"
                     fIwidth =   (cellWidths[tdI][0].match(/(\d+)/)[0]).toString()+"px";
                    fIheight =   (cellWidths[tdI][1].match(/(\d+)/)[0]).toString()+"px";
                    // console.log(fIwidth);
                    // console.log(fIheight);
                    cellI.style.width = fIwidth;
                    cellI.style.height = fIheight;

                    targetTD.replaceWith(cellI);


                    $('.date2').datepicker({
                        // format: 'DD dd MM yyyy'
                        // multidate:true,
                        format: 'dd-mm-yyyy',
                        }

                        );
                        $('.date2').click(function(){
//   $("p:first").addClass("intro");
// $(".holder-menu").css('display', 'hide');
$(".table-condensed").addClass("table-success");

// $(".table-condensed").css('border-radius', '30px');

});

    }


    //Handle SIgn Case
   function  handleSignCase(holderDIV ){
        //   console.log("event.target.tagName SIGn== 'TD'")
          let cellWidths = getTableCellWidths();
                    holderDIV.style.display = "none";
                    holderDIV.setAttribute("id", "tempIdHolderDiv");
                    targetChildren = event.target.children;
                    // console.log("targetChildren");
                    // console.log(targetChildren);
                    targetTD= event.target;

                    var stringToHTML = function (str) {
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(str, 'text/html');
                            // console.log(doc);
                            return doc.body;
                        };
                    var holder_obj = '';
                    // var genSelect = '<select class="form-select form-select-sm auth-user">';
                    var genSelect = '<select class="form-select form-select-sm auth-user" style="width:inherit; display:none;">';
                    for (var y=0 ; y< holderDIV.children.length; y++){
                        // console.log("childY");
                        // console.log(holderDIV.children[y]);
                            if(holderDIV.children[y].className === "holder-menu"){
                                // console.log("===");
                            holder_obj = holderDIV.children[y]
                            // console.log("holder_obj");
                            // console.log(holder_obj.children[0].children.length);
                            for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                    // console.log((holder_obj.children[0].children[c].options[0].value));
                                    for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){

                                        let tempOpt = holder_obj.children[0].children[c].options[k]
                                        let selected = false;
                                        let auth_user_class = false;

                                        let autVal = tempOpt.value;
                                        let autValOp = autVal
                                        autUserOptTrim = autValOp.substring(0, Math.min(4,autValOp.length));

                                        if (autVal == "null"){
                                            autValOp = "Select User";
                                        }
                                        else{
                                            autValOp =autUserOptTrim;
                                        }
                                        if(tempOpt.classList.contains("selected")){
                                              selected = true;

                                          }
                                          if(tempOpt.classList.contains("auth_user_class")){
                                              auth_user_class = true;

                                          }
                                        //  genSelect = genSelect + '<option value="' + autVal+ '">' + autValOp+ '</option>';
                                    if (selected && auth_user_class) {
                                            	// statement
                                        	genSelect = genSelect + '<option selected = "true" class = "selected auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(selected  && !auth_user_class){
                                            	// statement
                                    	genSelect = genSelect + '<option selected = "true" class = "selected" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(!selected  && auth_user_class){
                                            	// statement
                                	    genSelect = genSelect + '<option class = "auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else{
                                              genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                            }
                                            console.log("genSelect afy=ter filter");
                                        console.log(genSelect);

                                    }

                                }
                            }
                            break;
                        }

                    }
                    genSelect = genSelect+'</select>';
                    // genSelect.concat('</select>');
                     console.log("genSelect afy=ter filter2");
                                        console.log(genSelect);
                    // console.log("GENEGESLECTS");
                    // console.log(genSelect);
                    // var holderDIVString = '<div class="holderDIV" data-idd="INPUT_HOLDER" style="border: 1px dashed rgb(255, 191, 0);\
                    //  position: absolute; overflow: auto; cursor: move; width: inhert; height: inherit; "><div class="holder-menu" \
                    //   style="position: absolute; height: 30px; min-width: 150px; right: 0px; top: -32px; display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">\
                    //   <select class="form-select form-select-sm auth-user">\
                    //     <option value="{{ user }}">{{ user }}</option></select>\
                    //     <span class="closeBtn" style="text-align: center; font-size: 0.8em; margin: 5px;">\
                    //         <i class="fas fa-trash" style="color: #000;"></i></span></div>\
                    //         <textarea style="width: 100%; height: 80%; margin: 1%; font-size: 1em; border: none; resize: none; background-color: rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow: overlay;">\
                    //             </textarea></div>';

                    // var holderMenuStr = '<div class="holder-menu" style=" height: 30px display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
                    //      + genSelect+
                    //     '</div>';
                    var holderMenuStr = '<div class="holder-menu" style=" height: 30px; width:inherit; display: block; border-radius: 0%; background-color: #fff;">'
                         + genSelect+
                        '</div>';
                            // console.log("holderMenuStr");
                    // console.log(holderMenuStr);


                    var divHolder =  document.createElement("div");
                    var tempTd = document.createElement("td");
                    tempTd.setAttribute("id","tempId");
                    divHolder.setAttribute("id", "myDivholder");

                    var iElement = '<i class="fa fa-pencil"> </i>'
                    var bElement = '<button class="btn-secondary" style="width: inherit; height: 90%; display: flex; cursor: pointer; justify-content: center; align-items: center; border-width: 2px; border-style: outset; outline: 0px;">Signature...<i class="fa fa-pencil"></i></button>'
                    var aElement = '<div><div><a style="width: 100%; height: 90%; display: flex; cursor: pointer; justify-content: center; align-items: center;">'+ iElement +'</a></div></div>'
                    var myWDiv = '<div class="mySecDivHolder" style="width: 100%;">'.concat(holderMenuStr).concat(bElement).concat( '</div>');
                    // console.log("MyWDIV");
                    // console.log(myWDiv);
                    // console.log(stringToHTML(myWDiv));

                     let td = '<td>'+myWDiv+'</td>';
                    let tr = '<tr>'+td+'</tr>';
                    let table1 = '<table>'+tr+'</table>'
                    let intendedTd = stringToHTML(table1);
                    // console.log("Signature");
                    // console.log(intendedTd.children[0].rows[0].cells[0]);
                    cellI = intendedTd.children[0].rows[0].cells[0];


                    let targetId = event.target.parentNode.parentNode.parentNode.getAttribute("id")
                    let tdI =  targetId.match(/(\d+)/)[0]
                    // console.log("Much Imported Id "+tdI);
                    // console.log(cellWidths[tdI]);
                    // fIwidth =   (cellWidths[tdI][0].match(/(\d+)/)[0] -20).toString()+"px"
                    // fIheight =   (cellWidths[tdI][1].match(/(\d+)/)[0] -20).toString()+"px"
                    fIwidth =   (cellWidths[tdI][0].match(/(\d+)/)[0]).toString()+"px";
                    fIheight =   (cellWidths[tdI][1].match(/(\d+)/)[0]).toString()+"px";
                    // console.log(fIwidth);
                    // console.log(fIheight);
                    cellI.style.width = fIwidth;
                    cellI.style.height = fIheight;

                    targetTD.replaceWith(cellI);




                    // $(myWDiv).clone(true,true).appendTo(event.target);
                   document.querySelectorAll(".btn-secondary").forEach(e => e.addEventListener('dblclick', addCanEditor, false));


    }
    //Input field holder
    function getHolderDIV(measure){
        //creating holder for every input field over the page
        const holderDIV = document.createElement('div');
        // holderDIV.style.border = '1px dotted rgb(255 191 0)';
        holderDIV.style.position = 'absolute';
        holderDIV.style.overflow = 'visible';
        holderDIV.style.display = 'flex';
        holderDIV.style.cursor = 'move';
        holderDIV.className = 'holderDIV';
        holderDIV.setAttribute('id','holderId');
        holderDIV.setAttribute('data-idD', 'INPUT_HOLDER');

        holderDIV.style.width = measure.width;
        holderDIV.style.height = measure.height;
        holderDIV.style.left = measure.left;
        holderDIV.style.top = measure.top;

        holderDIV.onfocusin = focusInEvent;

        //Putting resize button on holder
        const resizerTL = getResizer('top', 'left');
        const resizerTR = getResizer('top', 'right');
        const resizerBL = getResizer('bottom', 'left');
        const resizerBR = getResizer('bottom', 'right');
        const holderMenu = getHolderMenu(measure.auth_user);
        holderMenu.style.display = 'none';

        // holderDIV.append(resizerTL);
        // holderDIV.append(resizerTR);
        // holderDIV.append(resizerBL);
        // holderDIV.append(resizerBR);
        // holderDIV.append(holderMenu);

        const isTemplate = JSON.parse(document.getElementById('template').textContent);
        const isVerify = JSON.parse(document.getElementById('verify').textContent);
        const createdBy = JSON.parse(document.getElementById('created_by').textContent);
        const currUser = JSON.parse(document.getElementById('curr_user').textContent);
        console.log(createdBy, currUser);
        console.log("currUser");
        console.log(currUser);
        console.log("measure.auth_user");
        console.log(measure.auth_user);


        if (isTemplate){
                    holderDIV.style.border = '1px dotted rgb(255 191 0)';
        //              const resizerTL = getResizer('top', 'left');
        // const resizerTR = getResizer('top', 'right');
        // const resizerBL = getResizer('bottom', 'left');
        // const resizerBR = getResizer('bottom', 'right');
         holderDIV.append(resizerTL);
        holderDIV.append(resizerTR);
        holderDIV.append(resizerBL);
        holderDIV.append(resizerBR);

            holderDIV.onmousedown = holderDIV.addEventListener('mousedown', (event) => {
                dragElementOverPage(event)
            }, false);

            holderDIV.onresize = (evntt) => {
                console.log('Holder resized')
            }
        }
        holderDIV.append(holderMenu);

        if (!isTemplate){
if(currUser == measure.auth_user ){
    console.log("They are equal");
    console.log(measure.auth_user);
    console.log(currUser);
     holderDIV.style.border ='2px solid green';
}
//// console.log("Not Template");
//  var hDiv  = document.getElementsByClassName("holderDIV");
//         //  hDiv.style.border="none";
//         //      hDiv.classList.add("ff");
//         console.log(hDiv.length);
//         let size = Object.keys(hDiv).length;
//         console.log("Yourt size");
//         console.log(size);
//         for (let item of hDiv){
//             console.log("Your div");
//         console.log(item);
//              item.style.border="none";
//              item.classList.add("ff");
//         }

        }

        return holderDIV
    }

    //const pdfFile = document.getElementById('pdf-file');
    const pdfFilePages = document.getElementsByClassName('pdf-file');
    const pdf_table = document.querySelectorAll(".pdf-file TD");


    for(page of pdfFilePages){
        page.onclick = (event) => {
            if(event.target.className === 'pdf-file'){
                const fileFields = event.target.getElementsByClassName('holderDIV');

                for ( let elem of fileFields ){
                    deFocusElement(elem)
                }

            }
        };
    }


    document.addEventListener('dragover', (event)=> {

        if(!event.target.matches('.pdf-file, TD')) return;

        event.preventDefault();
        if (event.target.className === 'pdf-file'){
            event.target.style.border = '1px dashed green';

        }
    });


    document.addEventListener('drop', (event)=> {
        if(!event.target.matches('.pdf-file, TD')) return;
        event.preventDefault();
        if (event.target.className === 'pdf-file'){
            event.target.style.border = '0px dashed green'
                    //         $('.holderDIV').css({'position': 'static'});
                    // $('.holder-menu').css({'position': 'static'});
        }

        const typeOfOperation = event.dataTransfer.getData("text/plain");
        const curr_user = document.getElementById('current-user');

        const measure = {
            width: '300px',
            height: '50px',
            left: event.offsetX + 'px',
            top: event.offsetY + 'px',
            auth_user: curr_user.innerHTML
        }

        const holderDIV = getHolderDIV(measure);

        let inputField = document.createElement('div') ;
        inputField.setAttribute('draggable', false);
        let editButtonField = undefined;
        let portlet_class = document.getElementsByClassName("portlet");


        // user_portlet_select

        switch ( typeOfOperation ) {
            case 'EDIT_P':
                console.log('edit_p');
                $('.portlet').css('display', 'none');

                inputField = getParaField();
                if (event.target.tagName == 'TD'){
                 handleTextEditPara (holderDIV, inputField, 'EDIT_P' );
                }
                break;

            case 'TEXT_BUTTON':
                $('.portlet').css('display', 'block');
                inputField = getTextField();

                if (event.target.tagName == 'TD'){
                    handleTextEditPara(holderDIV, inputField, 'TEXT_BUTTON' );

                }
                break;

            case 'IMG_BUTTON':
                $('.portlet').css('display', 'block');
                inputField = getImageField();
                holderDIV.style.height = '150px';
                break;

            case 'DATE':
                $('.portlet').css('display', 'block');
                holderDIV.style.width = '200px';
                holderDIV.style.height = '95px';
                console.log("isTemplate in case");
                console.log(isTemplate);
                inputField = getDateField2("default","default");

//                  if (!isTemplate) {
//                      console.log("!isTemplate  get in case");
//                     inputField = getDateField2("default",'dd-mm-yy');
//                     console.log("$('.date') after call");
//                     console.log($('.date'));
// //
//                 }if(isTemplate){
//                     console.log("isTemplate get in case");
//                     inputField = getDateField2("default","default");
//                 }
                 if (event.target.tagName == 'TD'){
                         handleDateCase(holderDIV);

                    }
                getDate('dd-mm-yyyy');
                break;

            case 'SIGN':
                $('.portlet').css('display', 'block');
                holderDIV.style.width = '200px';
                holderDIV.style.height = '100px';
                inputField = getSignField();
                // myResizer
                 if (event.target.tagName == 'TD'){
                     handleSignCase(holderDIV, inputField);

                }
                break;


            case 'TABLE':
                $('.portlet').css('display', 'block');
                holderDIV.classList.add("tableInput");
                inputField =  handleTableCase();

                break;

            case 'DROPDOWN':
                $('.portlet').css('display', 'block');
                holderDIV.classList.add("dropDown");
                var dropDownElements = document.querySelectorAll('.dropDownDiv');
                var needed_length = dropDownElements.length
                for (i = 0; i <needed_length ; i++) {
                    console.log("dropDownElements[i] count ".concat(i));
                    console.log("dropDownElements[i] before change ".concat(dropDownElements[i].getAttribute("id")));
                    console.log("dropDownElements[i].parent before change".concat(dropDownElements[i].children[0].getAttribute("id")));
                    dropDownElements[i].removeAttribute("id");
                    dropDownElements[i].setAttribute("id", "dropDownDiv".concat((i+1).toString()))
                    dropDownElements[i].children[0].removeAttribute("id");
                    dropDownElements[i].children[0].setAttribute("id", (i+1).toString())
                    console.log("dropDownElements[i] atfter change".concat(dropDownElements[i].getAttribute("id")));
                    console.log("dropDownElements[i].parent after change ".concat(dropDownElements[i].children[0].getAttribute("id")));

                }

                inputField = getDropDownField(needed_length+1);
                editButtonField = getEditBtn();
                break;

        }


        holderDIV.append(inputField);
        if (editButtonField != undefined){
            // holderDIV.classList.add("clearfix");
            holderDIV.append(editButtonField);
        }
        getDate('dd-mm-yyyy');
        event.target.append(holderDIV);
        inputField.focus();

    });
///////Put in Grid

// function sortable_grid(section, onUpdate){
// var dragEl, nextEl, newPos, dragGhost;
// console.log("section");
// console.log(section);
// // holderDIV
// let oldPos = [...section.children].map(item => {
//     let pos = document.getElementById(item.id).getBoundingClientRect();
//     //  let gridDiv = $('<div class = "customPositioner"></div>');
//      let gridDiv = document.createElement('div');
//      gridDiv.className = 'customPositioner';
//      gridDiv.setAttribute('id','customPositionerId') ;
//     //  gridDiv.style.position = 'static';
//     gridDiv.style.overflow = 'visible';

//     //  gridDIV.top = pos.top;
//     //  gridDIV.left = pos.left;
//     // gridDIV.right = pos.right;
//     // gridDIV.bottom = pos.bottom;
//     // if(item.classList.contains('holderDIV') && item.parentElement.classList.contains('customPositioner');) {
//     //     gridDiv.append(item);
//     // }
//     if(item.classList.contains('customPositioner')){
//         console.log("DOnt append");
//         ch = item.children
//         // if (ch.length = 0){
//         //     item.remove();
//         // }
//         console.log(ch.length)
//         item.draggable = true;

//         //



//     }
//     else{

//          item.style.zIndex = "-1";
//          item.style.position = 'static';
//         item.draggable = false;
//         gridDiv.append(item);
//     }
// //   item.draggable = false

// //   item.remove();


//   section.append(gridDiv)

//   return pos;
// });

// console.log("oldPos");
// console.log(oldPos);
// const divs = document.querySelectorAll('.customPositioner');
// let counter = 0;
// divs.forEach(div => {
//     counter = counter+1;
//   if (divs.innerHTML === '' || div.textContent === '') {
//     div.remove();
//   }
//   div.draggable = true;
//   div.removeAttribute("id");
//   div.setAttribute("id", "customPositionerId".concat((counter).toString()));
// //   div.setAttribute('id','customPositionerId') ;
// });
// function _onDragOver(e){
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';

//     var target = e.target;
//     // if( target && target !== dragEl && target.nodeName == 'DIV' ){
//         if( target && target !== dragEl && target.hasClass('customPositioner') ){
// console.log("Hass class customPositioner ");
//     //   if(target.classList.contains('inside')) {
//       if(target.classList.contains('holderDIV')) {
//         console.log("Contains Holder div");
//         e.stopPropagation();
//       } else {
//   //getBoundinClientRect contains location-info about the element (relative to the viewport)
//       var targetPos = target.getBoundingClientRect();
//       //checking that dragEl is dragged over half the target y-axis or x-axis. (therefor the .5)
//       var next = (e.clientY - targetPos.top) / (targetPos.bottom - targetPos.top) > .5 || (e.clientX - targetPos.left) / (targetPos.right - targetPos.left) > .5;
//         section.insertBefore(dragEl, next && target.nextSibling || target);

//         /*  console.log("oldPos:" + JSON.stringify(oldPos));
//          console.log("newPos:" + JSON.stringify(newPos)); */
//          /* console.log(newPos.top === oldPos.top ? 'They are the same' : 'Not the same'); */
//       console.log(oldPos);
//         }
//     }
// }

// function _onDragEnd(evt){
//     evt.preventDefault();
//     newPos = [...section.children].map(child => {
//          let pos = document.getElementById(child.id).getBoundingClientRect();
//          return pos;
//       });
//     console.log(newPos);
//     dragEl.classList.remove('ghost');
//     section.removeEventListener('dragover', _onDragOver, false);
//     section.removeEventListener('dragend', _onDragEnd, false);

//     nextEl !== dragEl.nextSibling ? onUpdate(dragEl) : false;
// }

//   section.addEventListener('dragstart', function(e){
//       console.log("Sortable drag start");
//     dragEl = e.target;
//     nextEl = dragEl.nextSibling;
//     /* dragGhost = dragEl.cloneNode(true);
//     dragGhost.classList.add('hidden-drag-ghost'); */

//   /*  document.body.appendChild(dragGhost);
//     e.dataTransfer.setDragImage(dragGhost, 0, 0); */

//     e.dataTransfer.effectAllowed = 'move';
//     e.dataTransfer.setData('Text', dragEl.textContent);

//     section.addEventListener('dragover', _onDragOver, false);
//     section.addEventListener('dragend', _onDragEnd, false);

//     setTimeout(function (){
//         dragEl.classList.add('ghost');
//     }, 0)

// });
// }




document.addEventListener('dragend', (event)=> {
    console.log("Dragg end first round");
    // console.log( dragged );
//     let oldPos = [...section.children].map(item => {
//   item.draggable = true
//   let pos = document.getElementById(item.id).getBoundingClientRect();
//   return pos;
// });
// document.getElementById('pdf-file').children.map(item => {
    // .setAttribute("draggable", false)
//   item.draggable = false;
//   let pos = document.getElementById(item.id).getBoundingClientRect();
//   return pos;
// });
    // var gridDiv = $('<div class = "customPositioner"></div>');
    // $( ".holderDIV" ).setAttribute("draggable", false);

    // gridDiv.append('.holderDIV');
    // $( '#pdf-file' ).append(gridDiv);
    //Ptu in a new class
    //make class
//         $('.customPositioner').css({'position': 'static'});
//         $('.holderDIV').css({'position': 'static'});
// $('.holder-menu').css({'position': 'relative'});
// $( ".holderDIV" ).children().css( "position", "relative" );
// console.log("PDF FILE");
// console.log(event.target);
// event.preventDefault();

// sortable_grid( document.getElementById('pdf-file'), function (item){
// /* console.log(item); */
// });
getDate('dd-mm-yyyy');
});
///Put in grid

//Save Drop Down Data


function savingDropdownData(page){
    const drops_add = page.getElementsByClassName("dropDownDiv");
    let drops_tags =  [];
    let drops_collected = [];
    if(drops_add.length){
            for(add of drops_add){
                var new_drop = add.getElementsByTagName("SELECT")[0];
                console.log("New DropDwon");
                console.log(new_drop);
                drops_tags.push(new_drop);
                console.log("drops_tags");
                console.log(drops_tags);
            }
        }
    if (drops_tags.length){
    for(drop of drops_tags){
                authUserr = drop.parentNode.parentNode.getElementsByClassName("auth-user")[0].value
                console.log("authUserr");
                console.log(authUserr);
                elem = {
                    width: drop.parentNode.parentNode.style.width,
                    height: drop.parentNode.parentNode.style.height,
                    top: drop.parentNode.parentNode.style.top,
                    left: drop.parentNode.parentNode.style.left,
                    dropId: drop.getAttribute("id"),
                    type:'DROPDOWN_INPUT',
                    data: [],
                    auth_user: authUserr
                }
                console.log("Drop Detail");
                console.log(drop);
                console.log(drop.children.length);
                console.log(drop.children);
                console.log(drop.children[0]);
                console.log("End of Drop Detail");
                for(option of drop.children){
                    elem.data.push(option.value)
                }
            drops_collected.push(elem);


    }
}
console.log("Drop Collected");
console.log(drops_collected);
// return "Working Progress"
return drops_collected;
}
//Save Tables Data
    function savingTableData(pages){
        console.log("Saving Table Data");
        const tables_add = pages.getElementsByClassName("tableDiv");
        let tables_tags =  [];
        if(tables_add.length){
            for(add of tables_add){
                var new_table = add.getElementsByTagName("table")[0];
                console.log("New Table");
                console.log(new_table);
                tables_tags.push(new_table);
                console.log("table_tags");
                console.log(tables_tags);
            }
        }

        tables_collected = [];
        let count = 0;
        if (tables_tags.length){

            for(table of tables_tags){
                count = count +1;
                authUserr = table.parentNode.parentNode.getElementsByClassName("auth-user")[0].value
                console.log("authUserr");
                console.log(authUserr);
                console.log("=================================Table number ========================================");
                console.log(count);
                elem = {
                    width: table.parentNode.parentNode.style.width,
                    height: table.parentNode.parentNode.style.height,
                    top: table.parentNode.parentNode.style.top,
                    left: table.parentNode.parentNode.style.left,
                    tableId: table.getAttribute("id"),
                    type:'TABLE_INPUT',
                    data: {},
                    auth_user: authUserr
                }
                 //get row length
                row_length = table.rows.length;
                console.log("row_lkength");
                console.log(row_length);
                //get column length

                column_length = table.rows[0].cells.length;
                console.log("column_length");
                console.log(column_length);
                // for every td
                console.log("table.rows[1].cells");
                console.log(table.rows[1].cells[0]);
                // console.log(window.getComputedStyle(table.rows[0].cells[0], null).getPropertyValue("width"))

                                    for(var t = 0; t<row_length; t++ ){
                    for(var g = 0; g<column_length; g++){
                        var idx = "row".concat(t.toString()).concat("column").concat(g.toString());
                        var tempElement  = {}
                        console.log("g = "+g);
                        console.log("t = "+t);
                        let cel = table.rows[t].cells[g]
                            // if (!cel) let cel ;
                            console.log("typeof of cell");
                            console.log(typeof cel);
                            console.log(cel);
                        console.log("Lenf = " +  window.getComputedStyle(cel, null).getPropertyValue("width"))
                        tempElement["cellWidth"] = window.getComputedStyle(table.rows[t].cells[g], null).getPropertyValue("width");
                        tempElement["cellHeight"] = window.getComputedStyle(table.rows[t].cells[g], null).getPropertyValue("height");
                        console.log("tempElement['cellWidth']");
                        console.log(tempElement["cellWidth"]);
                        console.log(table.rows[t].cells[g].style.width);
                        console.log("tempElement['cellHeight']");
                        console.log(tempElement["cellHeight"]);
                        console.log(table.rows[t].cells[g].style.height);
                        console.log("Text Area table.rows[t].cells[g].children[0].children[0]")
                        console.log(table.rows[t].cells[g].children[0]);
                        console.log("Text Area table.rows[t].cells[g]===============================")
                        console.log(table.rows[t].cells[g]);
                        //SIGNATURE
                        if (table.rows[t].cells[g].children.length){
                        if (table.rows[t].cells[g].children[0].className == "mySecDivHolder"){
                            console.log("mySecDiv Holder");


                             if(table.rows[t].cells[g].children[0].children[0].children.length){
                        txtElementLength = table.rows[t].cells[g].children[0].children[0].children.length
                        console.log("table.rows[t].cells[g].children[0].children[0].children[b].length");
                            console.log(table.rows[t].cells[g].children[0].children[0].children.length);
                        for(var b = 0; b <txtElementLength; b++){

                            if(table.rows[t].cells[g].children[0].children[0].children[b].tagName == "SELECT"){
                                // var miniauthUser = table.rows[t].cells[g].children[0].children[0].children[b].value
                                let miniauthUserEl = table.rows[t].cells[g].children[0].children[0].children[b];
                                let optL =miniauthUserEl.options.length;
                                    for(let t=0; t<optL; t++){
                                        if (miniauthUserEl[t].classList.contains('selected')){
                                            tempElement["auth_user"]=miniauthUserEl[t].value
                                            break;
                                        }
                                    }
                                // tempElement["auth_user"]= miniauthUser;

                                console.log("tempElement[auth_user]r");
                                console.log(tempElement["auth_user"]);
                            }

                        }

                        }
                          if(table.rows[t].cells[g].children[0].children[1].tagName == "IMG"){
                                // var textInput = table.rows[t].cells[g].children[0].children[0].children[b].value
                                console.log("IMAGE")

                                 const img2 = table.rows[t].cells[g].children[0].children[1];
                                 console.log(img2.src)

                            console.log("elem22");
                                console.log(img2.src);
                                tempElement["data"]= img2.src;
                                tempElement["type"]= "SIGN";
                             console.log("TEMP ELEMENT");
                            console.log(tempElement);
                            elem.data[idx]=tempElement;


                        }
                        if(table.rows[t].cells[g].children[0].children[1].tagName =="BUTTON"){
                            console.log("BUTTON SECNDARYS");
                            tempElement["data"]= "NOT_SIGNED";
                            tempElement["type"]= "SIGN";
                            elem.data[idx]=tempElement;
                        }

                        }
                        else{
                        //Text Area
                        if(table.rows[t].cells[g].children[0].children[0].children.length){
                        txtElementLength = table.rows[t].cells[g].children[0].children[0].children.length
                        console.log("table.rows[t].cells[g].children[0].children[0].children[b].length");
                            console.log(table.rows[t].cells[g].children[0].children[0].children.length);
                        if (txtElementLength > 1){
                            console.log("txtElementLength > 1");
                                console.log(txtElementLength);
                        for(var b = 0; b <txtElementLength; b++){
                                console.log("table.rows[t].cells[g].children[0].children[0].children[b]");
                                console.log(table.rows[t].cells[g].children[0].children[0].children[b]);
                            if(table.rows[t].cells[g].children[0].children[0].children[b].tagName == "SELECT"){
                                // var miniauthUser = table.rows[t].cells[g].children[0].children[0].children[b].value
                                    let miniauthUserEl = table.rows[t].cells[g].children[0].children[0].children[b];
                                let optL =miniauthUserEl.options.length;
                                    for(let t=0; t<optL; t++){
                                        if (miniauthUserEl[t].classList.contains('selected')){
                                            tempElement["auth_user"]=miniauthUserEl[t].value
                                            break;
                                        }
                                    }
                                // tempElement["auth_user"]= miniauthUser;

                                console.log("tempElement[auth_user]r");
                                console.log(tempElement["auth_user"]);
                                // tempElement["auth_user"]= miniauthUser;

                                // console.log("miniauthUser");
                                // console.log(miniauthUser);
                            }
                            if(table.rows[t].cells[g].children[0].children[0].children[b].tagName == "TEXTAREA"){
                                var textInput = table.rows[t].cells[g].children[0].children[0].children[b].value
                                console.log("textInput");
                                console.log(textInput);
                                tempElement["data"]= textInput;
                                tempElement["type"]= "TEXT_INPUT_T";

                            }
                            if(table.rows[t].cells[g].children[0].children[0].children[b].classList.contains('date2')){
                                var dateInput = table.rows[t].cells[g].children[0].children[0].children[b].value
                                console.log("dateInput");
                                console.log(dateInput);
                                tempElement["data"]= dateInput;
                                tempElement["type"]= "DATE_INPUT";

                            }
                            // if(table.rows[t].cells[g].children[0].children[0].children[b].tagName == "IMG"){
                            //     // let textInput = table.rows[t].cells[g].children[0].children[0].children[b].value
                            //     // const img = child.getElementsByTagName("img");

                            //     console.log("img Data");
                            //     console.log(elem22.data);
                            //     tempElement["data"]= elem22;
                            //     tempElement["type"]= "SIGN";

                            // }
            // }

                        }

                        }
                        else{
                             console.log("txtElementLength == 1");
                                console.log(txtElementLength);
                             if(table.rows[t].cells[g].children[0].children[0].children[0].tagName == "SELECT"){
                                // var miniauthUser = table.rows[t].cells[g].children[0].children[0].children[0].value
                                 let miniauthUserEl = table.rows[t].cells[g].children[0].children[0].children[b];
                                let optL =miniauthUserEl.options.length;
                                    for(let t=0; t<optL; t++){
                                        if (miniauthUserEl[t].classList.contains('selected')){
                                            tempElement["auth_user"]=miniauthUserEl[t].value
                                            break;
                                        }
                                    }
                                // tempElement["auth_user"]= miniauthUser;

                                console.log("tempElement[auth_user]r");
                                console.log(tempElement["auth_user"]);
                                tempElement["auth_user"]= miniauthUser;

                                // console.log("miniauthUser");
                                // console.log(miniauthUser);
                            }

                             if(table.rows[t].cells[g].children[0].children[1].tagName == "TEXTAREA"){
                                var textInput = table.rows[t].cells[g].children[0].children[1].value
                                console.log("textInput");
                                console.log(textInput);
                                tempElement["data"]= textInput;
                                tempElement["type"]= "TEXT_INPUT_T";

                            }

                            if(table.rows[t].cells[g].children[0].children[1].classList.contains('date2')){
                                var dateInput = table.rows[t].cells[g].children[0].children[1].value
                                console.log("dateInput");
                                console.log(dateInput);
                                tempElement["data"]= dateInput;
                                tempElement["type"]= "DATE_INPUT";

                            }

                        }

                        // }
                        console.log("JUST BEFORE EDITABLE TEXT");
                        console.log(table.rows[t].cells[g].children.length);
                        console.log("console.log(table.rows[t].cells[g].children);")
                        console.log(table.rows[t].cells[g].children);
                        //EDITABLE TEXT
                        if (table.rows[t].cells[g].children.length > 1){
                            console.log("EDITABLE TEXT");
                            if (table.rows[t].cells[g].children[1].getAttribute("id") == "textBox"){
                                console.log("EDITAVLE B ABOUT TO BE JSAON");
                                console.log(table.rows[t].cells[g].children[1].innerHTML);
                                let editablePInput = table.rows[t].cells[g].children[1].innerHTML
                                tempElement["data"]= editablePInput;
                                tempElement["type"]= "EDITABLE_P";
                            }

                        }



                            console.log("TEMP ELEMENT");
                            console.log(tempElement);
                            elem.data[idx]=tempElement;
                        }

                    }
                    }else{
                        console.log("Table is empty");
                        tempElement["data"]= "BLANK";
                        tempElement["type"]= "BLANK_CELL";
                        tempElement["auth_user"]= "";
                         elem.data[idx]=tempElement;
                    }

                        // console.log("table td children[0] children length");
                        // console.log(table.rows[t].cells[g].children[0].children[0].children.length);
                        // console.log("table td children children[0].children[0].children");
                        // console.log(table.rows[t].cells[g].children[0].children[0].children);
                        // table.rows[t].cells[g].children[0].children[0].children.length

                    }


                }
                tables_collected.push(elem)
console.log("================================= End of Table number ========================================");
                console.log(count);
                }

            }
                console.log("Main Tables==========");
                console.log(tables_collected);

                //   return "elem";
                return tables_collected;
        }




    function saveDocument(){

        //  const pdfFile = document.getElementById('pdf-file');

        const pdfFile = document.getElementsByClassName('docedit-page');
        contentFile = [];
        for( pages of pdfFile ){
            const elementTables = savingTableData(pages);
            const elementDropdowns = savingDropdownData(pages);

            const status = 'REQUEST_IN_PROGRESS';

            page = [];
            //console.log("PDF FILE CHildren");
            //console.log( pdfFile.children);
            console.log("PageChildrens", pages.children);


            for (child of pages.children){
            //for( child of pdfFile.children ){

                const sel = child.getElementsByClassName('auth-user');
                // const sel = child.getElemenstClassName("")
                const authUser = sel[0].value;
                let elem = {}


                const txt = child.getElementsByTagName("textarea");
                if( txt.length ){
                    if(txt[0].parentElement.classList.contains("holderDIV")){
                       console.log(txt[0].value);
                    console.log("txtLength saving textinglength");
                    console.log(txt[0]);
                    console.log(txt[0].parentElement);
                    elem = {
                        width: child.style.width,
                        height: child.style.height,
                        top: child.style.top,
                        left: child.style.left,
                        type:'TEXT_INPUT',
                        data: txt[0].value,
                        auth_user: authUser
                    }
                    }

                }


                const img_input = child.getElementsByTagName("input");
                if( img_input.length ){
                    console.log('Image_input', img_input[0])
                    if (img_input[0].type === 'file') {
                        elem = {
                            width: child.style.width,
                            height: child.style.height,
                            top: child.style.top,
                            left: child.style.left,
                            type:'IMAGE_INPUT',
                            data: img_input[0].value,
                            auth_user: authUser
                        }
                    }
                }



                const editP = child.getElementsByClassName("editPara");
                console.log("EditP");
                console.log(editP)
                if( editP.length ){
                    console.log("Save EditP");
                    console.log(editP[0].innerHTML);
                    elem = {
                        width: child.style.width,
                        height: child.style.height,
                        top: child.style.top,
                        left: child.style.left,
                        type:'EDIT_P',
                        data: editP[0].innerHTML,
                        auth_user: authUser
                    }
                }
                if(child.getElementsByTagName("TABLE").length <1){
                    const img = child.getElementsByTagName("img");
                    if( img.length ){
                        const canvas = document.createElement('canvas');
                        canvas.setAttribute('width', child.style.width);
                        canvas.setAttribute('height', child.style.height);
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img[0], 0, 0, parseInt(child.style.width.slice(0, -2)), parseInt(child.style.height.slice(0, -2)));
                        elem = {
                            width: child.style.width,
                            height: child.style.height,
                            top: child.style.top,
                            left: child.style.left,
                            type:'IMG_INPUT',
                            data: canvas.toDataURL(),
                            auth_user: authUser
                        }
                    }
                }

                // const date = child.querySelectorAll('.date'),
                const date = child.getElementsByClassName("date");
                console.log("Date Saving");
                if( date.length ){
                    console.log("Date Length Greater than 0");
                    console.log(date[0].value);

                    elem = {
                        width: child.style.width,
                        height: child.style.height,
                        top: child.style.top,
                        left: child.style.left,
                        type:'DATE_INPUT',
                        data: date[0].value,
                        auth_user: authUser
                    }
                }
                if(child.getElementsByTagName("TABLE").length <1){
                        const button = child.getElementsByTagName("button");
                        if( button.length ){
                            if(button[0].classList.contains("signature-btn")){
                                elem = {
                                    width: child.style.width,
                                    height: child.style.height,
                                    top: child.style.top,
                                    left: child.style.left,
                                    type:'SIGN_INPUT',
                                    data: '',
                                    auth_user: authUser
                                }
                            }

                        }
                    }
                page.push(elem);
            }


            if(elementTables.length){
                for(let h= 0; h< elementTables.length; h++){
                    page.push(elementTables[h]);
                }
            }
            if(elementDropdowns.length){
                for(let h= 0; h< elementDropdowns.length; h++){
                    page.push(elementDropdowns[h]);
                }
            }
            contentFile.push(page)
        }

        console.log("ContentFile While saveDoc", contentFile);
        return contentFile;
    }
//Get rows and columns of table

   function get_rows_cols(data){
finalResult = []
// console.log(Object.keys(data));
var myKeys=Object.keys(data);
var rowsArray = [];
var colsArray = [];
for (let key of myKeys){
colIndex = key.search("column")
sliced = key.slice(colIndex);
rowsArray.push( key.match(/(\d+)/)[0]);
// console.log("rows");
// console.log(key.match(/(\d+)/)[0]);
// console.log(rowsArray);
// console.log(sliced);
colsArray.push(sliced.match(/(\d+)/)[0]);
// console.log(sliced.match(/(\d+)/)[0]);
// console.log(colsArray);


}
let sR = new Set(rowsArray);
let itR = sR.values();
newRows = Array.from(itR);
let sC = new Set(colsArray);
let itC = sC.values();
newCols = Array.from(itC);
finalResult.push(newRows.length);
// console.log("Number of rows = ".concat(newRows.length.toString()))
// console.log("Number of columns = ".concat(newCols.length.toString()))
finalResult.push(newCols.length);
return finalResult



}
    //Rendering the table
           function reRenderTableField(currentUser,id, data, holderDIV){
               console.log("Rendering Table");
reqId = id.match(/(\d+)/)[0];
console.log("getTable id = ".concat(id.toString()));
  let tableDiv = document.createElement("address");
  tableDiv.setAttribute("id", "tableDiv".concat(reqId.toString()));
  tableDiv.setAttribute("class", "tableDiv");
  tableDiv.style.width = "100%";
  tableDiv.style.height = "100%";
  tableDiv.style.top = "inherit";
  tableDiv.style.left = "inherit";
  // tableDiv.style.position = "absolute";
  // tableDiv.style.cursor = 'inherit';
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
//   let row_1 = document.createElement('tr');
  table.setAttribute("class", "form-table");
//   table.classList.add( "form-table-sm","float-right","table" ,"table-borded",  "table-striped", "table-list");
  table.classList.add( "form-table-sm","float-right","table" ,"table-borded", "table-list");

  //add classes
//   table.setAttribute("id", "t".concat(id.toString()));
  table.setAttribute("id", id);

table.style.height = "100%";
//   table.style.width = "70%";
table.style.width = "100%";
  table.style.top = "inherit";
  table.style.left = "inherit";
// table.style.overflow = "hidden";
  table.zIndex = "7";


    function reSignature(data){
        let autUser= data.auth_user;
        let autUserOpt = autUser;
        console.log("autUserOpt b");
        console.log(autUserOpt);
        autUserOptTrim = autUserOpt.substring(0, Math.min(4,autUserOpt.length));

        if (autUser == "null"){
            autUserOpt = "Select User";
        }
        else{
            autUserOpt =autUserOptTrim;
        }
        console.log("autUserOpt b");
        console.log(autUserOpt);
        let extracted = data.data;
        let genSelect = '<select class="form-select form-select-sm auth-user" style="width:inherit; display: none;">';

            for (var y=0 ; y< holderDIV.children.length; y++){
                        // console.log("childY");
                        // console.log(holderDIV.children[y]);
                            if(holderDIV.children[y].className === "holder-menu"){
                                // console.log("===");
                            holder_obj = holderDIV.children[y]
                            // console.log("holder_obj.children[0].children[c].options[1].value)");
                            // console.log(holder_obj.children[0].children[0].options[1].value);
                            for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                    // console.log((holder_obj.children[0].children[c].options[0].value));
                                    for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){
                                        //  genSelect.concat('<option value="'.concat(holder_obj.children[0].children[c].options[k].value).concat('">').concat(holder_obj.children[0].children[c].options[k].value).concat('</option>'));
                                          let tempOpt = holder_obj.children[0].children[c].options[k]
                                          let selected = false;
                                          let auth_user_class = false;

                                          let autVal = tempOpt.value ;

                                        let autValOp = autVal
                                        autUserOptTrim = autValOp.substring(0, Math.min(4,autValOp.length));

                                        if (autVal == "null"){
                                            autValOp = "Select User";
                                        }
                                        else{
                                            autValOp =autUserOptTrim;
                                        }
                                         if(autVal == autUser){
                                              selected = true;
                                              auth_user_class = true;

                                          }
                                        //  genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                        if (selected && auth_user_class) {
                                            	// statement
                                        	genSelect = genSelect + '<option selected = "true" class = "selected auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(selected  && !auth_user_class){
                                            	// statement
                                    	genSelect = genSelect + '<option selected = "true" class = "selected" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(!selected  && auth_user_class){
                                            	// statement
                                	genSelect = genSelect + '<option class = "auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else{
                                              genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                            }
                                        // console.log(genSelect);

                                    }

                                }
                            }
                            break;
                        }

                    }



        genSelect.concat('</select>');





    // genSelect = genSelect + '<option value="' + autUser + '">' + autUserOpt + '</option> </select>';






    let holderMenuStr = '<div class="holder-menu" style=" height: 30px; width:inherit; display: block; border-radius: 0%; background-color:#fff;">'
                         + genSelect+
                        '</div>';
    let stringToHTML = function (str) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};
let reImage = "";
if (extracted == "NOT_SIGNED"){
 reImage = getSignField();
 reImage.style.width = "inherit";
 reImage.style.height = "90%";
 if (!isTemplate) {
 if (currentUser != autUser){
     reImage.setAttribute("disabled", true);
 }

 }

}else{
    reImage = renderImageField();
    reImage.src = extracted;
    reImage.style.width = "40%";
    reImage.style.height = "40%";
    reImage.style.cursor = "pointer";
    reImage.style.outline = "0px";
    reImage.setAttribute("data-img", "isign");
    reImage.setAttribute("tabindex", "0");
    reImage.setAttribute("draggable", false);
}
    // width: 40%; height: 40%; cursor: pointer; outline: 0px;
    // var myWDiv = '<div class="mySecDivHolder" style="width: 100%;">'.concat(holderMenuStr).concat(bElement).concat( '</div>');
    var myWDiv = '<div class="mySecDivHolder" style="width: 100%;">'.concat(holderMenuStr).concat( '</div>');

                    // console.log("MyWDIV");
                    // console.log(myWDiv);
                    // console.log(stringToHTML(myWDiv));

                     let td = '<td>'+myWDiv+'</td>';
                    let tr = '<tr>'+td+'</tr>';
                    let table1 = '<table>'+tr+'</table>'
                    let intendedTd = stringToHTML(table1);
                    cellI = intendedTd.children[0].rows[0].cells[0];
                    cellI.style.width = data.cellWidth;
                    cellI.style.height = data.cellHeight;
                    cellI.children[0].append(reImage);
cellI.addEventListener('click',(event)=>{
    focusInEvent(event);
});
                    return cellI

    }


    function reParaField(data){
        let autUser= data.auth_user;
        let autUserOpt = autUser;
        console.log("autUserOpt b");
        console.log(autUserOpt);
        autUserOptTrim = autUserOpt.substring(0, Math.min(4,autUserOpt.length));

        if (autUser == "null"){
            autUserOpt = "Select User";
        }
        else{
            autUserOpt =autUserOptTrim;
        }
        let extracted = data.data;
        let genSelect = '<select class="form-select form-select-sm auth-user" style="display: none;">';


            for (var y=0 ; y< holderDIV.children.length; y++){
                        // console.log("childY");
                        // console.log(holderDIV.children[y]);
                            if(holderDIV.children[y].className === "holder-menu"){
                                // console.log("===");
                            holder_obj = holderDIV.children[y]
                            // console.log("holder_obj.children[0].children[c].options[1].value)");
                            // console.log(holder_obj.children[0].children[0].options[1].value);
                            for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                    // console.log((holder_obj.children[0].children[c].options[0].value));
                                    for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){
                                        //  genSelect.concat('<option value="'.concat(holder_obj.children[0].children[c].options[k].value).concat('">').concat(holder_obj.children[0].children[c].options[k].value).concat('</option>'));
                                          let tempOpt = holder_obj.children[0].children[c].options[k]
                                          let selected = false;
                                          let auth_user_class = false;

                                          let autVal = tempOpt.value ;

                                        let autValOp = autVal
                                        autUserOptTrim = autValOp.substring(0, Math.min(4,autValOp.length));

                                        if (autVal == "null"){
                                            autValOp = "Select User";
                                        }
                                        else{
                                            autValOp =autUserOptTrim;
                                        }
                                         if(autVal == autUser){
                                              selected = true;
                                              auth_user_class = true;

                                          }
                                        //  genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                        if (selected && auth_user_class) {
                                            	// statement
                                        	genSelect = genSelect + '<option selected = "true" class = "selected auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(selected  && !auth_user_class){
                                            	// statement
                                    	genSelect = genSelect + '<option selected = "true" class = "selected" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(!selected  && auth_user_class){
                                            	// statement
                                	genSelect = genSelect + '<option class = "auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else{
                                              genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                            }
                                        // console.log(genSelect);

                                    }

                                }
                            }
                            break;
                        }

                    }



        genSelect.concat('</select>');


    // genSelect = genSelect + '<option value="' + autUser + '">' + autUserOpt + '</option> </select>';
    let holderMenuStr = '<div class="holder-menu" style=" height: 30px display: block; border-radius: 0%; background-color: #fff;">'
                         + genSelect+
                        '</div>';
    let stringToHTML = function (str) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

let myWDiv = '<div style= width:inherit;>'+holderMenuStr + '</div>';

let td = '<td>'+myWDiv+'</td>';
let tr = '<tr>'+td+'</tr>';
let table1 = '<table>'+tr+'</table>';
let testDiv = document.createElement("div");
testDiv.setAttribute("id", "textBox");
 if (currentUser != autUser){
    //  reImage.setAttribute("disabled", true);
     testDiv.setAttribute("contenteditable", false);
 }else{
     testDiv.setAttribute("contenteditable", true);
      testDiv.onclick = ()=>{
    // toogleTxtForm();
    toogleTxtFormBlock();
}
 }


myP = stringToHTML(extracted).children[0];
testDiv.append(myP);
let intendedTd = stringToHTML(table1);
let cellI = intendedTd.children[0].rows[0].cells[0];
console.log("data.cellWidth");
console.log(data.cellWidth);
console.log("data.cellHeight");
console.log(data.cellHeight);
cellI.style.width = data.cellWidth;
cellI.style.height = data.cellHeight;
cellI.addEventListener('click',(event)=>{
    focusInEvent(event);
});
cellI.appendChild(testDiv);

    return cellI;

    }
    function reTextField(data){

        let autUser= data.auth_user;
        let autUserOpt = autUser;
        console.log(autUser);
        console.log(data.auth_user);
        console.log("autUserOpt b");
        console.log(autUserOpt);
        console.log(autUserOpt.substring(0, Math.min(4,autUserOpt.length)));
        autUserOptTrim = autUserOpt.substring(0, Math.min(4,autUserOpt.length));

        if (autUser == "null"){
            autUserOpt = "Select User";
        }
        else{
            autUserOpt =autUserOptTrim;
        }
        console.log("autUserOpt a");
        console.log(autUserOpt);
        let extracted = data.data;
        let genSelect = '<select class="form-select form-select-sm auth-user" style="display: none;">';


        for (var y=0 ; y< holderDIV.children.length; y++){
                        // console.log("childY");
                        // console.log(holderDIV.children[y]);
                            if(holderDIV.children[y].className === "holder-menu"){
                                // console.log("===");
                            holder_obj = holderDIV.children[y]
                            // console.log("holder_obj.children[0].children[c].options[1].value)");
                            // console.log(holder_obj.children[0].children[0].options[1].value);
                            for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                    // console.log((holder_obj.children[0].children[c].options[0].value));
                                    for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){
                                        //  genSelect.concat('<option value="'.concat(holder_obj.children[0].children[c].options[k].value).concat('">').concat(holder_obj.children[0].children[c].options[k].value).concat('</option>'));
                                          let tempOpt = holder_obj.children[0].children[c].options[k]
                                          let selected = false;
                                          let auth_user_class = false;

                                          let autVal = tempOpt.value ;

                                        let autValOp = autVal
                                        autUserOptTrim = autValOp.substring(0, Math.min(4,autValOp.length));

                                        if (autVal == "null"){
                                            autValOp = "Select User";
                                        }
                                        else{
                                            autValOp =autUserOptTrim;
                                        }
                                         if(autVal == autUser){
                                              selected = true;
                                              auth_user_class = true;

                                          }
                                        //  genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                        if (selected && auth_user_class) {
                                            	// statement
                                        	genSelect = genSelect + '<option selected = "true" class = "selected auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(selected  && !auth_user_class){
                                            	// statement
                                    	genSelect = genSelect + '<option selected = "true" class = "selected" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(!selected  && auth_user_class){
                                            	// statement
                                	genSelect = genSelect + '<option class = "auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else{
                                              genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                            }
                                        // console.log(genSelect);

                                    }

                                }
                            }
                            break;
                        }

                    }



         genSelect.concat('</select>');
    // genSelect = genSelect + '<option value="' + autUser + '">' + autUserOpt + '</option> </select>';
    // let holderMenuStr = '<div class="holder-menu" style=" height: 30px  display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
    //                      + genSelect+
    //                     '</div>';
    let holderMenuStr = '<div class="holder-menu" style=" height: inherit; width:100%; display: flex; flex-direction: column;  border-radius: 0%; background-color: #fff;">'
                         + genSelect+
                        '</div>';

let stringToHTML = function (str) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};
let textArea = "";
console.log("genselect retextFilter");
console.log(genSelect);
if (currentUser != autUser){
    //  reImage.setAttribute("disabled", true);
    //  testDiv.setAttribute("contenteditable", false);
    //   textArea = '<textarea style="width: 100%; height: 80%; disabled margin: 1%;\
    //     font-size: 1em; border: none; resize: none; background-color:\
    //     rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow:\
    //     overlay;" bold;" >' +extracted +'</textarea>';
    textArea = '<textarea style="width:100%;  height: 40px; disabled  rows=\"4\" cols=\"50\" maxlength=\"200\"  display: block;\
                    cursor: pointer; justify-content: center; align-items: center; border-width: 2px;\
                    border-style: outset; outline: 0px;">' +extracted +'</textarea>';
 }else{
    //   textArea = '<textarea style="width: 100%; height: 80%; margin: 1%;\
    //     font-size: 1em; border: none; resize: none; background-color:\
    //     rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow:\
    //     overlay;" bold;" >' +extracted +'</textarea>';
     textArea = '<textarea style="width:100%;  height: 40px;  rows=\"4\" cols=\"50\" maxlength=\"200\"  display: block;\
                    cursor: pointer; justify-content: center; align-items: center; border-width: 2px;\
                    border-style: outset; outline: 0px;">' +extracted +'</textarea>';

 }

        var myWDiv = '<div>'+holderMenuStr + textArea+ '</div>';
        var td = '<td>'+myWDiv+'</td>';
        var tr = '<tr>'+td+'</tr>';
        var table1 = '<table>'+tr+'</table>'
        var intendedTable = stringToHTML(table1);
        var cellI = intendedTable.children[0].rows[0].cells[0];
        console.log("data.cellWidth");
console.log(data.cellWidth);
console.log("data.cellHeight");
console.log(data.cellHeight);
        cellI.style.width = data.cellWidth;
        cellI.style.height = data.cellHeight;
        cellI.addEventListener('click',(event)=>{
    focusInEvent(event);
});

return cellI
}
function reDateField(data){
    console.log("render datefield");
            let autUser= data.auth_user;
        let autUserOpt = autUser;
        console.log("autUserOpt b");
        console.log(autUserOpt);
        autUserOptTrim = autUserOpt.substring(0, Math.min(4,autUserOpt.length));

        if (autUser == "null"){
            autUserOpt = "Select User";
        }
        else{
            autUserOpt =autUserOptTrim;
        }
        console.log("autUserOpt a");
        console.log(autUserOpt);
        let extracted = data.data;
        let genSelect = '<select class="form-select form-select-sm auth-user" style="display: none;">';



        for (var y=0 ; y< holderDIV.children.length; y++){
                        // console.log("childY");
                        // console.log(holderDIV.children[y]);
                            if(holderDIV.children[y].className === "holder-menu"){
                                // console.log("===");
                            holder_obj = holderDIV.children[y]
                            // console.log("holder_obj.children[0].children[c].options[1].value)");
                            // console.log(holder_obj.children[0].children[0].options[1].value);
                            for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                    // console.log((holder_obj.children[0].children[c].options[0].value));
                                    for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){
                                        //  genSelect.concat('<option value="'.concat(holder_obj.children[0].children[c].options[k].value).concat('">').concat(holder_obj.children[0].children[c].options[k].value).concat('</option>'));
                                          let tempOpt = holder_obj.children[0].children[c].options[k]
                                          let selected = false;
                                          let auth_user_class = false;

                                          let autVal = tempOpt.value ;

                                        let autValOp = autVal
                                        autUserOptTrim = autValOp.substring(0, Math.min(4,autValOp.length));

                                        if (autVal == "null"){
                                            autValOp = "Select User";
                                        }
                                        else{
                                            autValOp =autUserOptTrim;
                                        }
                                         if(autVal == autUser){
                                              selected = true;
                                              auth_user_class = true;

                                          }
                                        //  genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                        if (selected && auth_user_class) {
                                            	// statement
                                        	genSelect = genSelect + '<option selected = "true" class = "selected auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(selected  && !auth_user_class){
                                            	// statement
                                    	genSelect = genSelect + '<option selected = "true" class = "selected" value="' + autVal + '">' + autValOp + '</option>';

                                            } else if(!selected  && auth_user_class){
                                            	// statement
                                	genSelect = genSelect + '<option class = "auth_user_class" value="' + autVal + '">' + autValOp + '</option>';

                                            } else{
                                              genSelect = genSelect + '<option value="' + autVal + '">' + autValOp + '</option>';
                                            }
                                        // console.log(genSelect);

                                    }

                                }
                            }
                            break;
                        }

                    }



        genSelect.concat('</select>');

    // genSelect = genSelect + '<option value="' + autUser + '">' + autUserOpt + '</option> </select>';
    // let holderMenuStr = '<div class="holder-menu" style=" height: 30px  display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
    //                      + genSelect+
    //                     '</div>';
    let holderMenuStr = '<div class="holder-menu" style=" height: inherit; width:100%; display: flex; flex-direction: column;  border-radius: 0%; background-color: #fff;">'
                         + genSelect+
                        '</div>';
    let stringToHTML = function (str) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};
let dateInput = ""

if (currentUser != autUser){
    //  reImage.setAttribute("disabled", true);
    //  testDiv.setAttribute("contenteditable", false);

    dateInput = '<input type="text" class="form-control date2" placeholder="'+extracted+ '" style=" width: inherit;height: 90%; display: block;  border-width: 2px; border-style: outset; outline: 0px;">';

 }else{
    dateInput = '<input type="text" class="form-control date2"placeholder='+extracted+ ' style="width: inherit; height: 90%; display: block;  border-width: 2px; value='+extracted +' border-style: outset; outline: 0px;">';

 }
 var myWDiv = '<div>'+holderMenuStr + dateInput+ '</div>';
        var td = '<td>'+myWDiv+'</td>';
        var tr = '<tr>'+td+'</tr>';
        var table1 = '<table>'+tr+'</table>'
        var intendedTable = stringToHTML(table1);
        var cellI = intendedTable.children[0].rows[0].cells[0];
        // cellI.style.width = data.cellWidth;
        // cellI.style.height = data.cellHeight;
        cellI.addEventListener('click',(event)=>{
            // if(event.target.classList.contains('date2')){
             $('.date2').datepicker({
                        // format: 'DD dd MM yyyy'
                        // multidate:true,
                        format: 'dd-mm-yyyy',
                        }

                        );
                        $('.date2').click(function(){
//   $("p:first").addClass("intro");
// $(".holder-menu").css('display', 'hide');
$(".table-condensed").addClass("table-success");

// $(".table-condensed").css('border-radius', '30px');

});

            // }else{
                    focusInEvent(event);

            // }
});

return cellI
        }



colRowLen = get_rows_cols(data);
newColLen = colRowLen[1];
newRowLen = colRowLen[0];

for (var p = 0; p < newRowLen; p++){
let row = document.createElement('tr');
for (var q = 0; q<newColLen; q++){
    var idx = "row".concat(p.toString()).concat("column").concat(q.toString());
    // row.appendChild(reTextField());
    if (data[idx].type == "SIGN"){
        row.appendChild(reSignature(data[idx]))

    }
    if (data[idx].type == "TEXT_INPUT_T"){
        console.log("Fetching TEXT_INPUT_T");
        row.appendChild(reTextField(data[idx]));

    }
    if (data[idx].type == "EDITABLE_P"){
        row.appendChild(reParaField(data[idx]));

    }
    if (data[idx].type == "DATE_INPUT"){
        row.appendChild(reDateField(data[idx]));

    }
    if (data[idx].type =="BLANK_CELL"){
        let emptyTd = document.createElement('td');
        emptyTd.style.width = data[idx].cellWidth;
        emptyTd.style.height = data[idx].cellHeight;
        emptyTd.innerHTML = "           ";
        row.appendChild(emptyTd);


    }

}
tbody.appendChild(row);
}
table.appendChild(tbody);
// let edBtn = getEditTableBtn();
//  edBtn.classList.add("float-left");

// tableDiv.append(edBtn);
tableDiv.append(table);
// tableDiv.appendChild(editBtn);
 tableDiv.addEventListener('dblclick', function (e) {
  handleTableEditBtn(e);
});
console.log("Before exit of rendering tableDIv");
console.log(tableDiv);
return tableDiv;


}

//RerenderDropdowns
function   reRenderDropDown(id, data){
console.log("DropDown");
    reqId = id.match(/(\d+)/)[0];
  let dropDownDiv = document.createElement("address");
  dropDownDiv.setAttribute("id", "dropDownDiv".concat(reqId.toString()));
  dropDownDiv.setAttribute("class", "dropDownDiv");
  dropDownDiv.style.width = "200px";
  let selectField = document.createElement('select');
  selectField.setAttribute("id", id.toString());
  selectField.setAttribute("class", "form-select");
  selectField.classList.add(["form-select-sm"]);

  for(d of data){
    let tempOptionField = document.createElement('option');
    tempOptionField.value=d;
    if(d == '0'){
    tempOptionField.text = ' ';
    }
    else{
        tempOptionField.text = d;
    }
    selectField.add(tempOptionField)
  }


            dropDownDiv.append(selectField);
                dropDownDiv.addEventListener('dblclick', function (e) {
  handleDropDwnDouble(e);
});

            return dropDownDiv;


}


    //rendering file after getting file data
    function renderFile(data){
        const content = JSON.parse(data);
        console.log("all the content");
        console.log(content);
        //const pdfFile = document.getElementById('pdf-file');
        const pdfFile = document.getElementById('page-container');
        const currUser = document.getElementById('current-user')
        console.log("whole of pdf file");
        console.log(pdfFile);
        if( pdfFile.children.length ){
            const noOfItems = pdfFile.children.length
            for(let i = 0; i < noOfItems ; i++){
                pdfFile.removeChild(pdfFile.children[i]);
            }
        }
        console.log(content)
        for( let pageContent of content ){
            const pageContainer = document.getElementById('page-container');
            //console.log(pageContainer);

            const newPageHolder = document.createElement('div');
            newPageHolder.className = "page";

            const newPage = document.createElement('div');
            newPage.className = "pdf-file docedit-page";//"page-identity doc-content grid";
            newPage.style.width = "100%";
            newPage.style.height = "100%";
            newPage.style.border = "1px dashed green";



            //pdfFile.appendChild();

            for(item of pageContent){
                const holder = getHolderDIV(item);
                let inputField = undefined;

                if( item.type === "TEXT_INPUT" ){
                    console.log("Text input sourced");
                    console.log(item.type);
                    inputField = getTextField();

                    inputField.value = item.data;

                }
                if( item.type === "EDIT_P" ){
                    inputField = getParaField();
                    console.log("Editt ps");
                    console.log(item.data);
                    inputField.innerHTML = item.data;
                     if (!isTemplate) {
                        inputField.setAttribute('contenteditable', false);
                        inputField.removeEventListener('click',toogleTxtFormBlock);
                    }

                }
                if( item.type === "DATE_INPUT" ){
                    if (!isTemplate) {
                         console.log("!isTemplate");
                        inputField = getDateField2(item.data,"dd-mm-yy");
                        console.log("$('.date') after calls");
                        console.log($('.date'));
//                         $('.date').datepicker({

//                     format: "dd/mm/yy",
//                     }

//                     );
// $('.date').click(function(){
//     console.log("date after refres clicked");
// //   $("p:first").addClass("intro");
// $(".table-condensed").addClass("table-success");
// // $(".table-condensed").css('border-radius', '30px');
// // $(".table-condensed").css('border-radius', '30px');

// });
// $('.date').datepicker("refresh");
                    }if(isTemplate){
                        inputField = getDateField2(item.data,"default");
                    }
                    // inputField = getDateField2(item.data,"dd-mm-yy");

                    // inputField.value = item.data;
                }
                if( item.type === "IMG_INPUT" ){
                    inputField = renderImageField();
                    inputField.src = item.data;
                }
                if( item.type === "IMAGE_INPUT" ){
                    inputField = getImageField();
                    inputField.src = item.data;
                }
                if( item.type === "SIGN_INPUT" ){
                    // holder.style.width = '200px';
                    // holder.style.height = '100px';
                    inputField = getSignField();

                }
                if( item.type === "TABLE_INPUT" ){
                    // holder.style.width = '200px';
                    // holder.style.height = '100px';
                    // inputField = getSignField();


                    const measure = {
                        width: item.width,
                        height: item.height,
                        left: item.left,
                        top: item.top,
                        auth_user: item.auth_user,
                    }
                    let reholdingDiv = getHolderDIV(measure);
                    // reholdingDiv.style.overflow = "auto";
                    // reTable = reRenderTableField(currUser.innerHTML,item.tableId, item.data)
                    // reholdingDiv.append(reTable)
                    // pdfFile.append(reholdingDiv);
                    inputField = reRenderTableField(currUser.innerHTML,item.tableId, item.data, holder)
                    // continue;

                }

                if( item.type === "DROPDOWN_INPUT" ){
                    holder.style.width = item.width;
                    holder.style.height = item.height;
                    holder.style.top = item.top;
                    holder.style.left = item.left;
                    inputField = reRenderDropDown(item.dropId, item.data);
                }


if( item.type === "TEXT_INPUT" ){
                             console.log("TEXT_INPUT inputfield used before condition");
                            console.log(inputField)
                            console.log("TEXT_INPUT item.auth_user used before condition");
                            console.log(item.auth_user)
                         }

                if (item.auth_user != "null" && item.auth_user != currUser.innerHTML&& inputField !=undefined){
                    if (!isTemplate) {
                        inputField.setAttribute('disabled', true);
                         if( item.type === "TEXT_INPUT" ){
                             console.log("TEXT_INPUT inputfield used");
                            console.log(inputField)
                            console.log("TEXT_INPUT item.auth_user");
                            console.log(item.auth_user)
                         }
                        if( item.type === "DATE_INPUT" ){
                            // $('#dateRangePicker').datepicker('remove');
                            let tempDate = inputField.getElementsByClassName('date')[0];
                            console.log("datepicker in disabling condition");
                            console.log(inputField)
                            console.log("datepicker in disabling condition tempDate");
                            tempDate.setAttribute('disabled', true);
                            console.log(tempDate)
                        }
                    }

                }

                if (inputField !=undefined){
                    // console.log("displaying undefined");
                    // holder.append(inputField);
                    holder.append(inputField);
                    newPage.append(holder);

                }

                getDate('dd-mm-yyyy');
            newPageHolder.append(newPage);
            pageContainer.append(newPageHolder);
            }
            // console.log("$('.date') after page ");
            //             console.log($('.date'));
            //             console.log("isTemplate after page");
            //             console.log(isTemplate);
             if (!isTemplate) {
                 resetter();
             }

        }
    }











