import './App.css';
import {Route} from "react-router-dom"
import ChatPage from "./Pages/ChatPage"

import Home from './Pages/Home';
function App() {
  return (
    <div className="App">
    <Route exact path="/" component={Home}/>
    <Route exact path="/chats" component={ChatPage}/>

    </div>
  );
}

export default App;
