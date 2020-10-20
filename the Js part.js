window.onload= function(){


let name, new_password,
   working = document.getElementsByClassName('work')[0],
   Directory, table=[], xp = Math.ceil(Math.random()*3000),
post_something=document.querySelectorAll('.post_something')
  
                                      
                                       
name =  prompt('Hey user welcome to Coders community.'
           +    ' you will learn more about us later...'
            +   "    What is  your name ?. \n\n"
            +    "⚠️Plese note that you should not add "
            +   "symbols to your name...\n"
            +   "⚠️ The code is working properly so wait"
            +    " patiently..."
            );
            



Directory = 

[ "https://i.ibb.co/PMPXDGd/1600671185667.png" ]


let cover =document.createElement('img')

cover.src = Directory[0];
cover.id = "cover";


canvas.appendChild(cover);






load= setInterval(function(){
             
  if (loading.value >= 100)
  
  {clearInterval(load);
   home.style.display = "block";
   cover_turn_to_menu();
   loading.style.display = "none";
   
   
   
   setTimeout(function(){
     swal({
         
               icon : 'success',
               
              title : 'Welcome ' + name + "." + ' This is '  
                  +   "the  home section."
            
           });
                  },   4000);
   
   
   
   }
 
 
  else
      {loading.value += 0.1; };     }, 1);
      
      
      
      
      cover_turn_to_menu = () =>
      
      
      {  cover.style.width = "15%";
         cover.style.left  =  "2%";
         cover.style.top   =  "90%";
                 
         
         cover_menu(); }
         
         
        
        



// to completely remove the cover menu..😁🤓😒


      menu_display =()=>{
          
          
      switch ( menu.style.filter){
         
         case "opacity(0%)" :
    
setTimeout(function(){
        menu.style.display = "none" }, 3000)         
               break;
          
          case "opacity(100%)" :
setTimeout(function(){
        menu.style.display = "block";
                        }, 3000) 
         
         break;    }
         
      }     
        
       
        
        
        
        
        
         
         
  cover_menu =()=>
      {   
         
    

  cover.addEventListener( 'click', function() {




if (menu.style.height == "0%" )        
{document.querySelector("#menu").style.height = "70%";

 menu.style.filter = "opacity(100%)"
 menu_display(); 
 
  
icons = document.querySelectorAll('  #menu * ');
 
  for (let i = 0 ; i < icons.length; i++ )
  
  { icons[i].style.display = "block"; }
  
  
  }


else /*if (menu.style.height == '70%') */
{ menu.style.height = "0%";
  
 menu.style.filter= "opacity(0%)";
 
 

icons = document.querySelectorAll(' #menu *');
 
  for (let i = 0 ; i < icons.length; i++ )
  
  {  icons[i].style.display = "none"; }
     


     }
   }, true);
         }
         
         
         
         
 
 





document.querySelectorAll("#menu p img")[0].addEventListener
('click', function(){
    
     
       menu.style.filter = "opacity(0%)";  
       menu_display(); 
  
       home.style.display = "none";
       setting.style.display= "none";
       leaderboard.style.display= "none";
       notification.style.display= "block";
        code.style.display        = "none";
        chat.style.display        = "none";





working.style.display = "block";

firebase.database().ref('Post').on('value', function(){
       
        working.style.display = "none";})
            
        
}); 








 
 

document.querySelectorAll('#menu p img')[1].addEventListener 
('click', function(){
           
       menu.style.filter = "opacity(0%)";  
       menu_display(); 
  
       home.style.display = "none";
       setting.style.display= "none";
       leaderboard.style.display= "block";
     notification.style.display= "none";  
     code.style.display        = "none";
     chat.style.display        = "none";


working.style.display = "block";

firebase.database().ref('Post').on('value', function(){
       
        working.style.display = "none";  });                             
                       
})     






         
         











document.querySelectorAll("#menu p img")[2].addEventListener
('click', function(){
     
       
       home.style.display = "block";
       setting.style.display= "none";
       leaderboard.style.display= "none";
       notification.style.display= "none";
       code.style.display        = "none"; 
       chat.style.display        = "none";  
       
       
       menu.style.filter = 'opacity(0%)';
       menu_display(); 
}) 














document.querySelectorAll("#menu p img")[3].addEventListener
('click', function(){
    
        home.style.display = "none";
       setting.style.display= "none";
       leaderboard.style.display= "none";         
       notification.style.display= "none"; 
       code.style.display        = "block"; 
       chat.style.display        = "none";
          
      menu.style.filter = 'opacity(0%)';
      menu_display();
      




     



                             



     
document.querySelectorAll('#code textarea')[0].style.background
= document.querySelectorAll(" #setting input")[0].value;

        
document.querySelectorAll('#code textarea')[0].style.color
= document.querySelectorAll(" #setting input")[1].value;

        
      




 document.querySelectorAll(' #code .new_project')[0].addEventListener('click', function(){
     
    
    //  code playground....
    
  
document.querySelectorAll('#code textarea')[0].style.display
                                   = "block";    



document.querySelectorAll(' #code .new_project')[0].style.display = "none";


document.querySelectorAll(' #code iframe')[0].style.display 
                                                  = "block";




run.style.display = "block";

document.querySelectorAll("#code button")[0].style.display=
                                                    "block";
                                                     
                                                     
document.querySelectorAll("#code button")[1].style.display=
                                                    "block";                                                    
               


document.querySelectorAll("#code button")[2].style.display=
                                                    "block";                                                    
               







run.addEventListener('click', function(){
          
          


document.querySelectorAll('#code iframe ')[0].srcdoc =

document.querySelectorAll('#code textarea')[0].value; });  


 
 
document.querySelectorAll("#code button")[0].addEventListener('click',function(){

  
project = prompt("What is the name of your project? ");

if (project == ""){project= "Coder\'s" + "project"; }


firebase.database().ref("projects").push().set({
    

              project_name : project,
              
           project_content:   document.querySelectorAll('#code textarea')[0].value,  
           
           user_project   :  name     

});



working.style.display = "block";
firebase.database().ref(new_password).on("value",function(){

            working.style.display = "none"; }) 


  

firebase.database().ref("projects").on('child_added',
function(p){

    project_list=   document.createElement("div");
    
    project_list.id= "project_list";
    project_list.style.display = "block";
               
       code.appendChild(project_list);
       
   project_list.innerHTML =  "Coder " + p.val().user_project             
                                +   "\'s project"  +  "<hr>"                              
                                +    p.val().project_name;
  
   
document.querySelectorAll('#code textarea')[0].style.display
                                   = "none";    



document.querySelectorAll(' #code .new_project')[0].style.display = "block";


document.querySelectorAll(' #code iframe')[0].style.display 
                                                  = "none";




run.style.display = "block";

document.querySelectorAll("#code button")[0].style.display=
                                                    "none";
                                                     
                                                     
document.querySelectorAll("#code button")[1].style.display=
                                                    "none";                                                    
               


document.querySelectorAll("#code button")[2].style.display=
                                                    "none";                                                    
               
  


 project_list.addEventListener('click', function(){
 


document.querySelectorAll('#code textarea')[0].style.display
                                   = "block";    



document.querySelectorAll(' #code .new_project')[0].style.display = "block";


document.querySelectorAll(' #code iframe')[0].style.display 
                                                  = "block";




run.style.display = "block";

document.querySelectorAll("#code button")[0].style.display=
                                                    "block";
                                                     
                                                     
document.querySelectorAll("#code button")[1].style.display=
                                                    "block";                                                    
               


document.querySelectorAll("#code button")[2].style.display=
                                                    "block";                                                    
               
document.querySelectorAll('#code textarea')[0]  =
p.val().project_content 
  
 
 
     
     
 }); // end of project editing .😁  
   



    
});// end of the child_adding firebase code...😀😁

  
  
});// end of save event listener ...





document.querySelectorAll("#code button")[2].onclick=
function(){
 


document.querySelectorAll('#code textarea')[0].style.display = "none";    



document.querySelectorAll(' #code .new_project')[0].style.display = "block";


document.querySelectorAll(' #code iframe')[0].style.display 
                                                  = "none";




run.style.display = "none";

document.querySelectorAll("#code button")[0].style.display=
                                                    "none";
                                                     
                                                     
document.querySelectorAll("#code button")[1].style.display=
                                                    "none";                                                    
               


document.querySelectorAll("#code button")[2].style.display=
                                                    "none";                                                    
}; // end of back onclick function








  
}); ///end of the add new project event listener.😱😳                     
                                                                                
});   // end of the code playground section...













document.querySelectorAll("#menu p img")[4].addEventListener
('click', function(){



       menu.style.filter = "opacity(0%)";  
       menu_display(); 
  
       home.style.display = "none"; 
       setting.style.display= "none";
       leaderboard.style.display= "none";
     notification.style.display= "none";  
     code.style.display        = "none";
     chat.style.display        = "block";




send_chat.onblur = function(){




confirmation = confirm('Do you want to send this message?'
                 +      ' to the coders community chat' 
                 +      " group?")


if(confirmation){

firebase.database().ref('chat').push().set({
    
    
               chatter :  name,
               
              message  :  send_chat.value   });
};        


working.style.display = "block";

firebase.database().ref('chat').on('value', function(){
       
        working.style.display = "none";  });                             
                       

     

firebase.database().ref('chat').on('child_added',
function(c){
    

    
    
      chat_box.style.position= "absolute";
      chat_box.style.left = "9vw";
      chat_box.style.top  =  "5vh";                     
      chat_box.style.background = "white";
      chat_box.style.width  = "80vw";
      chat_box.style.height =  "80vh";
      chat_box.style.boxShadow  = "0px 3px 5px black," + 
                              "  inset 3px 3px 5px black,"
                           +  "  inset 0px -3px 5px red";
                            
      chat_box.style.borderRadius = "1em";
      
      chat_box.style.textAlign = "center";
      chat_box.style.overflowX = "hidden";
      chat_box.style.overflowY = "scroll";
       

  chat_box.innerText +=  
"<b>" + c.val().chatter + "</b>" + ":" + c.val().message
                        + "<hr>";
});
    

   send_chat.value = " ";
    
};  //end of send chat attribute ...onblur..






 });



















document.querySelectorAll("#menu p img")[5].addEventListener
('click', function(){
     
       
       home.style.display = "none";
       setting.style.display= "block";
       leaderboard.style.display= "none";         
       notification.style.display= "none"; 
       code.style.display        = "none"; 
       chat.style.display        = "none";
       
       menu.style.filter = 'opacity(0%)';
      menu_display(); 
       
}); 














document.querySelectorAll(" #setting div")[0].addEventListener('click',function(){
    
let change = confirm('Do you want to add or change name?');

        if (change == true)
        
     { name = prompt("Enter your name...") }
     
     else{}
})

    



//  accounts  management   😁😁   
    
document.querySelectorAll(" #setting div")[1].addEventListener('click',function(){


    
accounts= swal({

              icon:  "info",
              
              title:  "Create \n ➕ or Recover account..." 
                    + "🔎",
            
           buttons :   ["recover", "create"],  
               
           
        dangerMode :   true
          
      })
      
   // note recover is false and create is true  😁  
       
      .then( (accounts) =>{ 
      
      
 switch ( accounts ){
 
 
 case name ==null:
 
 alert('your name cannot be empty...');
 
 break;
       
  case accounts == true :
new_password = prompt(' Add a strong password to your'
                                          + " account") 
                                          
    firebase.database().ref(new_password).push().set({
         
         
                  user: name,
                  
              password: new_password,
           
     post_content:  post_something[0].value
     
     
   //  Delete_icon :  Delete.innerHTML
                     
               });
  break;
 
 
default :
 
verification = prompt(' What is your password? ');



  working.style.display = "block";
firebase.database().ref(verification).on('value',
  
  function()
  {working.style.display = "none";})     
  

        
firebase.database().ref( verification ).on( "child_added",
    
    function(ic) {                                                                                                                                           
  alert( ic.val().user + " Welcome back to the"
                      +   " community"); 
                      
   name = ic.val().user;                           
    });             
   break;
   
 }

    
    
    
      }); // end of .then....
      
  
 });
          
          
          
          
          
          
          
      
     
         
         
         



// in the home menu... to store posts in the database...



 post_something[0].onblur= function(){


 if(   post_something.value != "" )
    { 
let send= swal({icon: 'warning', 
              title: "Do you want to send this post?",
              
         dangerMode: true,         
            
         buttons   : ["cancel","Send"] })
              

.then( (send)=>{
 
 
 if (send== true && post_something.value != " " ) 
 {
        
     firebase.database().ref("Post").push().set({
         
           poster: name ,
           
     post_content:  post_something[0].value
     
    
          
     });
     
     
     
     working.style.display = "block";

firebase.database().ref('Post').on('value', function(){
       
        working.style.display = "none";})
           
     
     
   
                             
              
     post_something[0].value= ''; }
     
     
     else{  post_something[0].value = ""; };
     
         }) //end of .then...
         
                 
                


firebase.database().ref("Post").on('child_added',
 function(e)
 {
               
          let posts = document.createElement('p');
      
         home.appendChild(posts);        
         
     
         posts.id =  "posts";
         
      posts.innerText = 
      
"<br> <b>" +  e.val().poster + "</b>" + "\'s Post" + "<hr>"  
+  e.val().post_content  +  '<br> ' +  "<p>" 
      
      posts.style.position= "relative";
      posts.style.left = "9vw";                     
      posts.style.background = "white";
      posts.style.width  = "80vw";
      posts.style.boxShadow  = "0px 3px 5px black," + 
                                "  inset 3px 3px 5px black";
      posts.style.borderRadius = "1em";
      posts.style.border = "3px outset red";
      posts.style.textAlign = "center";
      
      
     });
      
                                              
        
     
     


}; // end of if function...


};  // end of the post_something onblur function..😲🤦


     
       


      



 


  
  var firebaseConfig = {
    apiKey: "AIzaSyAsDyFjFSvZT7_zltfs6RZWI8stV3MMBSE",
    authDomain: "coders-community.firebaseapp.com",
    databaseURL: "https://coders-community.firebaseio.com",
    projectId: "coders-community",
    storageBucket: "coders-community.appspot.com",
    messagingSenderId: "1040346878260",
    appId: "1:1040346878260:web:788bf7e0ed577d73369561",
    measurementId: "G-W85BW3BRMG"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  


/**********************notification************************/

firebase.database().ref('notify').push().set({
    
              notifier:  name,     
       
               notify : 'has joined Code community' });


 
 
 
 

firebase.database().ref('notify').on('child_added', 
function(n){
             
             
        n_box =  document.createElement('div');
        notification.appendChild(n_box);
        n_box.id = "n_box";
        
        n_box.innerText = "<b>" + n.val().notifier + "</b>"
                             + " " +
                          n.val().notify   });
    




/*********************the Leaderbard**********************/
//essential in the leaderbard....    



firebase.database().ref('Leaderboard').push().set({
    
                 exp  :     xp, 
                 
           name_list  :  name        })



       


                
         firebase.database().ref('Leaderboard').on('child_added',

function(ie){
 
table.push("<b>" + ie.val().name_list+"</b> "+ie.val().exp 
                 + 'xp')


leaderboard_box.innerText += table.sort((a,b)=>{return b-a})
                               +       table.join('<hr>');

          

});
}; // end..😒 of loading windows....
