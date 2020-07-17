import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import io from 'socket.io-client';
// import logo from './logo.svg';
import './App.css';

const API_URL = 'http://127.0.0.1:3100';
const socket = io(API_URL);

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: {},
      disabled: ''
    };
    this.popup = null;
  }

  componentDidMount() {
    socket.on('user', user => {
      this.popup.close();
      this.setState({ user });
    });
  }

  /**
   * Routinely checks the popup to re-enable the login button
   * if the user cloes the popup without authenticating
   */
  doCheckPopup() {
    const check = setInterval(() => {
      const { popup } = this;
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        this.setState({ disabled: '' });
      }
    }, 1000);
  }

  /**
   * Launches the popup on the server and passes along the socket id
   * so it can be used to send back user data to the appropriate socket
   * on the connected client
   * @returns {Window}
   */
  doOpenPopup() {
    const width = 600;
    const height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    const url = `${API_URL}/twitter?socketId=${socket.id}`;

    return window.open(url, '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    );
  }

  /**
   * Kicks off the processes of opening the popup on the server and listening
   * to the popup. It also disables the login button so the user can not
   * attempt to login to the provider twice.
   */
  doStartAuth() {
    if (!this.state.disabled) {
      this.popup = this.doOpenPopup();
      this.doCheckPopup();
      this.setState({ disabled: 'disabled' });
    }
  }

  doCloseCard() {
    this.setState({ user: {} });
  }

  render() {
    const { name, photo } = this.state.user;
    const { disabled } = this.state;

    return (
      <div className={'container'}>
        {/* If there is a user, show the user */}
        {/* Otherwise show the login button */}
        {name
         ? <div className={'card'}>
           <img src={photo} alt={name}/>
           <FontAwesome
             name={'times-circle'}
             className={'close'}
             onClick={this.doCloseCard.bind(this)}
           />
           <h4>{`@${name}`}</h4>
         </div>
         : <div className={'button'}>
           <button
             onClick={this.doStartAuth.bind(this)}
             className={`twitter ${disabled}`}
           >
             <FontAwesome
               name={'twitter'}
             />
           </button>
         </div>
        }
      </div>
    );

    /*return (
     <div className="App">
     <header className="App-header">
     <img src={logo} className="App-logo" alt="logo"/>
     <p>
     Edit <code>src/App.js</code> and save to reload.
     </p>
     <a
     className="App-link"
     href="https://reactjs.org"
     target="_blank"
     rel="noopener noreferrer"
     >
     Learn React
     </a>
     </header>
     </div>
     );*/
  }
}

export default App;
