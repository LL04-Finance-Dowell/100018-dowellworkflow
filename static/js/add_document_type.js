//for workflow form Elements script



const addInternalStep = document.getElementById('add_internal_step');
const addExternalStep = document.getElementById('add_external_step');


const createRowInTable = (item, list, table) => {
    // creating row in a table
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.setAttribute("scope", "row");
    th.innerHTML = list.indexOf(item) + 1;
    const td1 = document.createElement('td');
    td1.innerHTML = item.name;
    const td2 = document.createElement('td');
    td2.innerHTML = item.authority;

    th.setAttribute("class", "text-center");
    td1.setAttribute("class", "text-center");
    td2.setAttribute("class", "text-center");

    const rm_link = document.createElement('a');
    rm_link.className = "btn btn-outline-danger btn-sm rounded-0 remove_btn";
    rm_link.innerHTML = 'x';
    rm_link.style.borderRadius = '50%';

    const td3 = document.createElement('td');
    td3.append(rm_link);
    td3.setAttribute("class", "text-center")

    tr.append(th);
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    table.append(tr);

    rm_link.onclick = ( event ) => {
        console.log('remove btn clicked for', item);
        //look for element in list
        let found =  list.find(item => (item.name === event.target.parentNode.parentNode.childNodes[1].innerHTML) && (item.authority === event.target.parentNode.parentNode.childNodes[2].innerHTML) );

        if( found != undefined ){
            const removedElement = list.splice(list.indexOf(found), 1);
            table.innerHTML = '';
        }

        if( list.length === 0 ){
            const td = document.createElement('td');
            td.setAttribute("colspan", 4);
            td.className = "text-center";
            td.innerHTML = "No Steps";
            table.append(td);
        } else {
            list.map((item, index, list) => createRowInTable(item, list, table));
        }
    }
}

function submit_step(list, type=""){
    document.getElementById( type + '_step_form_error' ).innerHTML = '';
    document.getElementById( type + 'StepName').style.borderColor = 'initial';
    document.getElementById(type + 'authorityID').style.borderColor = 'initial';

    const stepObj = {
        name: document.getElementById( type + 'StepName').value,
        authority: document.getElementById(type + 'authorityID').value
    }

    document.getElementById( type + 'StepName').value = ''
    document.getElementById(type + 'authorityID').value = "None"

    if((stepObj.name === '') || (stepObj.authority === "None")){
        document.getElementById( type + '_step_form_error' ).innerHTML = 'Both fields are required.';
        document.getElementById( type + 'StepName').style.borderColor = '#d00';
        document.getElementById(type + 'authorityID').style.borderColor = '#d00';

    } else {

        let found =  list.find(item => (item.name === stepObj.name) && (item.authority === stepObj.authority)
        );

        if (found === undefined ){
            list.push(stepObj);
            const listElement = document.getElementById(type + '_table');
            listElement.innerHTML = '';
            list.map((item, index, list) => createRowInTable(item, list, listElement));

        } else {
          document.getElementById( type + '_step_form_error' ).innerHTML = 'Already added.'
        }
    }
}




const disableButton = (btn) => {  btn.disabled = true;   btn.style.opacity = '0.5'; };
const enableButton = (btn) => {  btn.disabled = false;   btn.style.opacity = '1';   };

addInternalStep.onclick = function(e){
  disableButton(addInternalStep);
  submit_step( internalWFList, type="internal");
  enableButton(addInternalStep) ;
}
addExternalStep.onclick = function(e){
  disableButton(addInternalStep);
  submit_step(externalWFList, type="external");
  enableButton(addInternalStep);
}



