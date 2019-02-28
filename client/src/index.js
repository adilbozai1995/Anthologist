import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import homepage from './homepage';


import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route,Switch} from 'react-router-dom';
import login from './login';
import userprofile from './profile';


ReactDOM.render(


<BrowserRouter>
<Switch>
    <div>
    <Route exact path='/' component={homepage}/>
    <Route exact path='/profile/:account' component={userprofile}></Route>
    <Route exact path='/login' component={login}></Route>
    </div>
    </Switch>
</BrowserRouter>,




document.getElementById('root')



);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
