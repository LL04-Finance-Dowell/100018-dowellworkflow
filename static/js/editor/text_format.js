// New Fomart Code
//https://stackoverflow.com/questions/15371918/mismatched-anonymous-define-module
define('moduleOne',function() {
    return { helloWorld: function() { console.log('hello world!') } };
})

 define('moduleTwo', function() {
      return { helloWorld2: function() { console.log('hello world again!') } };
})



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



var toolBoxTools = document.getElementById("toolbox-tools");

toolBoxTools.style.display = "none";

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
        //     console.log("in Toggele Txtx  FOrma");
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



export { toogleTxtFormBlock, initDoc, formatDoc, validateMode, setDocMode, printDoc};
