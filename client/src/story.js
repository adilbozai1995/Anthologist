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
                <button className='st' onClick={this.togglePopup.bind(this)}>Completed Block 1</button>
                <div className='author'>Author</div>
                <div className='slash'>/</div>
                <div className='likes'>Likes</div>


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
