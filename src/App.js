import React, {useRef} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import './App.css';
import { drawHand, drawSquares } from "./utilities";
import * as Tone from 'tone';

let amountplayed = 1;
let historyBoxes = [];
let loadedTone = ""
let newRandomSound = 1;
let randomSound = [''];
let score = 0;

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    console.log('running hand pose');
    const net = await handpose.load();
    //loop over hand detections
    setInterval(()=>{
      detect(net);
    }, 100)
  }

  const detect = async (net) => {
    //check if data is available
    if(typeof webcamRef.current !=="undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4){

      //get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      
      //set video and canvas height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //make hand detections 
      const hand = await net.estimateHands(video);
      document.querySelector('.loader').style.display = "none";

      const ctx = canvasRef.current.getContext("2d"); 
      ctx.globalAlpha = 0.5;
      drawSquares(ctx);
      drawHand(hand, ctx);
      
      //play sounds based on hand movement
      playSound(hand, ctx)

      if(document.getElementById('bass').checked || document.getElementById('acoustic').checked || document.getElementById('electric').checked || document.getElementById('nylon').checked){
        document.querySelector('.button-message').style.display = "none";
      }

      notesGame();

    } 
  }

  const playSound = (hand, ctx) => {

    if (hand.length > 0) {

      //get the coordinates of the index fingertip
      let pointer = hand[0].annotations.indexFinger[3];

      let pointerX = Math.round(pointer[0]);
      let pointerY = Math.round(pointer[1]);

      //match them with a box
      let x = Math.floor(pointerX / 160);
      let y = Math.floor(pointerY / 120);
      let box = `${x},${y}`;
      
      //push boxes in an array to compare the last and second last vallue
      historyBoxes.push(box);
      let lastBox = (historyBoxes[historyBoxes.length - 1]);
      let secondLastBox = (historyBoxes[historyBoxes.length - 2]);

      //play sounds + check which instrument is checked
      if (amountplayed === 1) {

        //colors the box that is active
        ctx.fillStyle = "rgba(250,250,250,0.7)";
        ctx.fillRect(x * 160, y * 120, 160, 120);

        if (document.getElementById('bass').checked){
          playBassSound(lastBox);
        } else if (document.getElementById('acoustic').checked){
          playAcousticSound(lastBox);
        } else if (document.getElementById('electric').checked){
          playElectricSound(lastBox);
        } else if (document.getElementById('nylon').checked){
          playNylonSound(lastBox);
        }

        amountplayed++;
      }

      const $notes = document.querySelector('.notes');
      $notes.innerHTML = loadedTone;

      if (lastBox !== secondLastBox) {
        amountplayed = 1;
      }
    }
  }

  const playBassSound = (lastBox) => {

    const sampler = new Tone.Sampler({
      urls: {
        'A#2': 'As2.[mp3|ogg]',
        'A#3': 'As3.[mp3|ogg]',
        'A#4': 'As4.[mp3|ogg]',
        'A#5': 'As5.[mp3|ogg]',
        'C#2': 'Cs2.[mp3|ogg]',
        'C#3': 'Cs3.[mp3|ogg]',
        'C#4': 'Cs4.[mp3|ogg]',
        'C#5': 'Cs5.[mp3|ogg]',
        'E2': 'E2.[mp3|ogg]',
        'E3': 'E3.[mp3|ogg]',
        'E4': 'E4.[mp3|ogg]',
        'E5': 'E5.[mp3|ogg]',
        'G2': 'G2.[mp3|ogg]',
        'G3': 'G3.[mp3|ogg]',
        'G4': 'G4.[mp3|ogg]',
        'G5': 'G5.[mp3|ogg]'
      },
      release: 1,
      baseUrl: "https://nbrosowsky.github.io/tonejs-instruments/samples/bass-electric/",
      onload: () => {
        sampler.triggerAttackRelease(loadedTone, '8n');
      }
    }).toDestination();

    switch (lastBox) {
      case '0,0':
        loadedTone = 'A#2';
        break;
       case '1,0':
        loadedTone = 'A#3';
        break;
      case '2,0':
        loadedTone = 'A#4';
        break;
      case '3,0':
        loadedTone = 'A#5';
        break;
      case '0,1':
        loadedTone = 'C#2';
        break;
      case '1,1':
        loadedTone = 'C#3';
        break;
      case '2,1':
        loadedTone = 'C#4';
         break;
       case '3,1':
        loadedTone = 'C#5';
        break;
      case '0,2':
        loadedTone = 'E2';
        break;
      case '1,2':
        loadedTone = 'E3';
        break;
      case '2,2':
        loadedTone = 'E4';
         break;
      case '3,2':
        loadedTone = 'E5';
        break;
      case '0,3':
        loadedTone = 'G2';
        break;
      case '1,3':
        loadedTone = 'G3';
         break;
      case '2,3':
        loadedTone = 'G4';
        break;
      case '3,3':
        loadedTone = 'G5';
        break;
      default:
        loadedTone = 'G5';
    }
  }

  const playAcousticSound = (lastBox) => {

    const sampler = new Tone.Sampler({
      urls: {
        'F3': 'F3.[mp3|ogg]',
        'F#1': 'Fs1.[mp3|ogg]',
        'F#2': 'Fs2.[mp3|ogg]',
        'F#3': 'Fs3.[mp3|ogg]',
        'G1': 'G1.[mp3|ogg]',
        'G2': 'G2.[mp3|ogg]',
        'G3': 'G3.[mp3|ogg]',
        'G#1': 'Gs1.[mp3|ogg]',
        'G#2': 'Gs2.[mp3|ogg]',
        'G#3': 'Gs3.[mp3|ogg]',
        'A1': 'A1.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A#1': 'As1.[mp3|ogg]',
        'A#2': 'As2.[mp3|ogg]',
        'A#3': 'As3.[mp3|ogg]'
      },
      release: 1,
      baseUrl: "https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/",
      onload: () => {
        sampler.triggerAttackRelease(loadedTone, '8n');
      }
    }).toDestination();

    switch (lastBox) {
      case '0,0':
        loadedTone = 'F3';
        break;
       case '1,0':
        loadedTone = 'F#1';
        break;
      case '2,0':
        loadedTone = 'F#2';
        break;
      case '3,0':
        loadedTone = 'F#3';
        break;
      case '0,1':
        loadedTone = 'G1';
        break;
      case '1,1':
        loadedTone = 'G2';
        break;
      case '2,1':
        loadedTone = 'G3';
         break;
       case '3,1':
        loadedTone = 'G#1';
        break;
      case '0,2':
        loadedTone = 'G#2';
        break;
      case '1,2':
        loadedTone = 'G#3';
        break;
      case '2,2':
        loadedTone = 'A1';
         break;
      case '3,2':
        loadedTone = 'A2';
        break;
      case '0,3':
        loadedTone = 'A3';
        break;
      case '1,3':
        loadedTone = 'A#1';
         break;
      case '2,3':
        loadedTone = 'A#2';
        break;
      case '3,3':
        loadedTone = 'A#3';
        break;
      default:
        loadedTone = 'A#3';
    }
  }

  const playElectricSound = (lastBox) => {

    const sampler = new Tone.Sampler({
      urls: {
        'D#3': 'Ds3.[mp3|ogg]',
        'D#4': 'Ds4.[mp3|ogg]',
        'D#5': 'Ds5.[mp3|ogg]',
        'E2': 'E2.[mp3|ogg]',
        'F#2': 'Fs2.[mp3|ogg]',
        'F#3': 'Fs3.[mp3|ogg]',
        'F#4': 'Fs4.[mp3|ogg]',
        'F#5': 'Fs5.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A5': 'A5.[mp3|ogg]',
        'C3': 'C3.[mp3|ogg]',
        'C4': 'C4.[mp3|ogg]',
        'C5': 'C5.[mp3|ogg]',
        'C6': 'C6.[mp3|ogg]',
      },
      release: 1,
      baseUrl: "https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-electric/",
      onload: () => {
        sampler.triggerAttackRelease(loadedTone, '8n');
      }
    }).toDestination();

    switch (lastBox) {
      case '0,0':
        loadedTone = 'D#3';
        break;
       case '1,0':
        loadedTone = 'D#4';
        break;
      case '2,0':
        loadedTone = 'D#5';
        break;
      case '3,0':
        loadedTone = 'E2';
        break;
      case '0,1':
        loadedTone = 'F#2';
        break;
      case '1,1':
        loadedTone = 'F#3';
        break;
      case '2,1':
        loadedTone = 'F#4';
         break;
       case '3,1':
        loadedTone = 'F#5';
        break;
      case '0,2':
        loadedTone = 'A2';
        break;
      case '1,2':
        loadedTone = 'A3';
        break;
      case '2,2':
        loadedTone = 'A4';
         break;
      case '3,2':
        loadedTone = 'A5';
        break;
      case '0,3':
        loadedTone = 'C3';
        break;
      case '1,3':
        loadedTone = 'C4';
         break;
      case '2,3':
        loadedTone = 'C5';
        break;
      case '3,3':
        loadedTone = 'C6';
        break;
      default:
        loadedTone = 'C6';
    }
  }

  const playNylonSound = (lastBox) => {

    const sampler = new Tone.Sampler({
      urls: {
        'F#2': 'Fs2.[mp3|ogg]',
        'F#3': 'Fs3.[mp3|ogg]',
        'F#4': 'Fs4.[mp3|ogg]',
        'F#5': 'Fs5.[mp3|ogg]',
        'G3': 'G3.[mp3|ogg]',
        'G5': 'G3.[mp3|ogg]',
        'G#2': 'Gs2.[mp3|ogg]',
        'G#4': 'Gs4.[mp3|ogg]',
        'G#5': 'Gs5.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'A5': 'A5.[mp3|ogg]',
        'A#5': 'As5.[mp3|ogg]',
        'B1': 'B1.[mp3|ogg]',
        'B2': 'B2.[mp3|ogg]',
      },
      release: 1,
      baseUrl: "https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-nylon/",
      onload: () => {
        sampler.triggerAttackRelease(loadedTone, '8n');
      }
    }).toDestination();

    switch (lastBox) {
      case '0,0':
        loadedTone = 'F#2';
        break;
       case '1,0':
        loadedTone = 'F#3';
        break;
      case '2,0':
        loadedTone = 'F#4';
        break;
      case '3,0':
        loadedTone = 'F#5';
        break;
      case '0,1':
        loadedTone = 'G3';
        break;
      case '1,1':
        loadedTone = 'G5';
        break;
      case '2,1':
        loadedTone = 'G#2';
         break;
       case '3,1':
        loadedTone = 'G#4';
        break;
      case '0,2':
        loadedTone = 'G#5';
        break;
      case '1,2':
        loadedTone = 'A2';
        break;
      case '2,2':
        loadedTone = 'A3';
         break;
      case '3,2':
        loadedTone = 'A4';
        break;
      case '0,3':
        loadedTone = 'C5';
        break;
      case '1,3':
        loadedTone = 'A#5';
         break;
      case '2,3':
        loadedTone = 'B1';
        break;
      case '3,3':
        loadedTone = 'B2';
        break;
      default:
        loadedTone = 'B2';
    }
  }

  const notesGame = () => {

    if (document.getElementById('bass').checked){

      const sounds = ['A#2', 'A#3', 'A#4', 'A#5', 'C#2', 'C#3', 'C#4', 'C#5', 'E2', 'E3', 'E4', 'E5', 'G2', 'G3', 'G4', 'G5'];

      if(newRandomSound === 1) {
        randomSound.push(sounds[Math.floor(Math.random() * sounds.length)]);
        newRandomSound++;
      }

      let lastRandomSound = (randomSound[randomSound.length - 1]);
      const $randomNote = document.querySelector('.random-note');
      $randomNote.innerHTML = lastRandomSound;

      if(loadedTone === lastRandomSound){
        newRandomSound = 1;
        score ++;
      }

      const $points = document.querySelector('.points')
      $points.innerHTML = score;


    } else if (document.getElementById('acoustic').checked){

      const sounds = ['F3', 'F#1', 'F#2', 'F#3', 'G1', 'G2', 'G3', 'G#1', 'G#2', 'G#3', 'A1', 'A2', 'A2', 'A#1', 'A#2', 'A#3'];

      if(newRandomSound === 1) {
        randomSound.push(sounds[Math.floor(Math.random() * sounds.length)]);
        newRandomSound++;
      }

      let lastRandomSound = (randomSound[randomSound.length - 1]);
      const $randomNote = document.querySelector('.random-note');
      $randomNote.innerHTML = lastRandomSound;

      if(loadedTone === lastRandomSound){
        newRandomSound = 1;
        score ++;
      }

      const $points = document.querySelector('.points')
      $points.innerHTML = score;

    } else if (document.getElementById('electric').checked){

      const sounds = ['D#3', 'D#4', 'D#5', 'E2', 'F#2', 'F#3', 'F#4', 'F#5', 'A2', 'A3', 'A4', 'A5', 'C3', 'C4', 'C5', 'C6'];

      if(newRandomSound === 1) {
        randomSound.push(sounds[Math.floor(Math.random() * sounds.length)]);
        newRandomSound++;
      }

      let lastRandomSound = (randomSound[randomSound.length - 1]);
      const $randomNote = document.querySelector('.random-note');
      $randomNote.innerHTML = lastRandomSound;

      if(loadedTone === lastRandomSound){
        newRandomSound = 1;
        score ++;
      }

      const $points = document.querySelector('.points')
      $points.innerHTML = score;

    } else if (document.getElementById('nylon').checked){
      const sounds = ['F#2', 'F#3', 'F#4', 'F#5', 'G3', 'G5', 'G#2', 'G#4', 'G#5', 'A2', 'A3', 'A4', 'C5', 'A#5', 'B1', 'B2'];

      if(newRandomSound === 1) {
        randomSound.push(sounds[Math.floor(Math.random() * sounds.length)]);
        newRandomSound++;
      }

      let lastRandomSound = (randomSound[randomSound.length - 1]);
      const $randomNote = document.querySelector('.random-note');
      $randomNote.innerHTML = lastRandomSound;

      if(loadedTone === lastRandomSound){
        newRandomSound = 1;
        score ++;
      }

      const $points = document.querySelector('.points')
      $points.innerHTML = score;
    }
  
  }

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam className="video" ref={webcamRef}/>
        <canvas className="squares" ref={canvasRef}/>
      </header>

      <div className="box">
        <h1 className="title">Guitar Soundbox</h1>
        <p className="button-message">Choose a guitar</p>

        <div className="buttons">
          <div className="button">
            <input id="bass" type="radio" name="radio"/>
            <label for="bass" className="button-bass">Bass guitar </label>
          </div>
          <div className="button">
          <input id="acoustic" type="radio" name="radio"/>
            <label for="acoustic" className="button-acoustic">Acoustic guitar</label> 
          </div>
          <div className="button">
            <input id="electric" type="radio" name="radio"/>
            <label for="electric" className="button-electric">Electric guitar</label>
          </div>
          <div className="button">
          <input id="nylon" type="radio" name="radio"/>
          <label for="nylon" className="button-nylon">Nylon guitar</label>
          </div>
        </div>
      </div>

      <div className="notes-box">
        <div className="notes-display">
          <h2 className="small-title">Currently played:</h2>
          <p className="notes"></p>
        </div>
        <div className="game-box">
          <div className="random-note-display">
            <h2 className="game-title">Try to find</h2>
            <p className="random-note"></p>
          </div>
          <div className="points-display">
            <h2 className="game-title">Score:</h2>
            <p className="points"></p>
          </div>
        </div>
      </div>

      <div className="loader">
        <span className="circle circle-1"></span>
        <span className="circle circle-2"></span>
        <span className="circle circle-3"></span>
        <span className="circle circle-4"></span>
      </div>
    </div>
  );
}

export default App;