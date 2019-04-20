import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import './admin.css';

class admin extends Component {

    onDeleteAccount()
    {
        if ( !localStorage.account || !localStorage.token ) return;

        var obj = JSON.stringify({
            "account": localStorage.account,
            "token": localStorage.token,
            "profile": document.getElementById('admin_id_input').value
        });

        document.getElementById('admin_id_input').value = ""

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/api/profile-remove" , true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function ()
        {
            if ( this.readyState === 4 && this.status === 200 )
            {
                var response = JSON.parse(this.responseText);
                console.log(response);
            }
         };
         xhttp.send(obj);
    }

    onDeleteStory()
    {
        if ( !localStorage.account || !localStorage.token ) return;

        var obj = JSON.stringify({
            "account": localStorage.account,
            "token": localStorage.token,
            "story": document.getElementById('admin_id_input').value
        });

        document.getElementById('admin_id_input').value = ""

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/api/story-remove" , true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function ()
        {
            if ( this.readyState === 4 && this.status === 200 )
            {
                var response = JSON.parse(this.responseText);
                console.log(response);
            }
        };
        xhttp.send(obj);
    }
      
      render() {
        return (
         
          <div className="App">
          
            
            
            
            {/* Menu top bar */}
            <div className="notification-bar">
    
            {/* Anthologist logo */}
            <div className="head">
              <h1 className="head1">
              <Link to='/'><a className="logo" href>anthologist</a></Link></h1>
            </div>
            
            {/* Search Bar */}
            
            <button className="user"><Link to='/login'><img className="userimg" src='/picon.png'></img></Link> </button>
             
    
            </div>
  
            {/* Title of story */}
          <div id = "story-title" className="StoryTitle"> Admin Control<a className="title" href> </a> </div>
  
          {/* Entry points */}
          <div className='a_inputs_new'>
              
              <div><span className='st5'>User ID : </span>
                  <input className='admin_input' type="text" id="admin_id_input"/>
              </div>
                  <button className="admin-button" 
                  id= "add_story" onClick={() => this.onDeleteAccount()}> Delete Account</button>

                  <button className="admin-button" 
                  id= "add_story" onClick={() => this.onDeleteStory()}>Delete Story</button>
         
  
                          
                  
          </div>
  
         
    
            
               
    
    
            
     
             
          </div>
     
    
        ); 
    
        
      
        
      }
    }
    
    export default admin;
    
