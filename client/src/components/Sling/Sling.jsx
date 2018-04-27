import React, { Component } from 'react';
import CodeMirror from 'react-codemirror2';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';
import { throttle } from 'lodash';

import Stdout from './StdOut/index.jsx';
import SubmittedCode from './StdOut/SubmittedCode.jsx';
import EditorHeader from './EditorHeader';
import Button from '../globals/Button';
import Loading from '../globals/Loading';

import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-dark.css';
import './Sling.css';

class Sling extends Component {
  state = {
    id: null,
    ownerText: null,
    challengerText: null,
    text: '',
    challenge: '',
    stdout: '',
    loading: false,
    blocked: false,
    submitResult: undefined,
  }


  componentDidMount() {
    const { socket, challenge, player } = this.props;
    const startChall = typeof challenge === 'string' ? JSON.parse(challenge) : {};
    const playerObject = { id: localStorage.getItem('id'), username: localStorage.getItem('username')};
    socket.on('connect', () => {
      socket.emit('client.ready', { challenge: startChall, player: playerObject });
    });
    
    socket.on('server.initialState', ({ id, playerOneText, playerTwoText, challenge }) => {
      this.setState({
        id,
        ownerText: playerOneText,
        challengerText: playerTwoText,
        challenge: challenge
      });
    });

    socket.on('serverOne.changed', ({ text, player }) => {
      this.setState({ ownerText: text });
    });

    socket.on('serverTwo.changed', ({ text, player }) => {
      this.setState({ challengerText: text });
    });

    socket.on('server.run', ({ stdout, player }) => {
      this.props.player === player ? this.setState({ stdout }) : null;
    });

    socket.on('server.submit', ({ pass, player, expected, got }) => {
      if(!this.state.blocked){
        if(player === this.props.player){
          this.setState({
            loading: false,
            submitResult: (<SubmittedCode pass={pass} player={player} text={{ expected:expected , got:got }} />)
          });
        }

        if(pass){
          if(player !== this.props.player){
            this.setState({
              submitResult: (<SubmittedCode pass={pass} player={player} text={{ expected:expected , got:got }} />)
            });
          }
          //block game
          this.setState({
            blocked: true
          });
          //History
          let outcome = player === this.props.player ? 1 : 0;
          let time = new Date();
          let clout = this.state.challenge.difficulty;
          let user_id = parseInt(localStorage.getItem('id'));
          let challenger_id= 1;
          let challenge_id = this.state.challenge.id;
          console.log({ outcome , time , clout , user_id , challenger_id , challenge_id });

          axios.post('http://localhost:3396/api/history/addHistory', { outcome , time , clout , user_id , challenger_id , challenge_id });

          //update users
          //requires update user endpoint for kdr and clout

        }
      }
    });

    window.addEventListener('resize', this.setEditorSize);
  }

  submitCode = () => {
    if(!this.state.loading && !this.state.blocked){
      const { socket, player } = this.props;
      const { ownerText, challengerText } = this.state;
      this.setState({
        loading: true,
        submitResult: undefined
      });
      if (player === 1) {
        socket.emit('client.submit', { text: ownerText, player });
      } else {
        socket.emit('client.submit', { text: challengerText, player });
      }
    }
  }

  runCode = () => {
    const { socket, player } = this.props;
    const { ownerText, challengerText } = this.state;
    if (player === 1) {
      socket.emit('client.run', { text: ownerText, player });
    } else {
      socket.emit('client.run', { text: challengerText, player });
    }
  }

  handleChange = throttle((editor, metadata, value) => {
    const { player } = this.props;
    player === 1 ? this.props.socket.emit('clientOne.update', { text: value, player }) : this.props.socket.emit('clientTwo.update', { text: value, player });
  }, 250)

  setEditorSize = throttle(() => {
    this.editor.setSize(null, `${window.innerHeight - 80}px`);
  }, 100);

  initializeEditor = (editor) => {
    this.editor = editor;
    this.setEditorSize();
  }

  render() {
    const { socket, player } = this.props;
    if (player === 1) {
      return (
        <div className="sling-container">
          <EditorHeader />
          <div className="code1-editor-container">
            <CodeMirror
              editorDidMount={this.initializeEditor}
              value={this.state.ownerText}
              options={{
                mode: 'javascript',
                lineNumbers: true,
                theme: 'base16-dark',
              }}
              onChange={this.handleChange}
              />
          </div>
          <div className="stdout-container">
              {this.state.challenge.title || this.props.challenge.title}
              <br/>
              {this.state.challenge.content || this.props.challenge.content}
            <Stdout text={this.state.stdout}/>
            <div style={{'textAlign' : 'center'}} >
              <Button
                className="run-btn"
                text="Run Code"
                backgroundColor="red"
                color="white"
                onClick={() => this.runCode()}
              />
              <Button
                className="run-btn"
                text="Submit Code"
                backgroundColor="red"
                color="white"
                onClick={() => this.submitCode()}
              />
            </div>
            {this.state.loading ? <Loading /> : null}
            {this.state.submitResult ? this.state.submitResult : null}

          </div>
          <div className="code2-editor-container">
            <CodeMirror 
              editorDidMount={this.initializeEditor}
              value={this.state.challengerText}
              options={{
                mode: 'javascript',
                lineNumbers: true,
                theme: 'base16-dark',
                readOnly: true,
              }}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="sling-container">
          <EditorHeader />
          <div className="code1-editor-container">
            <CodeMirror
              editorDidMount={this.initializeEditor}
              value={this.state.ownerText}
              options={{
                mode: 'javascript',
                lineNumbers: true,
                theme: 'base16-dark',
                readOnly: true
              }}
              />
          </div>
          <div className="stdout-container">
              {this.state.challenge.title || this.props.challenge.title}
              <br/>
              {this.state.challenge.content || this.props.challenge.content}
            <Stdout text={this.state.stdout}/>
            <div style={{'textAlign' : 'center'}} >
              <Button
                className="run-btn"
                text="Run Code"
                backgroundColor="red"
                color="white"
                onClick={() => this.runCode()}
              />
              <Button
                  className="run-btn"
                  text="Submit Code"
                  backgroundColor="red"
                  color="white"
                  onClick={() => this.submitCode()}
              />
            </div>
            {this.state.loading ? <Loading /> : null}
            {this.state.submitResult ? this.state.submitResult : null}
          </div>
          <div className="code2-editor-container">
            <CodeMirror 
              editorDidMount={this.initializeEditor}
              value={this.state.challengerText}
              options={{
                mode: 'javascript',
                lineNumbers: true,
                theme: 'base16-dark'
              }}
              onChange={this.handleChange}
            />
          </div>
        </div>
      )
    }
  }
}

export default Sling;
