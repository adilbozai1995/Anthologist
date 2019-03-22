import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import './story.css';





class story extends Component {
  
  
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
        <div id = "story-title" className="StoryTitle"> Working Title<a className="title" href> </a> </div>

        {/* Blocks */}
        <div className='blocks-container'>
            <div className='blocks'>
                <span className='st'>Completed Block 1</span>
                <span className='st'>Author</span>
                <span className='author'>Author</span>

            </div>
            <div className='blocks'>
                <span className='st'>Completed Block 2</span>
            </div>
            <div className='blocks'>
                <span className='st'>Completed Block 3</span>
            </div>
            <div className='blocks'>
                <span className='st'>Completed Block 4</span>
            </div>
        </div>
 
         
      </div>
 

    ); 

    
  
    
  }
}

export default story;
