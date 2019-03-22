import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import './new-story.css';

class news extends Component {
  onAddClicked(){

    if ( !localStorage.account || !localStorage.token ) return;

    var obj = {
        "account": localStorage.account,
        "token": localStorage.token,

        "title": document.getElementById('book_title').value,
        "charlimit": document.getElementById('max_char').value,
        "minblock": document.getElementById('min_vote').value,
        "votetime": document.getElementById('vote_time').value,
        "writers": document.getElementById('writers_list').value,
    }

    var a = document.getElementById('story').value

    document.getElementById('book_title').value = "";
    document.getElementById('genre').value = "";
    document.getElementById('max_char').value = "";
    document.getElementById('min_vote').value = "";
    document.getElementById('vote_time').value = "";
    document.getElementById('writers_list').value = "";
    document.getElementById('story').value = "";

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
        <div id = "story-title" className="StoryTitle"> Create a Story<a className="title" href> </a> </div>

        {/* Entry points */}
        <div className='inputs_new'>
            
            <div><span className='st'>Book Title : </span>
                <input className='input_new' type="text" id="book_title"/>
            </div>
            <div><span className='st'>Genre : </span>
                <input className='input_new' type="text" id="genre"/>
            </div>
            <div><span className='st'>Max Char count : </span>
                <input className='input_new' type="text" id="max_char"/>
            </div>
            <div><span className='st'>Min Block for Vote : </span>
                <input className='input_new' type="text" id="min_vote"/>
            </div>
            <div><span className='st'>Voting Time per block : </span>
                <input className='input_new' type="text" id="vote_time"/>
            </div>
            <div><span className='st'>Writers : </span>
                <textarea className='input_new' type="text" id="writers_list"/>
            </div>

                        
                
        </div>

        {/* Add new Story */}
        <div className = 'new_story_text'>

        <div><span className='st'></span>
                <textarea className='add_text'  type="text" id="story"/>
            </div>

            <div className = 'button_pos'  ><button className="add-button" id= "add_story" onClick={() => this.onAddClicked()}>Add</button></div>




        </div>
  
          
             
  
  
          
   
           
        </div>
   
  
      ); 
  
      
    
      
    }
  }
  
  export default news;
  
