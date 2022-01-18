            //  import {  toogleTxtFormBlock, initDoc, formatDoc, validateMode, setDocMode, printDoc } from './text_format.js';
    //   const toogleTxtFormBlock = requirejs(['text_format.js']);
        let resizing = false;
        let contentFile = [];
        let saveFileButton = document.createElement('button');

        const isTemplate = JSON.parse(document.getElementById('template').textContent);
        const isVerify = JSON.parse(document.getElementById('verify').textContent);


        window.onload = (event) => {
            const fileData = JSON.parse(document.getElementById('file-data').textContent);
            //
            renderFile(fileData);
        }


        if (isTemplate) {
            const txtBtn = document.getElementById("txt-btn");
            const imgBtn = document.getElementById("img-btn");
            const tableBtn = document.getElementById("table-btn");
            const dateBtn = document.getElementById("date-btn");
            const signatureBtn = document.getElementById("signature-btn");
            const dropDownBtn = document.getElementById("dropdown-btn");
            const txtP = document.getElementById("edP-btn");

            txtBtn.ondragstart = (event) => {
                event.dataTransfer.setData("text/plain", "TEXT_BUTTON");
            }

            imgBtn.ondragstart = (event) => {
                event.dataTransfer.setData("text/plain", "IMG_BUTTON");
            }

            tableBtn.ondragstart = (event) => {
                event.dataTransfer.setData("text/plain", "TABLE");
            }

            dateBtn.ondragstart = (event) => {
                event.dataTransfer.setData("text/plain", "DATE");
            }

            signatureBtn.ondragstart = (event) => {
                event.dataTransfer.setData("text/plain", "SIGN");
            }
            dropDownBtn.ondragstart = (event) => {
                    event.dataTransfer.setData("text/plain", "DROPDOWN");
                }
            txtP.ondragstart = (event) => {
                    event.dataTransfer.setData("text/plain", "EDIT_P");
            }

        }
let modalTxtForm = document.getElementById("modalTxtForm");
 let toolBoxTools = document.getElementById("toolbox-tools");
            toolBoxTools.style.display = "none";
// New Fomart Code

