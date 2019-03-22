import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import story from './story'
import homepage from './homepage';


import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route,Switch} from 'react-router-dom';
import login from './login';
import userprofile from './profile';
import reset from './reset';
import newstory from './new-story';
import admin from './admin';


ReactDOM.render(


<BrowserRouter>
<Switch>
    <div>
    <Route exact path='/story/:story' component={story}></Route>
    <Route exact path='/' component={homepage}/>
    <Route exact path='/profile/:account' component={userprofile}></Route>
    <Route exact path='/login' component={login}></Route>
    <Route exact path='/reset/:account' component={reset}></Route>
    <Route exact path='/new-story' component={newstory}></Route>
    {/* <Route exact path='/story/:story' component={story}></Route>*/}
    <Route exact path='/admin' component={admin}></Route> 
    </div>
    </Switch>
</BrowserRouter>,




document.getElementById('root')



);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
