import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import './admin.css';

class admin extends Component {

    onDeleteAccount(){
        document.getElementById('admin_id_input').value = "";
    }

    onDeleteStory(){
        document.getElementById('admin_id_input').value = "";
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
            <input id="search_input bar" className="in" type="text" ></input>
            <button className="notify"><img className="notimg" src='/notification-icon.png'></img> </button>
            <button className="user"><img className="userimg" src='/avatar.png'></img> </button>
             <button className="search"><img className="searchimg" src='/search.png'></img> </button>
    
            </div>
  
            {/* Title of story */}
          <div id = "story-title" className="StoryTitle"> Admin Control<a className="title" href> </a> </div>
  
          {/* Entry points */}
          <div className='a_inputs_new'>
              
              <div><span className='st'>User ID : </span>
                  <input className='admin_input' type="text" id="admin_id_input"/>
              </div>
              <div className = 'a_button_pos'  >
                  <button className="admin-button" 
                  id= "add_story" onClick={() => this.onDeleteAccount()}> Delete Account</button>
                  </div>

             <div className = 'a_button_pos'  >
                  <button className="admin-button" 
                  id= "add_story" onClick={() => this.onDeleteStory()}>Delete Story</button>
                  </div>
         
  
                          
                  
          </div>
  
         
    
            
               
    
    
            
     
             
          </div>
     
    
        ); 
    
        
      
        
      }
    }
    
    export default admin;
    