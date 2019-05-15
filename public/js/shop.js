$(document).ready(() => {
	/** On page load, plays avatar animation */
	window.onload = function() {     
		$('#avatar').toggleClass('bounceIn');
  };
  
  //hiding 
            $("#platCont").css("display", "none");
            $("#platCont.carousel-item").css("display", "none");
           $("#platformContainer.carousel").css("display", "none");      
          
            $("#backCont").css("display", "none");
            $("#backCont.carousel-item").css("display", "none");
            $("#backgroundContainer.carousel").css("display", "none");


     $(".category").find( ".avatar").click(() => {   
     
            $("#acCont").css("display", "block");
           $("#acCont.carousel-item").css("display", "block");
            $("#avatarContainer.carousel").css("display", "block");
          
            $("#platCont").css("display", "none");
           $("#platCont.carousel-item").css("display", "none");
            $("#platformContainer.carousel").css("display", "none");      
          
            $("#backCont").css("display", "none");
           $("#backCont.carousel-item").css("display", "none");
            $("#backgroundContainer.carousel").css("display", "none");

            $( "#avatarContainer.carousel" ).trigger( "click" );
            $( "#acCont.carousel-item.active" ).trigger( "click" );

      });
      
    $(".category").find( ".platform").click(() => {
            $("#acCont").css("display", "none");
            $("#acCont.carousel-item").css("display", "none");
            $("#avatarContainer.carousel").css("display", "none");

            $("#platCont").css("display", "block");
            $("#platCont.carousel-item").css("display", "block");
           $("#platformContainer.carousel").css("display", "block");


            $("#backCont").css("display", "none");
            $("#backCont.carousel-item").css("display", "none");
            $("#backgroundContainer.carousel").css("display", "none");           

            $( "#platformContainer.carousel" ).trigger( "click" );
            $( "#platCont.carousel-item.active" ).trigger( "click" );
      });
      
      
     $(".category").find( ".background").click(() => {
            $("#acCont").css("display", "none");
            $("#acCont.carousel-item").css("display", "none");
            $("#avatarContainer.carousel").css("display", "none");


            $("#platCont").css("display", "none");
            $("#platCont.carousel-item").css("display", "none");
            $("#platformContainer.carousel").css("display", "none");


            $("#backCont").css("display", "block");
            $("#backCont.carousel-item").css("display", "block");
            $("#backgroundContainer.carousel").css("display", "block");    

            $( "#backgroundContainer.carousel" ).trigger( "click" );
            $( "#backCont.carousel-item.active" ).trigger( "click" );
    });
    
        $( "#avatarContainer.carousel" ).on( "click", function() {
            console.log("clicked av1");
        });
        
        $( "#avContcarousel-item.active" ).on( "click", function() {
            console.log("clicked a");
        });
        
    
        $( "#platformContainer.carousel" ).on( "click", function() {
            console.log("clicked platform1");
        });
        
        $( "#platCont.carousel-item.active" ).on( "click", function() {
            console.log("clicked platform2");
        });
        
        $( "#backgroundContainer.carousel" ).on( "click", function() {
            console.log("clicked bg1");
        });
        
        $( "#backCont.carousel-item.active" ).on( "click", function() {
            console.log("clicked bg2");
        });

  });

  
  