import { React } from "react";
import {BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Banners from "./components/banners/banners";
import Home from "./components/home/home";

const App = () => {
  return (
    <Router>

      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/banners" exact component={Banners}/>
      </Switch>
    </Router>
  );
}

export default App;
