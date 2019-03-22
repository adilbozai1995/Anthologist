import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import './story.css';





class story extends Component {

  componentDidMount()
  {
    var story = this.props.match.params.story;

    var obj = JSON.stringify({
        "story":story
    });

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/story-fetch" , true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function ()
    {
        if ( this.readyState === 4 && this.status === 200 )
        {

            var response = JSON.parse(this.responseText);
            console.log(response);

            if ( response.status === 'okay' )
            {
                document.getElementById('story-title').innerHTML = response.title
            }
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
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='blocks'>
                <span className='st'>Completed Block 2</span>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='blocks'>
                <span className='st'>Completed Block 3</span>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='blocks'>
                <span className='st'>Completed Block 4</span>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
        </div>

        {/* Number of Likes */}
        <div className='nOfLikes'>400 Likes</div>

        {/* Book Logo */}
        <div className='book-logo'>
         <img className="bookimg" src='/book.png' ></img>
        </div>
         

        {/* Attributes */}
        <div className='attributesBlock'>
        <div className='cLimit'></div>
          <div className='minBlocks'></div>
          <div className='vLimit'></div>
        </div>

        


        {/* Proposed Blocks */}
        <div className='proposed'>
            <div className='p-blocks'>
                <span className='st'>Completed Block 1</span>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='p-blocks'>
                <span className='st'>Completed Block 2</span>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>

            </div>
            <div className='p-blocks'>
                <span className='st'>Completed Block 3</span>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='p-blocks'>
                <span className='st'>Completed Block 4</span>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
        </div>



      </div>
 

    ); 

    
  
    
  }
}

export default story;
