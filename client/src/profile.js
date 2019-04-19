import React, { Component } from 'react';
import queryString from 'query-string';
import Modal from 'react-modal'
import logo from './logo.svg';
import { Link } from 'react-router-dom';


import './profile.css';


class profile extends Component {

  constructor () {
    super()
    this.state = {
      value : {},
      blocks:[{index: 1, block : "Block1"}, {index: 2, block: "Block2"},{index: 3, block: "Block3"}],
      storyBlocks:[{index: 1, block : "Story1"}, {index: 2, block: "Story2"},{index: 3, block: "Story3"}],

      isHidden: true
    }
  }
    /*Modal declared*/
  state = {
    modalIsOpen: false,
    secondModalIsOpen: false,
    editStoryIsOpen:false
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  openSecondModal = () => {
    this.setState({ secondModalIsOpen: true });
  };

  closeSecondModal = () => {
    this.setState({ secondModalIsOpen: false });
  };
  open_editstory = () => {
    this.setState({ editStoryIsOpen: true });
  };

  close_editstory = () => {
    this.setState({ editStoryIsOpen: false });
  };
  

  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }


  componentDidMount() {

    var account = this.props.match.params.account;

    var obj = JSON.stringify({
      "account":account
   });

    console.log(this.props)

     var xhttp = new XMLHttpRequest();
     xhttp.open("POST", "/api/fetch-profile" , true);
     xhttp.setRequestHeader("Content-Type", "application/json");
     xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200)
        {

          var response = JSON.parse(this.responseText);
          console.log(response);

          if (response.status === 'okay') {
            //update dom with new data
            document.getElementById('n1').innerHTML = response.username;
            document.getElementById('user_description').innerHTML = response.description;

            if(response.verify === "verified"){
              document.getElementById('verified').parentNode.removeChild(document.getElementById('verified'));            

            }
          }
          else
          {
            window.location.replace("/")
          }
        }
        else if ( this.status === 400 )
        {
          window.location.replace("/")
        }
     };
     xhttp.send(obj);

    if( !localStorage.account || !localStorage.token)
    {
      document.getElementById('flag').parentNode.removeChild(document.getElementById('flag'));
    }

    if(localStorage.account === account)
    {
      document.getElementById('flag').parentNode.removeChild(document.getElementById('flag'));
    }
    else
    {
      document.getElementById('logout').parentNode.removeChild(document.getElementById('logout'));
      document.getElementById('verified').parentNode.removeChild(document.getElementById('verified'));

    }

     const args = queryString.parse(this.props.location.search);

     if ( !args.verify ) return;
     if ( localStorage.account !== account) return;

     var vobj = JSON.stringify({
      "account":account,
      "verify":args.verify
   });

    console.log(this.props)

     var xhttp2 = new XMLHttpRequest();
     xhttp2.open("POST", "/api/verify" , true);
     xhttp2.setRequestHeader("Content-Type", "application/json");
     xhttp2.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
       
          var response = JSON.parse(this.responseText);
          console.log(response);
          
          if (response.status === 'okay' || (response.status === 'fail' && response.reason === 'account already verified')) {
            document.getElementById('verified').parentNode.removeChild(document.getElementById('verified'));
          }
          
          
        }
     };
     xhttp2.send(vobj);
  }

onClickVerifyEmail(){
  if ( !localStorage.account || !localStorage.token ) return;

    var obj = JSON.stringify({
      "account":localStorage.account,
      "token":localStorage.token,
    });

     var xhttp = new XMLHttpRequest();
     xhttp.open("POST", "/api/send-verification" , true);
     xhttp.setRequestHeader("Content-Type", "application/json");
     xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
       
          var response = JSON.parse(this.responseText);
          console.log(response);
           
          if (response.status === 'okay') {
            window.location.replace("/profile/" + localStorage.account)
          }
          else
          {
            localStorage.account = ""
            localStorage.token = ""
          }
        }
     };
     xhttp.send(obj);

}

  onFlag() {
    console.log("Flagging account!");

    if ( !localStorage.account || !localStorage.token ) return;

    var flag = this.props.match.params.account;

    var obj = JSON.stringify({
      "account":localStorage.account,
      "token":localStorage.token,
      "flag":flag
   });

    console.log(this.props)

     var xhttp = new XMLHttpRequest();
     xhttp.open("POST", "/api/flag-profile" , true);
     xhttp.setRequestHeader("Content-Type", "application/json");
     xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
       
          var response = JSON.parse(this.responseText);
          console.log(response);
          
          if (response.status === 'okay')
          {
            document.getElementById('flag').parentNode.removeChild(document.getElementById('flag'));
          }
        }
     };
     xhttp.send(obj);

  }

onLogout() {
            localStorage.account = ""
            localStorage.token =""
        }

   changeState() {
     this.setState({blocks:[{index: 1, block : "Block1"}, {index: 2, block: "Block2"},{index: 3, block: "Block3"}]})
   }     

   //-----------------------FUNCTION TO ADD A BLOCK DYNAMICALLY-------------------------
   onAddItem = () =>{
    this.setState(state => {
        const blocks = state.blocks.concat(state.value);
        return {
            blocks,
            value:{},
        };
    });
};
//-----------------------------------------------------------------------------------------

