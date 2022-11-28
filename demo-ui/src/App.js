// library imports
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// assets
import './App.css';

// component imports
import Topics from './components/Topics/Topics';
import AggregateLinguistics from './components/AggregateLinguistics/AggregateLinguistics';
import SingleConversation from './components/SingleConversation/SingleConversation';
import Main from './components/Main/Main';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/topics"><Topics /></Route>
        <Route path="/aggregate_linguistics"><AggregateLinguistics /></Route>
        <Route path="/single_conversation/:conversation_id"><SingleConversation /></Route>
        <Route path="/drill_down"><Main drillDown={true} /></Route>
        <Route path="/"><Main /></Route>
      </Switch>
    </Router>
  );
}

export default App;
