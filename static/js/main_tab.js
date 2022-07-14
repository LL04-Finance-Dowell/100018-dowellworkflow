//bootstable.js
/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/
"use strict";
  //Global variables
  var params = null;  		//Parameters
  var colsEdi =null;
  var newColHtml = '<div class="btn-group pull-right">'+
'<button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="rowEdit(this);">' +
'edit<span class="glyphicon glyphicon-pencil" > </span>'+
'</button>'+
'<button id="bElim" type="button" class="btn btn-sm btn-default" onclick="rowElim(this);">' +
'delete<span class="glyphicon glyphicon-trash" > </span>'+
'</button>'+
'<button id="bAcep" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowAcep(this);">' + 
'ok <span class="glyphicon glyphicon-ok" > </span>'+
'</button>'+
'<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowCancel(this);">' + 
'remove<span class="glyphicon glyphicon-remove" > </span>'+
'</button>'+
    '</div>';
    var newRowHtml = '<div class="btn-group pull-right">'+
'<button id="cDeleteColumn" type="button" class="btn btn-sm btn-default" onclick="deleteColumn(this);">' +
'Delete Column<span class="glyphicon glyphicon-pencil" > </span>'+
'</button>'+
    '</div>';
    
  var colEdicHtml = '<td class="crud_buttons" name="buttons">'+newColHtml+'</td>'; 
  var colDelHtml = '<td class="del_button" name="buttons">'+newRowHtml+'</td>'; 
  var myTabId = ""
  $.fn.SetEditable = function (options) {
    var defaults = {
        columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
        $addButton: null,        //Jquery object of "Add" button
        onEdit: function() {},   //Called after edition
		onBeforeDelete: function() {}, //Called before deletion
        onDelete: function() {}, //Called after deletion
        onAdd: function() {}     //Called when added a new row
    };
    params = $.extend(defaults, options);
    // this.find('thead tr').append('<td name="buttons"><span class="glyphicon glyphicon-thumbs-up"></span></td>');  //encabezado vacío
    this.find('thead tr').append(colEdicHtml);
    this.find('tbody tr').append(colEdicHtml);
    var $tabedi = this;   //Read reference to the current table, to resolve "this" here.
    //Process "addButton" parameter
    // var myTabId = "";
    var myTab = "";
    var cols_length = "";
    console.log("THIS");
    console.log($tabedi.attr("id"));
    myTabId = $tabedi.attr("id");
    console.log("Table ID again");
    console.log(myTabId);
    myTab = document.getElementById(myTabId);
    console.log("Table ID again2");
    console.log(myTabId);
    console.log(myTab);
    var row1  = myTab.insertRow(0);//kdkd
    cols_length = myTab.rows[1].cells.length; 
    console.log("cols_length");
    console.log(cols_length);
    // for (var i in myTab.rows[0].cells){
    console.log("Table ID again3");
    console.log(myTabId);
    for (var i = 0; i < (cols_length-1);i++){
        // var row1;
        row1.insertCell(i);
        row1.cells[i].innerHTML = newRowHtml;
        
    }

	
    
    console.log("Table ID again4");
    console.log(myTabId);

    if (params.$addButton != null) {
        //Se proporcionó parámetro
        params.$addButton.click(function() {
            rowAddNew($tabedi.attr("id"));
        });
    }
    //Process "columnsEd" parameter
    if (params.columnsEd != null) {
        //Extract felds
        colsEdi = params.columnsEd.split(',');
    }
  };
  console.log("Table ID again5");
    console.log(myTabId);
  $("#addNewColumn").click(function(){
    console.log("Table ID again6");
    console.log(myTabId);
    addNewestColumn(myTabId);
});


 

//   var tdS = document.getElementsByTagName("TD");
                    
//   // inputField.style.zIndex = "200";
//   // editButtonField = getEditTableBtn();
//   tdS.ondragover = (event) => {
//       event.preventDefault();
//       console.log("clicked");
//           event.target.style.border = '1px solid yellow';
      
//   }

// tdS.ondrop = (event) => {
//   event.preventDefault();
//   event.target.style.border = '0px solid red';
// }



//   if (params.$addNewColumn != null) {
//     //Se proporcionó parámetro
//     params.$addNewColumn.click(function() {
//         addNewestColumn($tabedi.attr("id"));
//     });
// };

