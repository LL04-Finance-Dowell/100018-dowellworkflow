
        window.onload = (event) => {
            const fileData = JSON.parse(document.getElementById('file-data').textContent);
            //
            renderFile(fileData);
        }



        let resizing = false;

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

var modalTxtForm = document.getElementById("modalTxtForm");
            modalTxtForm.style.display = "none";
        const isTemplate = JSON.parse(document.getElementById('template').textContent);
        const isVerify = JSON.parse(document.getElementById('verify').textContent);

        let saveFile = document.createElement('button');

        if (isTemplate){
            saveFile = document.getElementById('save-template-btn');
        } else {
            saveFile = document.getElementById('save-btn');
        }

        saveFile.onclick = (event) => {
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

                alert(fileObject.file.name +' - file saved.')
            })
        }




        let contentFile = [];

        //Adding document in workflow
        const workFlowBtn = document.getElementById('addToWorkFlowButton');

        workFlowBtn.onclick = (event) => {
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
            return resizer;
        }


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



        const toogleTxtForm =  ()=>{
            console.log("in Toggele Txtx  FOrma");
                        if (modalTxtForm.style.display === "none") {
                            initDoc();
                            modalTxtForm.style.display = "block";
                                } else {
                                    modalTxtForm.style.display = "none";
                                }
                    }

        /*end of Font and text styling javascript*/
    //Get Editable Div Field
    function getParaField(){
            const textP = document.createElement('div');
            textP.setAttribute("contenteditable", true);
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
            toogleTxtForm();
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
                //display automatic empty drop down
                console.log("id = ".concat(id.toString()));
                let dropDownDiv = document.createElement("address");
                dropDownDiv.setAttribute("id", "dropDownDiv".concat(id.toString()));
                dropDownDiv.setAttribute("class", "dropDownDiv");
                dropDownDiv.style.width = "200px";

                let selectField = document.createElement('select');

                selectField.setAttribute("id", id.toString());
                selectField.setAttribute("class", "form-select form-select-sm");




                let defaultOptionField = document.createElement('option');
                defaultOptionField.value="0"
                defaultOptionField.text = " "
                selectField.add(defaultOptionField)

                dropDownDiv.append(selectField)
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
                table.setAttribute("class", "form-table form-table-sm");
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

                console.log("defaultb2");
                console.log(defaulTb);
                let reqIdWitht = defaulTb.getAttribute('id');
                console.log("reqIdWitht ".concat(reqIdWitht.toString()));
                reqId = reqIdWitht.match(/(\d+)/)[0];
                console.log("reqId ".concat(reqId.toString()));
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
                console.log("default Table Normals times");


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
            console.log("Before Append of clone = ");
            console.log(changedTableCln);
            console.log("Before Append of element editabl");
            console.log(elementEditable);

               elementEditable.appendChild(changedTableCln);
               console.log("after Append of clone = ");
            console.log(changedTableCln);
            console.log("after Append of element editabl");
            console.log(elementEditable);
                modal.style.display = "none";
                }

                var span = document.getElementsByClassName("close2")[0];
                span.onclick = function(e) {

                    e.preventDefault();
                    changedTable  = document.getElementById("tb".concat(reqId));

                divTable  = document.getElementById("tableDiv".concat(reqId));
                if (document.getElementById(reqIdWitht)){
                defaultTableField = document.getElementById(reqIdWitht);
                console.log("default Table Normals times");

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
                editBtn.classList.add("float-right", "col-md-3");
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
         function getDateField2(){
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
                    canImg.style.width = '40%';
                    canImg.style.height = '40%';
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

                const pageCont = document.getElementsByClassName('doc-container');
                pageCont[0].append(containerDIV);
            }


        function getSignField() {
            const signF = document.createElement('button');
            signF.className = 'btn-secondary signature-btn';
            signF.style.width = '50%';
            signF.style.height = '50%';
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

        function getQuestionField(){
            const inp = document.createElement('button');

            return inp;
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

            closeBtn.onclick = (eventclk) => {
                eventclk.preventDefault();
                if(eventclk.target.parentNode.parentNode.parentNode.parentNode.id != 'pdf-file'){
                    eventclk.target.parentNode.parentNode.parentNode.parentNode.remove();
                }

            };
            return closeBtn;
        }

        //select user on fields 'select-option' field
        function getSelectOptionsField(auth_user){
            const select = document.createElement('select');
            select.className = "form-select form-select-sm auth-user";

            const userList = document.getElementById('user-list');


            for(let item of userList.children){
                const opt = document.createElement('option');
                opt.innerHTML = item.innerHTML;
                opt.setAttribute("value", item.innerHTML);

                if(item.innerHTML === auth_user){
                    opt.setAttribute('selected', true)
                }

                select.append(opt);
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


            eventh.preventDefault();
            eventh.target.style.outline = '0px';
            if (eventh.target.parentNode.className === 'holderDIV'){
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
            HMContainer.append(getDeleteBtn());


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

            //Putting resize button on holder
            const resizerTL = getResizer('top', 'left');
            const resizerTR = getResizer('top', 'right');
            const resizerBL = getResizer('bottom', 'left');
            const resizerBR = getResizer('bottom', 'right');

            const midBTN = document.createElement('span');
            midBTN.style.width = '5px';
            midBTN.style.height = '5px';
            midBTN.style.display = 'block';
            midBTN.style.position = 'absolute';
            midBTN.style.backgroundColor = '#00aaff';
            midBTN.style.top = '-3px';
            midBTN.style.left = '-15px';

            const holderMenu = getHolderMenu(measure.auth_user);

            holderDIV.append(resizerTL);
            holderDIV.append(resizerTR);
            holderDIV.append(resizerBL);
            holderDIV.append(resizerBR);
            holderDIV.append(holderMenu);

            holderDIV.onfocusin = focusInEvent;

            holderDIV.onresize = (evntt) => {
                console.log('Holder resized')
            }

            holderDIV.onmousedown = holderDIV.addEventListener('mousedown', (event) => {
                dragElementOverPage(event)
            }, false);
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
                        var myDiv =  holderDIV.append(inputField);
                        var myTd  = document.createElement('td');
                        holderDIV.style.width = "100%";
                        holderDIV.style.height = "100%";
                        var holder_obj = '';
                        var genSelect = '<select class="form-select form-select-sm auth-user">';
                        for (var y=0 ; y< holderDIV.children.length; y++){
                            console.log("childY");
                            console.log(holderDIV.children[y]);
                                if(holderDIV.children[y].className === "holder-menu"){
                                    console.log("===");
                                holder_obj = holderDIV.children[y]
                                console.log("holder_obj");
                                console.log(holder_obj.children[0].children.length);
                                for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                    if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                        console.log((holder_obj.children[0].children[c].options[0].value));
                                        for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){
                                            //  genSelect.concat('<option value="'.concat(holder_obj.children[0].children[c].options[k].value).concat('">').concat(holder_obj.children[0].children[c].options[k].value).concat('</option>'));
                                             genSelect = genSelect + '<option value="' + holder_obj.children[0].children[c].options[k].value + '">' + holder_obj.children[0].children[c].options[k].value + '</option>';

                                            console.log(genSelect);

                                        }

                                    }
                                }
                                break;
                            }

                        }
                        genSelect.concat('</select>')
                        var holderMenuStr = '<div class="holder-menu" style=" height: 30px display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
                             + genSelect+
                            '</div>';
                        console.log("event.target.tagName == 'TD'")
                        console.log(inputField);
                        console.log(holderDIV);

                        console.log(myTd);
                        targetTD= event.target

                        var stringToHTML = function (str) {
                                var parser = new DOMParser();
                                var doc = parser.parseFromString(str, 'text/html');
                                return doc.body;
                            };



                        var textArea = '<textarea style="width: 100%; height: 80%; margin: 1%;\
                        font-size: 1em; border: none; resize: none; background-color:\
                        rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow:\
                        overlay;" bold;"></textarea>';
                        var paraArea = '<div contenteditable="true" id="textBox" style="width: 100%; \
                        height: 80%; margin: 1%; font-size: 1em; border: none; \
                        resize: none; background-color: rgba(0, 0, 0, 0);\
                         border-radius: 0px; outline: 0px; overflow: overlay;">\
                         <p>Input Here</p> </div>';



                        var myWDiv = '<div>'+holderMenuStr + '</div>';

                        var td = '<td>'+myWDiv+'</td>';
                        var tr = '<tr>'+td+'</tr>';
                        var table1 = '<table>'+tr+'</table>';
                        var testDiv = document.createElement("div");
                        testDiv.setAttribute("id", "textBox");
                        testDiv.setAttribute("contenteditable", true);
                        testDiv.onclick = ()=>{
                            toogleTxtForm();
                        }
                        var textPara = document.createElement("p");
                        textPara.innerHTML = "Input Here";
                        testDiv.appendChild(textPara);

                        var intendedTd = stringToHTML(table1);
                        console.log("parafiled Indeded");
                        console.log(intendedTd.children[0].rows[0].cells[0]);
                        var cellI = intendedTd.children[0].rows[0].cells[0];
                        cellI.appendChild(testDiv);
                        console.log("CELLI");
                        console.log(cellI);

                        targetTD.replaceWith(cellI);


                        targetTD.replaceWith(cellI);



                    }



                    break;

                case 'TEXT_BUTTON':
                    inputField = getTextField();

                    if (event.target.tagName == 'TD'){
                        var myDiv =  holderDIV.append(inputField);
                        var myTd  = document.createElement('td');
                        holderDIV.style.width = "100%";
                        holderDIV.style.height = "100%";
                        var holder_obj = '';
                        var genSelect = '<select class="form-select form-select-sm auth-user">';
                        for (var y=0 ; y< holderDIV.children.length; y++){
                            console.log("childY");
                            console.log(holderDIV.children[y]);
                            // if (holderDIV.children[y].classList.contains("holder-menu")){
                                if(holderDIV.children[y].className === "holder-menu"){
                                    console.log("===");
                                holder_obj = holderDIV.children[y]
                                console.log("holder_obj");
                                console.log(holder_obj.children[0].children.length);
                                for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                    if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                        console.log((holder_obj.children[0].children[c].options[0].value));
                                        for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){
                                            //  genSelect.concat('<option value="'.concat(holder_obj.children[0].children[c].options[k].value).concat('">').concat(holder_obj.children[0].children[c].options[k].value).concat('</option>'));
                                             genSelect = genSelect + '<option value="' + holder_obj.children[0].children[c].options[k].value + '">' + holder_obj.children[0].children[c].options[k].value + '</option>';

                                            console.log(genSelect);

                                        }

                                    }
                                }
                                break;
                            }

                        }
                        genSelect.concat('</select>')

                        // myTd.append("holderDIV");
                        var holderDIVString = '<div class="holderDIV" data-idd="INPUT_HOLDER" style="border: 1px dashed rgb(255, 191, 0);\
                         position: absolute; overflow: auto; cursor: move; width: inhert; height: inherit; "><div class="holder-menu" \
                          style="position: absolute; height: 30px; min-width: 150px; right: 0px; top: -32px; display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">\
                          <select class="form-select form-select-sm auth-user">\
                            <option value="{{ user }}">{{ user }}</option></select>\
                            <span class="closeBtn" style="text-align: center; font-size: 0.8em; margin: 5px;">\
                                <i class="fas fa-trash" style="color: #000;"></i></span></div>\
                                <textarea style="width: 100%; height: 80%; margin: 1%; font-size: 1em; border: none; resize: none; background-color: rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow: overlay;">\
                                    </textarea></div>';
                        var holderMenuStr = '<div class="holder-menu" style=" height: 30px display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
                             + genSelect+
                            '</div>';



                        console.log("event.target.tagName == 'TD'")
                        console.log(inputField);
                        console.log(holderDIV);

                        console.log(myTd);
                        targetTD= event.target;
                        var stringToHTML = function (str) {
                                var parser = new DOMParser();
                                var doc = parser.parseFromString(str, 'text/html');
                                return doc.body;
                            };
                        var textArea = '<textarea style="width: 100%; height: 80%; margin: 1%;\
                        font-size: 1em; border: none; resize: none; background-color:\
                        rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow:\
                        overlay;" bold;"></textarea>';


                        var myWDiv = '<div>'+holderMenuStr + textArea+ '</div>';
                        var td = '<td>'+myWDiv+'</td>';
                        var tr = '<tr>'+td+'</tr>';
                        var table1 = '<table>'+tr+'</table>'
                        console.log(inputField);
                        var intendedTd = stringToHTML(table1);
                        console.log(intendedTd.children[0].rows[0].cells[0]);
                        var cellI = intendedTd.children[0].rows[0].cells[0];
                        targetTD.replaceWith(cellI);
                        targetTD.replaceWith(cellI);



                    }
                    break;

                case 'QUEST_ITEM':
                    const questNo = event.dataTransfer.getData("item");
                    console.log(questNo);
                    inputField = getQuestionField();
                    break;

                case 'IMG_BUTTON':
                    inputField = getImageField();
                    holderDIV.style.height = '150px';
                    break;

                case 'DATE':
                    holderDIV.style.width = '200px';
                    holderDIV.style.height = '150px';
                    inputField = getDateField2();
                    break;

                case 'SIGN':
                    holderDIV.style.width = '200px';
                    holderDIV.style.height = '100px';
                    inputField = getSignField();
                    // myResizer
                     if (event.target.tagName == 'TD'){
                        console.log("event.target.tagName SIGn== 'TD'")
                        holderDIV.style.display = "none";
                        holderDIV.setAttribute("id", "tempIdHolderDiv");
                        targetChildren = event.target.children;
                        console.log("targetChildren");
                        console.log(targetChildren);
                        targetTD= event.target;

                        var stringToHTML = function (str) {
                                var parser = new DOMParser();
                                var doc = parser.parseFromString(str, 'text/html');
                                // console.log(doc);
                                return doc.body;
                            };
                        var holder_obj = '';
                        var genSelect = '<select class="form-select form-select-sm auth-user">';
                        for (var y=0 ; y< holderDIV.children.length; y++){
                            console.log("childY");
                            console.log(holderDIV.children[y]);
                                if(holderDIV.children[y].className === "holder-menu"){
                                    console.log("===");
                                holder_obj = holderDIV.children[y]
                                console.log("holder_obj");
                                console.log(holder_obj.children[0].children.length);
                                for(var c = 0; c< holder_obj.children[0].children.length; c++ ){
                                    if(holder_obj.children[0].children[c].tagName == "SELECT"){
                                        console.log((holder_obj.children[0].children[c].options[0].value));
                                        for(var k = 0; k< holder_obj.children[0].children[c].options.length; k++ ){
                                             genSelect = genSelect + '<option value="' + holder_obj.children[0].children[c].options[k].value + '">' + holder_obj.children[0].children[c].options[k].value + '</option>';

                                            console.log(genSelect);

                                        }

                                    }
                                }
                                break;
                            }

                        }
                        genSelect = genSelect+'</select>';
                        console.log("GENEGESLECTS");
                        console.log(genSelect);
                        var holderDIVString = '<div class="holderDIV" data-idd="INPUT_HOLDER" style="border: 1px dashed rgb(255, 191, 0);\
                         position: absolute; overflow: auto; cursor: move; width: inhert; height: inherit; "><div class="holder-menu" \
                          style="position: absolute; height: 30px; min-width: 150px; right: 0px; top: -32px; display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">\
                          <select class="form-select form-select-sm auth-user">\
                            <option value="{{ user }}">{{ user }}</option></select>\
                            <span class="closeBtn" style="text-align: center; font-size: 0.8em; margin: 5px;">\
                                <i class="fas fa-trash" style="color: #000;"></i></span></div>\
                                <textarea style="width: 100%; height: 80%; margin: 1%; font-size: 1em; border: none; resize: none; background-color: rgba(0, 0, 0, 0); border-radius: 0px; outline: 0px; overflow: overlay;">\
                                    </textarea></div>';

                        var holderMenuStr = '<div class="holder-menu" style=" height: 30px display: block; border-radius: 0%; background-color: rgba(129, 129, 129, 0.5);">'
                             + genSelect+
                            '</div>';

                                console.log("holderMenuStr");
                        console.log(holderMenuStr);


                        var divHolder =  document.createElement("div");
                        var tempTd = document.createElement("td");
                        tempTd.setAttribute("id","tempId");
                        divHolder.setAttribute("id", "myDivholder");

                        var iElement = '<i class="fa fa-pencil"> </i>'
                        var bElement = '<button class="btn-secondary" style="width: 90%; height: 90%; display: flex; cursor: pointer; justify-content: center; align-items: center; border-width: 2px; border-style: outset; outline: 0px;">Signature...<i class="fa fa-pencil"></i></button>'
                        var aElement = '<div><div><a style="width: 100%; height: 90%; display: flex; cursor: pointer; justify-content: center; align-items: center;">'+ iElement +'</a></div></div>'
                        var myWDiv = '<div class="mySecDivHolder">'.concat(holderMenuStr).concat(bElement).concat( '</div>');
                        console.log("MyWDIV");
                        console.log(myWDiv);
                        $(myWDiv).clone(true,true).appendTo(event.target);
                       document.querySelectorAll(".btn-secondary").forEach(e => e.addEventListener('dblclick', addCanEditor, false));


                    }
                    break;


                case 'TABLE':
                    holderDIV.classList.add("tableInput");
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

                    column_length = table.rows[1].cells.length;
                    console.log("column_length");
                    console.log(column_length);
                    // for every td
                    console.log("table.rows[1].cells");
                    console.log(table.rows[1].cells);
                    for(var t = 0; t<row_length; t++ ){
                        for(var g = 0; g<column_length; g++){
                            var idx = "row".concat(t.toString()).concat("column").concat(g.toString());
                            var tempElement  = {}
                            console.log("Text Area table.rows[t].cells[g].children[0].children[0]")
                            console.log(table.rows[t].cells[g].children[0]);
                            //Text Area
                            if(table.rows[t].cells[g].children[0].children[0].children.length){
                            txtElementLength = table.rows[t].cells[g].children[0].children[0].children.length
                            for(var b = 0; b <txtElementLength; b++){
                                if(table.rows[t].cells[g].children[0].children[0].children[b].tagName == "SELECT"){
                                    var miniauthUser = table.rows[t].cells[g].children[0].children[0].children[b].value
                                    tempElement["auth_user"]= miniauthUser;
                                    tempElement["type"]= "TEXT_INPUT";
                                    console.log("miniauthUser");
                                    console.log(miniauthUser);
                                }
                                if(table.rows[t].cells[g].children[0].children[0].children[b].tagName == "TEXTAREA"){
                                    var textInput = table.rows[t].cells[g].children[0].children[0].children[b].value
                                    console.log("textInput");
                                    console.log(textInput);
                                    tempElement["data"]= textInput;

                                }
                            }
                                console.log("TEMP ELEMENT");
                                console.log(tempElement);
                                elem.data[idx]=tempElement;
                            }


                            console.log("table td children[0] children length");
                            console.log(table.rows[t].cells[g].children[0].children[0].children.length);
                            console.log("table td children children[0].children[0].children");
                            console.log(table.rows[t].cells[g].children[0].children[0].children);
                            table.rows[t].cells[g].children[0].children[0].children.length

                        //FOR THE SIGNATURE
                        if (table.rows[t].cells[g].children.length >1){
                            console.log("table td children children length");
                            console.log(table.rows[t].cells[g].children[1].children.length);
                            console.log("table td children");
                            console.log(table.rows[t].cells[g].children[1].children);
                            signElementsLength = table.rows[t].cells[g].children[1].children.length;
                            for (var c = 0; c < signElementsLength; c++){
                                if(table.rows[t].cells[g].children[1].children[c].tagName === "DIV"){
                                    if(table.rows[t].cells[g].children[1].children[c].className == "holder-menu"){
                                        //Access Children
                                      var miniAuthUserSign =  table.rows[t].cells[g].children[1].children[c].children[0].children[0].value
                                      console.log("miniAuthUserSign");
                                      console.log(miniAuthUserSign);
                                      tempElement["auth_user"]= miniAuthUserSign;
                                      tempElement["type"]= "SIGN";


                                    }

                                }
                                if(table.rows[t].cells[g].children[1].children[c].tagName === "BUTTON"){
                                    console.log("got to the button");
                                    tempElement["data"]= "";
                                }

                            }
                            console.log("TEMP ELEMENT SIGN");
                            console.log(tempElement);
                            elem.data[idx]=tempElement;

                            }
                        }


                    }
                                            tables_collected.push(elem)

                    }

                }
                    console.log("Main Tables==========");
                    console.log(tables_collected);

                      return "elem";
            }
        function saveDocument(){
            var elementTables = savingTableData();



            const status = 'REQUEST_IN_PROGRESS';

            const pdfFile = document.getElementById('pdf-file');
            contentFile = [];

            for( child of pdfFile.children ){
                const sel = child.getElementsByClassName('auth-user');
                // const sel = child.getElemenstClassName("")
                const authUser = sel[0].value;
                let elem = {}

                console.log('child', child)

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


                const inputElements = child.getElementsByTagName("input");
                if( inputElements.length ){
                    if ( inputElements[0].type === 'text') {
                        elem = {
                            width: child.style.width,
                            height: child.style.height,
                            top: child.style.top,
                            left: child.style.left,
                            type:'DATE_INPUT',
                            data: inputElements[0].value,
                            auth_user: authUser
                        }
                    }
                    console.log('inputElement', inputElement[0])
                    if ( inputElements[0].type === 'file' ) {
                        console.log('Catching Empty image..')
                        elem = {
                            width: child.style.width,
                            height: child.style.height,
                            top: child.style.top,
                            left: child.style.left,
                            type:'IMAGE_INPUT',
                            data: '',
                            auth_user: authUser
                        }
                    }

                }

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

                const emptyImage = child.getElementsByTagName("input");
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



                contentFile.push(elem);
            }

            return contentFile;
        }

        //rendering file after getting file data
        function renderFile(data){
            const content = JSON.parse(data);
            const pdfFile = document.getElementById('pdf-file');
            const currUser = document.getElementById('current-user')
            //console.log(pdfFile.children)

            if( pdfFile.children.length ){
                const noOfItems = pdfFile.children.length
                for(let i = 0; i < noOfItems ; i++){
                    pdfFile.removeChild(pdfFile.children[0]);
                }
            }

            console.log(typeof data);
            console.log(typeof content)

            for( let item of content ){
                const holder = getHolderDIV(item);
                let inputField = undefined;

                if( item.type === "TEXT_INPUT" ){
                    inputField = getTextField();
                    inputField.value = item.data;

                }

                if( item.type === "DATE_INPUT" ){
                    inputField = getDateField();
                    inputField.value = item.data;
                }

                if ( item.type === 'IMAGE_INPUT' ) {
                    inputField = getImageField();

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

                console.log(item.type)
                if ( item.auth_user != currUser.innerHTML ){
                    inputField.setAttribute('disabled', true);
                }

                holder.append(inputField)
                pdfFile.append(holder);
            }
        }

