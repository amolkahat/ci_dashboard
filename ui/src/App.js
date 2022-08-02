// import Component from the react module
import React, { Component } from "react";
import VerticalPage from './components/MainPage'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Mirrors from "./apps/Mirrors";
import Promoter from "./apps/Promoter";
import TempestSkip from "./apps/Tempest";
import {RRToolsTab} from "./components/Tabs";
import AdminPage from "./apps/Admin";
import OSPComponent from "./apps/Components";

import {configureStore} from '@reduxjs/toolkit';
import rootReducer from "./Reducers";

import {Provider} from 'react-redux';

const store = configureStore({reducer: rootReducer})

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <VerticalPage>
            <Routes>
              <Route index element={<RRToolsTab/>}/>
              <Route path='mirrors' element={<Mirrors/>}/>
              <Route path='promoter' element={<Promoter/>}/>
              <Route path='tempest' element={<TempestSkip/>}/>
              <Route path='zuul' element={<OSPComponent/>}/>
              <Route path='admin' element={<AdminPage/>}/>
            </Routes>
            </VerticalPage>
        </BrowserRouter>
      </Provider>
    );
  }
}
export default App;