$(document).ready(function() {

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

function printDoc() {
  if (!validateMode()) { return; }
  var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
  oPrntWin.document.open();
  oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
  oPrntWin.document.close();
}



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
}



/*end of Font and text styling javascript*/








        if (isTemplate){
            saveFileButton = document.getElementById('save-template-btn');
        } else if (!isVerify) {
            saveFileButton = document.getElementById('save-btn');
            //Adding document in workflow
            wfButton = document.getElementById("addToWorkFlowButton");
            wfButton.addEventListener("click", addWorkflow, false);

        }

        saveFileButton.onclick = (event) => {
            const data = saveDocument();
            sendSaveDocumentRequest(data);
            console.log("File saved");
        }

        //saving file
        const sendSaveDocumentRequest = (data) => {
            const requestURL = isTemplate ? '/editor/api/save-template/' : '/editor/api/save-file/' ;
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            const saveFileRequest = new Request(requestURL, {headers: {'X-CSRFToken': csrftoken}} );
            const documentID = JSON.parse(document.getElementById('documentID').textContent);
            const documentName = JSON.parse(document.getElementById('documentName').textContent);
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
            })
        }






        function addWorkflow() {
            saveDocument();

            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            const requestURL = '/editor/add-document/';
            const addDocument2WFRequest = new Request(requestURL, {headers: {'X-CSRFToken': csrftoken}} );

            const documentID = JSON.parse(document.getElementById('documentID').textContent);
            const documentName = JSON.parse(document.getElementById('documentName').textContent);


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


        const signSubmit = (event) => {
            const data = saveDocument();
            const dataInput = document.getElementById("documentData");
            dataInput.value = JSON.stringify(data);
            const submitBTN = document.getElementById("Signed");
            submitBTN.submit();
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
            textPara.innerHTML = "Input Here"
            textP.appendChild(textPara);
            textP.type = 'text';
            textP.style.width = '100%';
            textP.style.height = '80%';
            textP.style.margin = '1%';

            textP.style.fontSize = '1em';
            textP.style.border = 'none';
            textP.style.resize = 'none';
            textP.style.backgroundColor = '#0000';
            textP.style.borderRadius = '0px';
            textP.style.outline = '0px';
            textP.style.overflow = 'overlay';
            textP.onclick= (ev)=>{
                console.log("clicked");
        //         requirejs(['text_format'], function (text_format) {
        // //   const headerEl = document.getElementById("header");
        // //   headerEl.textContent = lodash.upperCase("hello world");
        toogleTxtFormBlock();
        // });

            }


            return textP;
        }



        //Get Text Field
        function getTextField(){
            const textField = document.createElement('textarea');
            textField.type = 'text';
            textField.style.width = '100%';
            textField.style.height = '80%';
            textField.style.margin = '1%';
            textField.style.fontSize = '1em';
            textField.style.border = 'none';
            textField.style.resize = 'none';
            textField.style.backgroundColor = '#0000';
            textField.style.borderRadius = '0px';
            textField.style.outline = '0px';
            textField.style.overflow = 'overlay';

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
                return dropDownDiv;

            }

//Create Table with id passed
            function getTableField(id){
              console.log("getTable id = ".concat(id.toString()));
                let tableDiv = document.createElement("address");
                let editBtn =getEditTableBtn();
                tableDiv.setAttribute("id", "tableDiv".concat(id.toString()));
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
                table.setAttribute("class", "form-table form-table-sm float-right");
                table.setAttribute("id", "t".concat(id.toString()));
                table.style.height = "100%";
                table.style.width = "80%";
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
                tableDiv.appendChild(editBtn);
                tableDiv.append(table);


              //TRING TO MOVE THE TABLE

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
                defaulTb.classList.add("table" ,"table-borded", "table-striped", "table-list");
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
                modal.style.display = "none";
                }

                var span = document.getElementsByClassName("close2")[0];
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





            //Handle Edit when Clicked
            function  getEditBtn(){
                const editBtn = document.createElement('span');
                editBtn.style.textAlign = 'center';
                editBtn.style.fontSize = '0.8em';
                editBtn.style.margin = '5px';
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

                    var big_elemet = eventclk.target.parentNode.parentNode.children
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
                };
                return editBtn;
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
                    var big_element = eventclk.target.parentNode.parentNode
                    console.log("big sjsjsj");
                    console.log(big_element);
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
         function getDateField2(value){
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
                submitDateFormat.onclick = (env) =>{
                    reqFormat = $( "#myselect option:selected" ).val();
                    getDate(reqFormat);
                    modal.style.display = "none";



                }
                span.onclick = (env)=> {
                    modal.style.display = "none";
                }
                // divCont.append(getFormatBut);
                divCont.append(editDateBtn);

                divCont.append(dateField);

                function getDate(formatWanted){


                        $('.date').datepicker({

                        format: formatWanted
                        }

                        );
 $('.date').click(function(){
//   $("p:first").addClass("intro");
$(".table-condensed").addClass("table-success");
// $(".table-condensed").css('border-radius', '30px');
// $(".table-condensed").css('border-radius', '30px');

});
                        }

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
                    if(eventclk.target.parentNode.parentNode.parentNode.parentNode.id != 'pdf-file'){
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

            const userList = document.getElementById('user-list');

            const defOpt = document.createElement('option');
            defOpt.innerHTML = "Select User";
            defOpt.setAttribute("value", null);
            defOpt.setAttribute('selected', true);
            select.append(defOpt);


            for(let item of userList.children){
                const opt = document.createElement('option');
                opt.innerHTML = item.innerHTML;
                opt.setAttribute("value", item.innerHTML);

                if(item.innerHTML === auth_user){
                    opt.setAttribute('selected', true)
                }

                select.append(opt);
            }

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


        //Function to run when Input is focused
        const focusInEvent = (eventh) => {
            /*const pdfFile = document.getElementById('pdf-file');

            const fileFields = pdfFile.getElementsByClassName('holderDIV');

            for ( let elem of fileFields ){
                deFocusElement(elem)
            }*/
            let tableCharacter = "Default";
            if (eventh.target.tagName == "TD"){
               tableCharacter = event.target.parentNode.parentNode.parentNode.parentNode
            }
            console.log("Target focusInvent");
            console.log(eventh.target);
            console.log("Main Character");
            console.log(tableCharacter.parentNode);
            eventh.preventDefault();
            eventh.target.style.outline = '0px';
            if (eventh.target.parentNode.className === 'holderDIV'){// || tableCharacter.parentNode.classList.contains("holderDIV")){
                eventh.target.parentNode.style.border = '1px solid rgb(255 191 0)';
                eventh.target.parentNode.style.zIndex = '5';
                for(child of eventh.target.parentNode.children){
                console.log(".parentNode");

                    if(child.className === 'resizeBtn'){

                        child.style.display = 'block';
                    }
                    if(child.className === 'holder-menu'){
                        child.style.display = 'flex';
                    }
                }

            }
                if (tableCharacter != "Default"){
                    console.log("Passed test");
                for(child of tableCharacter.parentNode.children){
                console.log(".maincharacter childres");

                    if(child.className === 'resizeBtn'){

                        child.style.display = 'block';
                    }
                    if(child.className === 'holder-menu'){
                        child.style.display = 'flex';
                    }
                }

                }
            // }
            if (eventh.target.parentNode.parentNode.parentNode.className === 'holderDIV'){
                console.log(".parentNode.parentNode.parentNode");
                eventh.target.parentNode.style.border = '1px solid rgb(255 191 0)';
                eventh.target.parentNode.style.zIndex = '5';
                for(child of eventh.target.parentNode.children){
                    if(child.className === 'resizeBtn'){
                        child.style.display = 'block';
                    }
                    if(child.className === 'holder-menu'){
                        child.style.display = 'flex';
                    }
                }
            }
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
            console.log("Input type is "+ inputType)
               var myDiv =  holderDIV.append(inputField);
                        let cellWidths = getTableCellWidths();
                        let myTd  = document.createElement('td');
                        holderDIV.style.width = "100%";
                        holderDIV.style.height = "100%";
                        var holder_obj = '';
                        var genSelect = '<select class="form-select form-select-sm auth-user" style="width:inherit;">';
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
                                            //  genSelect.concat('<option value="'.concat(holder_obj.children[0].children[c].options[k].value).concat('">').concat(holder_obj.children[0].children[c].options[k].value).concat('</option>'));
                                             genSelect = genSelect + '<option value="' + holder_obj.children[0].children[c].options[k].value + '">' + holder_obj.children[0].children[c].options[k].value + '</option>';

                                            // console.log(genSelect);

                                        }

                                    }
                                }
                                break;
                            }

                        }
                        genSelect.concat('</select>')
                        let holderMenuStr = '<div class="holder-menu" style=" height: 30px; width:inherit; display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
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
                             typeOfConcern = '<textarea style="width:inherit; height: 80%; margin: 1%;\
                        font-size: 1em; border: none; resize: none; background-color:\
                        rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow:\
                        overlay;" bold;"></textarea>';

                             var myWDiv = '<div>'+holderMenuStr + typeOfConcern+ '</div>';
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
                         <p>Input Here</p> </div>';
                        let myWDiv = '<div style= width:inherit;>'+holderMenuStr + '</div>';

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
                        testDiv.onclick = ()=>{
                            toogleTxtFormBlock();
        //                     requirejs(['text_format'], function (text_format) {
        // //   const headerEl = document.getElementById("header");
        // //   headerEl.textContent = lodash.upperCase("hello world");
        // text_format.toogleTxtFormBlock();
        // });
                        }
                        textPara.innerHTML = "Input Here";
                        testDiv.appendChild(textPara);



                        cellI.appendChild(testDiv);
                        // console.log("CELLI");
                        // console.log(cellI);

                            }

                        let targetId = event.target.parentNode.parentNode.parentNode.getAttribute("id")
                        let tdI =  targetId.match(/(\d+)/)[0]
                        // console.log("Much Imported Id "+tdI);
                        // console.log(cellWidths[tdI]);
                        fIwidth =   (cellWidths[tdI][0].match(/(\d+)/)[0] -20).toString()+"px"
                        fIheight =   (cellWidths[tdI][1].match(/(\d+)/)[0] -20).toString()+"px"

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
                    // console.log("tableinputField");
                    // console.log(inputField.children[1].rows)
                    row_length = inputField.children[1].rows.length;
                    col_len = inputField.children[1].rows[0].cells.length;
                    for (let y = 0; y <row_length; y++){
                        for (let x = 0; x<col_len; x++){
                            inputField.children[1].rows[y].cells[x].addEventListener('click', event => {
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
                        var genSelect = '<select class="form-select form-select-sm auth-user" style="width:inherit;">';
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
                                             genSelect = genSelect + '<option value="' + holder_obj.children[0].children[c].options[k].value + '">' + holder_obj.children[0].children[c].options[k].value + '</option>';

                                            // console.log(genSelect);

                                        }

                                    }
                                }
                                break;
                            }

                        }
                        genSelect = genSelect+'</select>';
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
                        var holderMenuStr = '<div class="holder-menu" style=" height: 30px; width:inherit; display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
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
                        fIwidth =   (cellWidths[tdI][0].match(/(\d+)/)[0] -20).toString()+"px"
                        fIheight =   (cellWidths[tdI][1].match(/(\d+)/)[0] -20).toString()+"px"

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
            holderDIV.style.border = '1px dotted rgb(255 191 0)';
            holderDIV.style.position = 'absolute';
            holderDIV.style.overflow = 'visible';
            holderDIV.style.display = 'flex';
            holderDIV.style.cursor = 'move';
            holderDIV.className = 'holderDIV';
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

            holderDIV.append(resizerTL);
            holderDIV.append(resizerTR);
            holderDIV.append(resizerBL);
            holderDIV.append(resizerBR);
            holderDIV.append(holderMenu);

            const isTemplate = JSON.parse(document.getElementById('template').textContent);
            const isVerify = JSON.parse(document.getElementById('verify').textContent);
            const createdBy = JSON.parse(document.getElementById('created_by').textContent);
            const currUser = JSON.parse(document.getElementById('curr_user').textContent);
            console.log(createdBy, currUser)


            if (isTemplate){
                holderDIV.onmousedown = holderDIV.addEventListener('mousedown', (event) => {
                    dragElementOverPage(event)
                }, false);

                holderDIV.onresize = (evntt) => {
                    console.log('Holder resized')
                }
            }

            return holderDIV
        }

        const pdfFile = document.getElementById('pdf-file');
        const pdf_table = document.querySelectorAll("#pdf-file TD");


        pdfFile.onclick = (event) => {
            if(event.target.id === 'pdf-file'){
                const fileFields = event.target.getElementsByClassName('holderDIV');

                for ( let elem of fileFields ){
                    deFocusElement(elem)
                }

            }
        }


            document.addEventListener('dragover', (event)=> {

            if(!event.target.matches('#pdf-file, TD')) return;

            event.preventDefault();
            if (event.target.id === 'pdf-file'){
                event.target.style.border = '1px dashed green'
            }
        });


            document.addEventListener('drop', (event)=> {
            if(!event.target.matches('#pdf-file, TD')) return;
            event.preventDefault();
            if (event.target.id === 'pdf-file'){
                event.target.style.border = '0px dashed green'
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

            switch ( typeOfOperation ) {
                case 'EDIT_P':
                    console.log('edit_p');
                    inputField = getParaField();
                    if (event.target.tagName == 'TD'){
                     handleTextEditPara (holderDIV, inputField, 'EDIT_P' );
                    }
                    break;

                case 'TEXT_BUTTON':
                    inputField = getTextField();

                    if (event.target.tagName == 'TD'){
                        handleTextEditPara(holderDIV, inputField, 'TEXT_BUTTON' );

                    }
                    break;

                case 'IMG_BUTTON':
                    inputField = getImageField();
                    holderDIV.style.height = '150px';
                    break;

                case 'DATE':
                    holderDIV.style.width = '200px';
                    holderDIV.style.height = '150px';
                     inputField = getDateField2("default");
                    break;

                case 'SIGN':
                    holderDIV.style.width = '200px';
                    holderDIV.style.height = '100px';
                    inputField = getSignField();
                    // myResizer
                     if (event.target.tagName == 'TD'){
                         handleSignCase(holderDIV, inputField);

                    }
                    break;


                case 'TABLE':

                    holderDIV.classList.add("tableInput");
                    inputField =  handleTableCase();

                    break;

                case 'DROPDOWN':
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

            event.target.append(holderDIV);
            inputField.focus();

        });


//Save Drop Down Data


    function savingDropdownData(){
        const drops_add = document.getElementsByClassName("dropDownDiv");
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
        function savingTableData(){
            console.log("Saving Table Data");
            const tables_add = document.getElementsByClassName("tableDiv");
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
            if (tables_tags.length){

                for(table of tables_tags){
                    authUserr = table.parentNode.parentNode.getElementsByClassName("auth-user")[0].value
                    console.log("authUserr");
                    console.log(authUserr);
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
                    console.log(table.rows[0].cells);

                                        for(var t = 0; t<row_length; t++ ){
                        for(var g = 0; g<column_length; g++){
                            var idx = "row".concat(t.toString()).concat("column").concat(g.toString());
                            var tempElement  = {}
                            tempElement["cellWidth"] = window.getComputedStyle(table.rows[t].cells[g], null).getPropertyValue("width");
                            tempElement["cellHeight"] = window.getComputedStyle(table.rows[t].cells[g], null).getPropertyValue("height");
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
                                    var miniauthUser = table.rows[t].cells[g].children[0].children[0].children[b].value
                                    tempElement["auth_user"]= miniauthUser;

                                    console.log("miniauthUser");
                                    console.log(miniauthUser);
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
                            for(var b = 0; b <txtElementLength; b++){

                                if(table.rows[t].cells[g].children[0].children[0].children[b].tagName == "SELECT"){
                                    var miniauthUser = table.rows[t].cells[g].children[0].children[0].children[b].value
                                    tempElement["auth_user"]= miniauthUser;

                                    console.log("miniauthUser");
                                    console.log(miniauthUser);
                                }
                                if(table.rows[t].cells[g].children[0].children[0].children[b].tagName == "TEXTAREA"){
                                    var textInput = table.rows[t].cells[g].children[0].children[0].children[b].value
                                    console.log("textInput");
                                    console.log(textInput);
                                    tempElement["data"]= textInput;
                                    tempElement["type"]= "TEXT_INPUT";

                                }
                                // if(table.rows[t].cells[g].children[0].children[0].children[b].tagName == "IMG"){
                                //     // let textInput = table.rows[t].cells[g].children[0].children[0].children[b].value
                                //     // const img = child.getElementsByTagName("img");

                                //     console.log("img Data");
                                //     console.log(elem22.data);
                                //     tempElement["data"]= elem22;
                                //     tempElement["type"]= "SIGN";

                                // }
                            }
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

                    }

                }
                    console.log("Main Tables==========");
                    console.log(tables_collected);

                    //   return "elem";
                    return tables_collected;
            }




        function saveDocument(){
            const elementTables = savingTableData();
            const elementDropdowns = savingDropdownData();

            const status = 'REQUEST_IN_PROGRESS';

            const pdfFile = document.getElementById('pdf-file');
            contentFile = [];

            for( child of pdfFile.children ){
                const sel = child.getElementsByClassName('auth-user');
                // const sel = child.getElemenstClassName("")
                const authUser = sel[0].value;
                let elem = {}


                const txt = child.getElementsByTagName("textarea");
                if( txt.length ){
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
                const editP = child.getElementsByClassName("editPara");
                if( editP.length ){
                    elem = {
                        width: child.style.width,
                        height: child.style.height,
                        top: child.style.top,
                        left: child.style.left,
                        type:'EDIT_P',
                        data: editP.innerHTML,
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
                contentFile.push(elem);
            }



            if(elementTables.length){
                for(let h= 0; h< elementTables.length; h++){
                    contentFile.push(elementTables[h]);
                }
            }
            if(elementDropdowns.length){
                for(let h= 0; h< elementDropdowns.length; h++){
                    contentFile.push(elementDropdowns[h]);
                }
            }

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
               function reRenderTableField(currentUser,id, data){
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
      table.classList.add( "form-table-sm","float-right","table" ,"table-borded",  "table-striped", "table-list");

      //add classes
    //   table.setAttribute("id", "t".concat(id.toString()));
      table.setAttribute("id", id);

    table.style.height = "100%";
      table.style.width = "70%";
      table.style.top = "inherit";
      table.style.left = "inherit";
      table.zIndex = "7";


        function reSignature(data){
            let autUser= data.auth_user;
            let extracted = data.data;
            let genSelect = '<select class="form-select form-select-sm auth-user" style="width:inherit;">';
        genSelect = genSelect + '<option value="' + autUser + '">' + autUser + '</option> </select>';
        let holderMenuStr = '<div class="holder-menu" style=" height: 30px; width:inherit; display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
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
     if (currentUser != autUser){
         reImage.setAttribute("disabled", true);
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
            let extracted = data.data;
            let genSelect = '<select class="form-select form-select-sm auth-user">';
        genSelect = genSelect + '<option value="' + autUser + '">' + autUser + '</option> </select>';
        let holderMenuStr = '<div class="holder-menu" style=" height: 30px display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
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
            let extracted = data.data;
            let genSelect = '<select class="form-select form-select-sm auth-user">';
        genSelect = genSelect + '<option value="' + autUser + '">' + autUser + '</option> </select>';
        let holderMenuStr = '<div class="holder-menu" style=" height: 30px  display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
                             + genSelect+
                            '</div>';
    let stringToHTML = function (str) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };
    let textArea = ""

    if (currentUser != autUser){
        //  reImage.setAttribute("disabled", true);
        //  testDiv.setAttribute("contenteditable", false);
          textArea = '<textarea style="width: 100%; height: 80%; disabled margin: 1%;\
            font-size: 1em; border: none; resize: none; background-color:\
            rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow:\
            overlay;" bold;" >' +extracted +'</textarea>';
     }else{
          textArea = '<textarea style="width: 100%; height: 80%; margin: 1%;\
            font-size: 1em; border: none; resize: none; background-color:\
            rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow:\
            overlay;" bold;" >' +extracted +'</textarea>';

     }

            var myWDiv = '<div>'+holderMenuStr + textArea+ '</div>';
            var td = '<td>'+myWDiv+'</td>';
            var tr = '<tr>'+td+'</tr>';
            var table1 = '<table>'+tr+'</table>'
            var intendedTable = stringToHTML(table1);
            var cellI = intendedTable.children[0].rows[0].cells[0];
            cellI.style.width = data.cellWidth;
            cellI.style.height = data.cellHeight;
            cellI.addEventListener('click',(event)=>{
        focusInEvent(event);
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
        if (data[idx].type == "TEXT_INPUT"){
            row.appendChild(reTextField(data[idx]));

        }
        if (data[idx].type == "EDITABLE_P"){
            row.appendChild(reParaField(data[idx]));

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
 let edBtn = getEditTableBtn();
//  edBtn.classList.add("float-left");

 tableDiv.append(edBtn);
tableDiv.append(table);
// tableDiv.appendChild(editBtn);
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


                dropDownDiv.append(selectField)
                return dropDownDiv;


    }


        //rendering file after getting file data
        function renderFile(data){
            const content = JSON.parse(data);
            const pdfFile = document.getElementById('pdf-file');
            const currUser = document.getElementById('current-user')

            if( pdfFile.children.length ){
                const noOfItems = pdfFile.children.length
                for(let i = 0; i < noOfItems ; i++){
                    pdfFile.removeChild(pdfFile.children[0]);
                }
            }

            for( let item of content ){
                const holder = getHolderDIV(item);
                let inputField = undefined;

                if( item.type === "TEXT_INPUT" ){
                    inputField = getTextField();
                    inputField.value = item.data;

                }
                if( item.type === "EDIT_P" ){
                    inputField = getParaField();
                    inputField.innerHTML = item.data;

                }


                if( item.type === "DATE_INPUT" ){
                    inputField = getDateField2(item.data);
                    // inputField.value = item.data;
                }

                if( item.type === "IMG_INPUT" ){
                    inputField = renderImageField();
                    inputField.src = item.data;
                }

                if( item.type === "SIGN_INPUT" ){
                    holder.style.width = '200px';
                    holder.style.height = '100px';
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
                    inputField = reRenderTableField(currUser.innerHTML,item.tableId, item.data)
                    // continue;

                }

                if( item.type === "DROPDOWN_INPUT" ){
                    holder.style.width = item.width;
                    holder.style.height = item.height;
                    holder.style.top = item.top;
                    holder.style.left = item.left;
                    inputField = reRenderDropDown(item.dropId, item.data);
                }


                if (item.auth_user != "null" && item.auth_user != currUser.innerHTML){
                    if (!isTemplate) {
                        inputField.setAttribute('disabled', true);
                    }

                }
                holder.append(inputField)
                pdfFile.append(holder);
            }
        }

