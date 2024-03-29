import React, { Component } from 'react';
import logo from './logo.svg';
import {Link} from 'react-router-dom';
import './homepage.css';


class homepage extends Component {

  constructor () {
    super()
    this.state = {
      value: {},
      stories: [],
    }
  }

  onAddItem = ( updateVal ) => {
      this.setState(state => {
          const stories = state.stories.concat(updateVal);
          return {
              stories,
              value:{},
          };
      })
  };

    componentDidMount( )
    {
        if ( typeof( localStorage.homepage_mode ) === 'undefined' )
        {
            localStorage.homepage_mode = 0;
        }

        var tmpobj = {
            "mode": localStorage.homepage_mode
        }

        if ( localStorage.account && localStorage.token )
        {
            tmpobj["account"] = localStorage.account
            tmpobj["token"] = localStorage.token
        }

        var obj = JSON.stringify(tmpobj)
        const updateStory = this.onAddItem;

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/api/story-homepage" , true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function ()
        {
            if ( this.readyState === 4 && this.status === 200 )
            {
                var response = JSON.parse(this.responseText);
                console.log(response);

                if ( response.status === 'okay' )
                {
                    for ( var i = 0; i < response.stories.length; i++ )
                    {
                        var story = response.stories[i]

                        updateStory(story)
                    }
                }
            }
        };
        xhttp.send(obj);
    }


    sortstories(mode){
       localStorage.homepage_mode = mode
        window.location.reload()
    }

  render() {
    return (

      <div className="App">
      
        {/* Menu top bar */}
        <div className="notification-bar">

        

        {/* Anthologist logo */}
        <div className="head">
          <h1 className="head1">
          <Link to='/'><a className="logo" href>anthologist</a></Link>
          </h1>
        </div>
        
        {/* Search Bar */}
        
        <button className="user"><Link to='/login'><img className="userimg" src='/picon.png' alt = "No logo"></img></Link> </button>
        </div>
        
        {/* Top buttons under menu bar */}
        <div className='top-buttons'>
        <button className="submit-buttons_2" onClick={() => this.sortstories(0)} id ="new-story" color="blue">New</button>
        <button className="submit-buttons_2" onClick={() => this.sortstories(1)} id ="popular-stories" color="blue">Popular</button>
        <button className="submit-buttons_2" onClick={() => this.sortstories(2)} id ="popular-stories" color="blue">Following</button>
        <button className="create-story" id ="create-story-button" color="blue">
            <Link className="create-story" to='/new-story'> create a story</Link>
        </button>
        </div>


      {/* Stories on the page */}
      <div className='stories'>

      {/* -----------ADD A STORY UNDER CONTRIBUTIONS DYNAMICALLY-------- */}
                 
            {
                // Iterates over each element in the blocks array in the state and makes a span
              this.state.stories.map(({id, author, username, title, views})=>{
                return (
                  <div>
                      
                      <a href={"/story/" + id.toString()} className='storyBlock' >
                      <div className="titleText">{title.toString()}</div>
                      <a href={"/profile/" + author.toString()} className="author3">{username.toString()}</a>
                      <a className="views">{views.toString()} Views</a>
                      </a>
                      
                      
                  </div>
                )
              })
            }
            
              {/* ------------------------------------------------------------------------ */}

        {
     /* <span className='story-cover1'>STORY 1</span>
        <span className='story-cover2'>STORY 2</span>
        <span className='story-cover3'> STORY 3</span>
        <span className='story-cover4'>STORY 4</span>

        <span className='story-cover5'>STORY 5</span>
        <span className='story-cover6'>STORY 6</span>
        <span className='story-cover7'> STORY 7</span>
        <span className='story-cover8'>STORY 8</span>

        <span className='story-cover9'>STORY 9</span>
        <span className='story-cover10'>STORY 10</span>
        <span className='story-cover11'> STORY 11</span>
        <span className='story-cover12'>STORY 12</span> */}
        

      </div>




      </div>
    );
  }
}

export default homepage;
