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
        "storylen": document.getElementById('story_length').value,
        "writers": document.getElementById('writers_list').value,
        "block": document.getElementById('story').value
    }

    document.getElementById('book_title').value = "";
    document.getElementById('max_char').value = "";
    document.getElementById('min_vote').value = "";
    document.getElementById('vote_time').value = "";
    document.getElementById('writers_list').value = "";
    document.getElementById('story_length').value = "";
    document.getElementById('story').value = "";

    var jstr = JSON.stringify(obj)

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/story-create" , true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function ()
    {
        if ( this.readyState === 4 && this.status === 200 )
        {
            var response = JSON.parse(this.responseText);
            console.log(response);

            if ( response.status === 'okay' )
            {
                window.location.replace("/story/" + response.story)
            }
        }
    };
    xhttp.send(jstr);
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
        <div id = "story-title" className="StoryTitle"> Create a Story<a className="title" href> </a> </div>

        {/* Entry points */}
        <div className='inputs_new'>
            
            <div class="label-div2">
            <label className='st2'>Book Title : </label>
                <input className='input_new1' type="text" id="book_title"/>
            </div>
            <div class="label-div2">
            <label className='st2'>Story Length : </label>
                <input className='input_new1' type="text" id="story_length"/>
            </div>
            <div class="label-div2">
            <label className='st2'>Max Char count : </label>
                <input className='input_new1' type="text" id="max_char"/>
            </div>
            <div class="label-div2">
            <label className='st2'>Min Block for Vote : </label>
                <input className='input_new1' type="text" id="min_vote"/>
            </div>
            <div class="label-div2">
            <label className='st2'>Voting Time per block : </label>
                <input className='input_new1' type="text" id="vote_time"/>
            </div>
            <div class="label-div2">
            <label className='st2'>Writers : </label>
                <textarea className='input_new1' type="text" id="writers_list"/>
            </div>

                        
                
        </div>

        {/* Add new Story */}
        <div className = 'new_story_text'>

        <div>
                <textarea className='add_text'  type="text" id="story"/>
            </div>

            




        </div>
  
          
        <button className="add-button" id= "add_story" onClick={() => this.onAddClicked()}>Add</button>
  
  
          
   
           
        </div>
   
  
      ); 
  
      
    
      
    }
  }
  
  export default news;
  