function IterarCamposEdit($cols, tarea) {
//Itera por los campos editables de una fila
    var n = 0;
    $cols.each(function() {
        n++;
        if ($(this).attr('name')=='buttons') return;  //excluye columna de botones
        if (!EsEditable(n-1)) return;   //noe s campo editable
        tarea($(this));
    });
    
    function EsEditable(idx) {
    //Indica si la columna pasada está configurada para ser editable
    // Indicates if the passed column is set to be editable
        if (colsEdi==null) {  //no se definió
            return true;  //todas son editable
        } else {  //hay filtro de campos
//alert('verificando: ' + idx);
            for (var i = 0; i < colsEdi.length; i++) {
              if (idx == colsEdi[i]) return true;
            }
            return false;  //no se encontró
        }
    }
}
function FijModoNormal(but) {
    $(but).parent().find('#bAcep').hide();
    $(but).parent().find('#bCanc').hide();
    $(but).parent().find('#bEdit').show();
    $(but).parent().find('#bElim').show();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', '');  //quita marca
}
function FijModoEdit(but) {
    $(but).parent().find('#bAcep').show();
    $(but).parent().find('#bCanc').show();
    $(but).parent().find('#bEdit').hide();
    $(but).parent().find('#bElim').hide();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', 'editing');  //indica que está en edición
}
function ModoEdicion($row) {
    if ($row.attr('id')=='editing') {
        return true;
    } else {
        return false;
    }
}
function rowAcep(but) {
//Acepta los cambios de la edición

//Accept the edition changes 
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
      var cont = $td.find('input').val(); //lee contenido del input
//     var cont = $td.find('input');//.css({"color": "red", "border": "2px solid red"}); //lee contenido del input
// console.log("cont");
// console.log(cont.children());
      $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
    params.onEdit($row);
}
function rowCancel(but) {
//Rechaza los cambios de la edición
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
        var cont = $td.find('div').html(); //lee contenido del div
        $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
}
function rowEdit(but) {  //Inicia la edición de una fila
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    var bold1 = $( "#bold1" );
    var italic1 = $("#italic1");
    if (ModoEdicion($row)) return;  //It is already in editing
    //Pone en modo de edición
    IterarCamposEdit($cols, function($td) {  //iterate through columns
        var cont = $td.html(); //read content
        var div = '<div style="display: none;">' + cont + '</div>';  //save content
        var input = '<input class="form-control input-sm"  value="' + cont + '">';
        var tempDiv = 
       
        $( "#bold1" ).bind( "click", function() {
            // alert( $( this ).text() );
            console.log("Bold1 is clicked Jqueyr");
        
            if(this.checked){
                console.log("Is checked apparnebt");
                $('.input-sm').each(function(){
                    console.log("each");
                    var curInput = this;
                    curInput.addEventListener('input', event => {
                        //handle click
                        console.log("event.bolllldd.value");
                        curInput.style.fontWeight = "bold";
                        
                        input = curInput;
                        console.log(input);
                       
                    })
        
                });
            }
          });
          $( "#italic1" ).bind( "click", function() {
            // alert( $( this ).text() );
            console.log("Bolitalicd1 is clicked Jqueyr");
        
            if(this.checked){
                console.log("Is checked apparnebt");
                $('.input-sm').each(function(){
                    console.log("each");
                    var curInput = this;
                    curInput.addEventListener('input', event => {
                        //handle click
                        console.log("event.Italic.value");
                        curInput.style.fontStyle = "italic";
                    })
        
                });
            }
          });
          $( "#underline1" ).bind( "click", function() {
            // alert( $( this ).text() );
            console.log("Bold1 is clicked Jqueyr");
        
            if(this.checked){
                console.log("Is checked apparnebt");
                $('.input-sm').each(function(){
                    console.log("each");
                    var curInput = this;
                    curInput.addEventListener('input', event => {
                        //handle click
                        console.log("event.bolllldd.value");
                        curInput.style.textDecoration = "underline";
                        console.log(curInput);
                        input = curInput;
                       
                    })
        
                });
            }
          });
          console.log("div + input");
          var myHtml =  $.parseHTML(input);
          console.log("HTML");
        console.log(myHtml);



        // bold1.addEventListener("click",(eventCH)=>{
        //     if (eventCH.target.checked){
        //     // textBox1.style.fontWeight = "bold";
        //     console.log("Bold1 is clicked");

        //     document.querySelectorAll('.input-sm').forEach(item => {
        //     item.addEventListener('input', event => {
        //         //handle click
        //         console.log("event.target.value");
        //         item.style.fontWeight = "bold";
        //     })
        //     })



        // //     tdInputs.addEventListener("input",(event) => {
        // //         console.log("event.target.value");
        // //         this.style.fontWeight = "bold";
        // // }, false);

        // }

        // });



//         italic1.addEventListener("click",(eventCH)=>{
//             if (eventCH.target.checked){
//                 console.log("italic is clicked");
//             // textBox1.style.fontWeight = "bold";
//         //     tdInputs.addEventListener("input",(event) => {
//         //         console.log("event22222.target.value");
//         //         this.style.color = "red";
//         // }, false);


//         document.querySelectorAll('.input-sm').forEach(item => {
//             item.addEventListener('input', event => {
//                 //handle click
//                 console.log("event.target22222222222222222.value");
//                 item.style.color = "red";
//             })
//             })
//     }

// });


        // $td.html( data+input);  //fix content
        console.log("font weignt"); 
        console.log(myHtml);
        // console.log($td);
        console.log("font ssss");
        // $td.append( myHtml);  //fix content
        $td.prepend(myHtml);
        console.log($td); 
        // $td.style.fontWeight = myHtml[0].style.fontWeight;

        // $("#makeTBold").click(function(){
        //     $td.css({"font-weight": "bold"})
        //     // console.log("get selection");
        //     // console.log(window.getSelection());
            
        // });
        
    });
    FijModoEdit(but); //Fix Edit mode
}
function rowElim(but) {  //Delete the current row
    var $row = $(but).parents('tr');  //access the row
    params.onBeforeDelete($row);
    $row.remove();
    params.onDelete();
}
function rowAddNew(tabId) {  //Agrega fila a la tabla indicada.
var $tab_en_edic = $("#" + tabId);  //Table to edit
    var $filas = $tab_en_edic.find('tbody tr');
    if ($filas.length==0) {
        //No hay filas de datos. Hay que crearlas completas
       // There are no rows of data. You have to create them complete
        var $row = $tab_en_edic.find('thead tr');  //header
        var $cols = $row.find('th');  //read fields
        //build html
        var htmlDat = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                // It is column of buttons
                htmlDat = htmlDat + colEdicHtml;  //agrega botones
            } else {
                htmlDat = htmlDat + '<td></td>';
            }
        });
        $tab_en_edic.find('thead').append('<tr>'+htmlDat+'</tr>');
        $tab_en_edic.find('tbody').append('<tr>'+htmlDat+'</tr>');

    } else {
        //Hay otras filas, podemos clonar la última fila, para copiar los botones
        //There are other rows, we can clone the last row, to copy the buttons
        var $ultFila = $tab_en_edic.find('tr:last');
        $ultFila.clone().appendTo($ultFila.parent());  
        $ultFila = $tab_en_edic.find('tr:last');
        var $cols = $ultFila.find('td');  //lee campos
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
            } else {
                $(this).html('');  //limpia contenido
            }
        });
    }
	params.onAdd();
}

