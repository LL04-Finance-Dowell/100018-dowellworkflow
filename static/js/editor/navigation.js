$(function(){
let currentURL=location.protocol + '//' + location.host + location.pathname
let currentURLHash = currentURL +location.hash
 console.log("currentUrl");
//  $("#allDash").click(function(e) {
//     e.preventDefault();
//     console.log("ALLLLLLLL");
// });
 if (currentURL == "https://100018.pythonanywhere.com/editor/get-dashboard/"){
     $("#dashb").addClass('active');
 }
 if(currentURL == "https://100018.pythonanywhere.com/editor/get-status/"){
     $("#dashstatus").addClass('active');
 }
 if(currentURLHash == "https://100018.pythonanywhere.com/editor/get-status/#all"){
     $("#dashstatus").addClass('active');
      $( "#all" ).click();
 }
 if(currentURLHash == "https://100018.pythonanywhere.com/editor/get-status/#complete"){
     $( document ).ready(function() {
    console.log( "ready!" );
    $("#dashstatus").addClass('active');
    //   $( "#complete" ).click();
    $( "#complete" ).trigger( "hover" );
      $( "#complete" ).trigger( "click" );
});

 }
 if(currentURLHash == "https://100018.pythonanywhere.com/editor/get-status/#internalIcomplete"){
     $("#dashstatus").addClass('active');
      $( "#internalIcomplete" ).click();
 }
 if(currentURLHash == "https://100018.pythonanywhere.com/editor/get-status/#notInWorkFlow"){
     $("#dashstatus").addClass('active');
      $( "#notInWorkFlow" ).click();
 }

 console.log(currentURL);
 console.log(currentURLHash);
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

$(window).resize(function(e) {
  if($(window).width()<=768){
    $("#wrapper").removeClass("toggled");
  }else{
    $("#wrapper").addClass("toggled");
  }
});
 $('.nav-link-dash>a').click(function(e) {
    console.log("nav-link a");
        $('li.nav-link-dash.active').removeClass('active');

        var $parent = $(this).parent();
        $parent.addClass('active');
        // e.preventDefault();
    });
});

