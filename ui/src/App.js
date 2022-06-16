// import Component from the react module
import React, { Component } from "react";
import VerticalPage from './components/MainPage'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ReviewList from "./apps/ReviewList";
import Mirrors from "./apps/Mirrors";
import Promoter from "./apps/Promoter";
import TempestSkip from "./apps/Tempest";
import RRToolsTab from "./components/Tabs";


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <VerticalPage>
          <Routes>
            <Route index element={<RRToolsTab/>}/>
            <Route path='mirrors' element={<Mirrors/>}/>
            <Route path='promoter' element={<Promoter/>}/>
            <Route path='tempest' element={<TempestSkip/>}/>
          </Routes>
          </VerticalPage>
      </BrowserRouter>
    );
  }
}
export default App;