// -----LIKE BUTTON FUNCTION------
onClickLike = () => {
  
}

  render() {
    return (


    
      <div className="App">
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />


      

      
        {/* Menu top bar */}
        <div className="notification-bar">

        {/* Anthologist logo */}
        <div className="head">
          <h1 className="head1">
          <Link to='/'><a className="logo" href>anthologist</a></Link>
          </h1>
        </div>
        
        {/* Search Bar */}
    
        
        <button className="user"><Link to='/login'><img className="userimg" src='avatar.png'></img></Link> </button>
      

        </div> 

        <div>
          <button id ="verified" onClick={() => this.onClickVerifyEmail()} className="ver"> Verify Email</button> {this.state.isHidden}
        </div>

        <div id ="2" className="Namecontainer">
            <div id = "n0" > <img className="Image" src='/avatar.png' ></img> </div> 
            <button id='flag' className="notify"><img className="notimg" src='/flg.png' onClick={() => this.onFlag()} ></img> </button>
            <button id='edit' onClick={this.open_editstory} className="edit_p">Edit Profile</button> {/*edir profile button*/}
            <Link to='/'><button className="logout" id ="logout" color="blue" onClick={() => this.onLogout()}> logout</button></Link>
            <div id = "n1" className="Name"> <a className="name" href> </a> </div>
            <div id = "n2" className="Rating"> <a className="rating" href> Marks: 4.2 </a></div>
            <div id = "n3" className="Box">
                <div id = "user_description" className="typetext"> This is an example User Description</div>
            </div>
        </div>

        <div id ="3" className="Contributioncontainer">
                <div id = "m0" className="contribution"> <a className="cont" href> Contributions </a></div> 

              
              
              
              
              {/* -----------ADD A STORY UNDER CONTRIBUTIONS DYNAMICALLY-------- */}
              <div className="StoryCont">Story Contributions</div>
                 <div className='story-div2' >
            {
                // Iterates over each element in the blocks array in the state and makes a span
              this.state.storyBlocks.map(({block,index})=>{
                return (
                  <span key={index.toString()} className='block' >{block.toString()}
                    <button className="likeButton2" onClick={() => this.onClickLike} ><i id="like"class="far fa-thumbs-up fa-2x"></i></button>
                  </span>
                )
              })
            } </div>
            
              {/* ------------------------------------------------------------------------ */}


              {/* -----------ADD A BLOCK UNDER CONTRIBUTIONS DYNAMICALLY-------- */}
              <div className="BlocksCont">Blocks Contributions</div>
                 <div className='story-div3' >
            {
                // Iterates over each element in the blocks array in the state and makes a span
              this.state.blocks.map(({block,index})=>{
                return (
                  <span key={index.toString()} className='block' >{block.toString()}
                  <button className="likeButton" onClick={() => this.onClickLike} ><i class="far fa-thumbs-up fa-2x"></i></button>
                  </span>
                )
              })
            } </div>
            
              {/* ------------------------------------------------------------------------ */}


               {/* <div className='story-div' >
                <span className='block'>STORY 1</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
              </div>
              <div className='story-div' >
                <span className='block'>STORY 1</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
              </div>
              <div className='story-div' >
                <span className='block'>STORY 1</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
              </div>
              <div className='story-div' >
                <span className='block'>STORY 1</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
              </div>
              <div className='story-div' >
                <span className='block'>STORY 1</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
                <span className='block'>Block</span>
              </div>  */}
              



                </div>

      <div className='comments'>

      <span className='cmt'>Commented on a story called "A Lonely Boy"</span>
      <span className='cmt'>Commented on a story called "A Boy with a Laptop"</span>
      <span className='cmt'>Commented on a story called "A Boy with a Laptop"</span>
      <span className='cmt'>Commented on a story called "Girl with the dragon tattoo"</span>
      <span className='cmt'>Commented on a story called "The Guy who dies with the Vending Machine"</span>
      <span className='cmt'>Commented on a story called "Apple Tree"</span>
      <span className='cmt'>Commented on a story called "A Lonely Boy"</span>
      <span className='cmt'>Commented on a story called "A Lonely Boy"</span>
      <span className='cmt'>Commented on a story called "A Lonely Boy"</span>
      




      </div>

      <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
        </Modal>

        <Modal
          isOpen={this.state.secondModalIsOpen}
          onRequestClose={this.closeSecondModal}
        >
          <button onClick={this.closeSecondModal}>close</button>
          <div>No dude</div>
        </Modal>

        <Modal
          isOpen={this.state.editStoryIsOpen}
          onRequestClose={this.close_editstory}
        >

        <div class="change-description">
        <label className='change-descp' > Add new descritpion   </label>
        <input className='change-descp' type="text" id="new-description"/>
        </div>      
        <button >Update Description</button>
            <div>Edit Story</div>
          <button onClick={this.close_editstory}>close</button>
          

          <div>Change Profile Picture</div>
          <button id = "n0" > <img src='/avatar.png' alt = "Nothing"></img> </button> 
          <button> <img src='/man.png' alt = "Nothing"></img> </button> 
          <button> <img src='/man2.png' alt = "Nothing"></img> </button> 
          <button> <img src='/man3.png' alt = "Nothing"></img> </button> 
          <button> <img src='/man4.png' alt = "Nothing"></img> </button> 
          <button> <img src='/man5.png' alt = "Nothing"></img> </button> 
        </Modal>





      </div>




    );
  }
}

export default profile;
