import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import './story.css';


class Popup extends React.Component {
    ViewStory(){


    }
  
  render() {
    return (
      <div className='popup_view_story'>
        <div className='popup_inner_story'>

        <div><span className='st'>Enter new voting time : </span>
                <input className='input_new' type="text" id="vote_time"/>
            </div>
        
        <button onClick={this.props.closePopup}>Done</button>
        </div>
      </div>
    );
  }
}


class story extends Component {
  
  constructor() {
    super();
    this.state = {
      showPopup: false
    };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  

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
                document.getElementById('charLimit').innerHTML = "Character Limit: " + response.charlimit
                document.getElementById('minBl').innerHTML = "Min Story Len: " + response.storylen
                document.getElementById('votesLimit').innerHTML = "Min Blocks for Vote: " + response.minblock
                document.getElementById('nOfViews').innerHTML = response.views + " Views"
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
        <div id="story-title" className="StoryTitle"> Working Title<a className="title" href> </a> </div>

        {/* Blocks */}
        <div className='blocks-container'>
            <div className='blocks'>
                <button className='st' >Completed Block 1</button>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>
                <div className='author' id='sAuthor'>Author</div>
                <div className='slash' id='sSlash'>/</div>
                <div className='likes' id='sLikes'>Likes</div>


            </div>
            <div className='blocks'>
            <button className='st'>Completed Block 2</button>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='blocks'>
            <button className='st'>Completed Block 3</button>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
            <div className='blocks'>
            <button className='st'>Completed Block 4</button>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


            </div>
        </div>

        {/* Number of Likes */}
        <div className='nOfLikes'>400 Likes</div>

        {/* Number of Views */}
        <div className='nOfViews' id='nViews'>100 Views</div>


        {/* Book Logo */}
        <div className='book-logo'>
         <img className="bookimg" src='/book.png' ></img>
        </div>
         

        {/* Attributes */}
        <div className='attributesBlock'>
        <h1 className='attributes'>Attributes</h1>
        <div className='cLimit' id='charLimit'></div>
          <div className='minBlocks' id='minBl'></div>
          <div className='vLimit' id='votesLimit' ></div>
          <div className='vTime' id='votesTime' ></div>
        </div>

        {/* Change Time Button */}
        <button className="changeTimeButton" id ="changeTime" onClick={this.togglePopup.bind(this)} color="blue">Change Vote Time </button>


        {/* Proposed Blocks */}
        <div className='proposed'>
            <div className='p-blocks'>
                <span className='st1'>Completed Block 1</span>
                <div className='author1'>Author</div>
                <div className='slash1'>/</div>
                <div className='likes1'>Likes</div>


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
       
        {this.state.showPopup ? 
          <Popup
            text='Close Me'
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }


        

      </div>


      

 

    ); 

    
  
    
  }
}

export default story;