function addNewestColumn(tabId){
    console.log("newest column tabId = ".concat(tabId))
    // var tab_to_edit = $("#" + tabId);
    var tab_to_edit = document.getElementById(tabId);

    console.log("Taba to edit");
    console.log(tab_to_edit.rows);
    var newColAdd = '<td> </td>';
    var tr_length = tab_to_edit.rows[1].cells.length
    var table_length = tab_to_edit.rows.length;
    // var rowFirst = tab_to_edit.rows[0].insertCell(tr_length-1);
    
    for (var y = 0; y < table_length; y++){
        // changedTable.rows[y].deleteCell(tr_length-1);
        tab_to_edit.rows[y].insertCell(tr_length-1);
        if (y == 0){
            tab_to_edit.rows[y].cells[tr_length-1].innerHTML = newRowHtml;
        }
    //    changedTable.rows[y].deleteCell(tr_length-2);
    }
    
    
}
function deleteColumn(but) {  //Delete the current row
    // var $row = $(but).parents('tr');  //access the row
    // params.onBeforeDelete($row);
    // $row.remove();
    // params.onDelete();
    var cellIndx = but.parentNode.parentNode.cellIndex
    var tableI = but.parentNode.parentNode.parentNode.parentNode.parentNode
    console.log("DeleteColumn This");
    console.log(cellIndx);
    console.log("Table This");
    console.log(tableI.rows.length);
    var rows_len = tableI.rows.length
    for (var t = 0; t < rows_len; t ++ ){
        console.log(tableI.rows[t].cells[cellIndx]);
        tableI.rows[t].deleteCell(cellIndx);

    }

}
function makeBold(but){
    console.log("Making bold for this")
    console.log(but);
    document.getElementById('b').classList.toggle('bold'); 
    console.log("Make bold bold");
    var highLight =  window.getSelection();

    var span = '<span style="font-weight:bold;">' + highLight + '</span>';
    console.log("span");
    console.log(span);
    document.body.innerHTML = document.body.innerHTML.replace(window.getSelection(), span);
}

function TableToCSV(tabId, separator) {  //Convierte tabla a CSV
    var datFil = '';
    var tmp = '';
	var $tab_en_edic = $("#" + tabId);  //Table source
    $tab_en_edic.find('tbody tr').each(function() {
        //Termina la edición si es que existe
        if (ModoEdicion($(this))) {
            $(this).find('#bAcep').click();  //acepta edición
        }
        var $cols = $(this).find('td');  //lee campos
        datFil = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
            } else {
                datFil = datFil + $(this).html() + separator;
            }
        });
        if (datFil!='') {
            datFil = datFil.substr(0, datFil.length-separator.length); 
        }
        tmp = tmp + datFil + '\n';
    });
    return tmp;
}



// //apply
// $(".table-list").SetEditable({
//         $addButton: $('#add')
//     });