// submit button on Document Type form
const addDocumentType = document.getElementById('addDocumentType');
addDocumentType.onclick = function(e){
  document.getElementById('documentType-title').style.borderColor = 'initial';

  if(!document.getElementById('documentType-title').value){
    document.getElementById('docTypeFieldError').innerHTML = "This field is required.";
    document.getElementById('documentType-title').style.borderColor = "#d00";
    //if document title is empty.
  } else {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let reuestURL = '';

    if( new_entry ){
        requestURL = '/workflow/create-document-type/';
        const org = document.getElementById('org_id');
        requestBody = {
            title: document.getElementById('documentType-title').value,
            internal: internalWFList,
            external: externalWFList,
            org_id: org.innerHTML
        }
    } else {
        requestURL = '/workflow/wf_api/update-wf/';
        requestBody = {
            id: update_ID ,
            title: document.getElementById('documentType-title').value,
            internal: internalWFList,
            external: externalWFList
        }
    }

    const createDocumentTypeRequest = new Request(requestURL, {headers: {'X-CSRFToken': csrftoken}} );

    document.getElementById('documentType-title').value = '';

    fetch(createDocumentTypeRequest, {
        method: 'POST',
        mode: 'same-origin',
        body: JSON.stringify(requestBody)
    }).then(async function(response) {
        const documentTypeObject = await response.json();

        document.getElementById('close-modal').click();

        const selectField = document.getElementById('id_document_type');

        if( new_entry ) {
            if(selectField) {
                const option = document.createElement('option');
                option.setAttribute('value', documentTypeObject.id);
                option.innerHTML = documentTypeObject.title;

                selectField.append(option);
                selectField.value = option.value;
                selectField.onchange()
            } else {
                const tbody = document.getElementById('tbody_dt');

                const tr = document.createElement('tr');
                tr.setAttribute('data-id', documentTypeObject.id);

                const th = document.createElement('th');
                /* add loop counter to th element */
                th.innerHTML = documentTypeObject.id;
                tr.append(th);

                const td1 = document.createElement('td');
                td1.innerHTML = documentTypeObject.title;
                tr.append(td1);

                /*'internal_work_flow': internalWF, 'external_work_flow': externalWF*/
                const td2 = document.createElement('td');
                let textContent = ''

                const contentIWF = document.createElement('ul')
                if (documentTypeObject.internal_work_flow) {
                    let con = ''
                    for(step of documentTypeObject.internal_work_flow.steps){
                        con += step.name + ' - ' + step.authority + ',';

                        const li = document.createElement('li');
                        li.innerHTML = step.name + ',' + step.authority;
                        contentIWF.append(li);
                    }
                    textContent = con
                } else {
                    textContent = 'No internal workflow'
                }

                td2.innerHTML = textContent
                tr.append(td2);

                const td3 = document.createElement('td');
                textContent = '';
                const contentEWF = document.createElement('ul')
                if (documentTypeObject.external_work_flow) {
                    let con = ''
                    for(step of documentTypeObject.external_work_flow.steps){
                        con += step.name + ' - ' + step.authority + ',';
                        const li = document.createElement('li');
                        li.innerHTML = step.name + ',' + step.authority;
                        contentEWF.append(li)
                    }
                    textContent = con
                } else {
                    textContent = 'No external workflow'
                }

                td3.innerHTML = textContent
                tr.append(td3)


                const td4 = document.createElement('td');

                // content div for new entry used by update btn
                const contentDIV = document.createElement('div');
                contentDIV.style.display = 'none !important';
                contentDIV.className = 'contentDIV';

                const contentTitle = document.createElement('div');
                contentTitle.innerHTML = documentTypeObject.title

                contentDIV.append(contentTitle);
                contentDIV.append(contentIWF)
                contentDIV.append(contentEWF)

                const ulink = document.createElement('a');
                ulink.className = "btn btn-outline-secondary btn-sm up-wf";
                ulink.innerHTML = "Update";

                td4.append(contentDIV);
                td4.append(ulink);
                tr.append(td4);

                ulink.onclick = (e) => {
                    const this_id = e.target.parentNode.parentNode.dataset.id;
                    const dataHTML = e.target.parentNode.children[0];

                    new_entry = false;
                    update_ID = this_id;
                    targetRowElement = e.target.parentNode.parentNode;

                    if(internalWFList.length != 0){
                        while(internalWFList.length > 0){
                            internalWFList.pop()
                        }
                    }
                    if(externalWFList.length != 0){
                        while(externalWFList.length > 0){
                            externalWFList.pop()
                        }
                    }

                    for( let i = 0; i < dataHTML.children[1].children.length ; i++){
                        let nm_auth = dataHTML.children[1].children[i].innerHTML.split(',');
                        let step = {
                            name: nm_auth[0],
                            authority: nm_auth[1]
                        }
                        internalWFList.push(step)
                    }

                    for( i = 0; i < dataHTML.children[2].children.length ; i++){
                        let nm_auth = dataHTML.children[2].children[i].innerHTML.split(',');
                        let step = {
                            name: nm_auth[0],
                            authority: nm_auth[1]
                        }
                        externalWFList.push(step)
                    }

                    document.getElementById('add-new-dt').click();

                    const dtTitle = document.getElementById('documentType-title');
                    dtTitle.value = dataHTML.children[0].innerHTML;

                    const internal_table = document.getElementById('internal_table');
                    internal_table.innerHTML = ''

                    internalWFList.map((item, index, list) => createRowInTable(item, list, internal_table));

                    const external_table = document.getElementById('external_table');
                    external_table.innerHTML = ''

                    externalWFList.map((item, index, list) => createRowInTable(item, list, external_table));

                }



                const td5 = document.createElement('td');
                const rlink = document.createElement('a');
                rlink.className = "btn btn-outline-danger btn-sm rm-wf";
                rlink.innerHTML = "Remove";

                td5.append(rlink);
                tr.append(td5);

                tbody.append(tr);

                rlink.onclick =  (e) => {
                    const this_id = e.target.parentNode.parentNode.dataset.id;

                    /* making remove request */
                    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                    const removeDTRequest = new Request('/workflow/wf_api/delete-wf/', {headers: {'X-CSRFToken': csrftoken}} );
                    requestBody = {
                      id: this_id
                    }

                    fetch(removeDTRequest, {
                        method: 'DELETE',
                        mode: 'same-origin',
                        body: JSON.stringify(requestBody)
                    }).then(async function(response) {
                        const responseJSON = await response.json();
                        console.log(responseJSON);
                        e.target.parentNode.parentNode.remove()
                    });

                }
            }
        } else {

            //title in target row
            targetRowElement.children[1].innerHTML = documentTypeObject.title

            // internal steps in target row
            let textContent = ''
            const contentIWF = document.createElement('ul');
            if (documentTypeObject.internal_work_flow) {
                let con = ''
                for(step of documentTypeObject.internal_work_flow.steps){
                    con += step.name + ' - ' + step.authority + ',';
                    const li = document.createElement('li');
                    li.innerHTML = step.name + ',' + step.authority;
                    contentIWF.append(li)
                }
                textContent = con
            } else {
                textContent = 'No internal workflow'
            }

            targetRowElement.children[2].innerHTML = textContent

            // external steps in target row
            textContent = ''
            const contentEWF = document.createElement('ul')
            if (documentTypeObject.external_work_flow) {
                let con = ''
                for(step of documentTypeObject.external_work_flow.steps){
                    con += step.name + ' - ' + step.authority + ',';
                    const li = document.createElement('li');
                    li.innerHTML = step.name + ',' + step.authority;
                    contentEWF.append(li)
                }
                textContent = con
            } else {
                textContent = 'No external workflow'
            }

            targetRowElement.children[3].innerHTML = textContent

            // content div for new entry used by update btn
            const contentDIV = document.createElement('div');
            contentDIV.style.display = 'none !important';
            contentDIV.className = 'contentDIV';

            const contentTitle = document.createElement('div');
            contentTitle.innerHTML = documentTypeObject.title

            contentDIV.append(contentTitle);
            contentDIV.append(contentIWF)
            contentDIV.append(contentEWF)


            targetRowElement.children[4].replaceChild(contentDIV, targetRowElement.children[4].children[0])

        }

    });

  }
}




