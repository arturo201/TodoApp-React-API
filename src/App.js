import React, { Component } from "react";
import TaskManager from './components/TaskManager'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

class App extends Component {
  render() {
    return (
      <div>
        <TaskManager />
      </div>
    )
  }
}

export default App;