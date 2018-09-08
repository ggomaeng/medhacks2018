import React, { Component } from 'react';

export default class SoundVisualizer extends Component {
  componentDidMount() {
    var paths = document.getElementsByTagName('path');
    var visualizer = document.getElementById('visualizer');
    var mask = visualizer.getElementById('mask');
    var path;
    var report = 0;

    var soundAllowed = function(stream) {
      //Audio stops listening in FF without // window.persistAudioStream = stream;
      //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
      //https://support.mozilla.org/en-US/questions/984179
      window.persistAudioStream = stream;
      var audioContent = new AudioContext();
      var audioStream = audioContent.createMediaStreamSource(stream);
      var analyser = audioContent.createAnalyser();
      audioStream.connect(analyser);
      analyser.fftSize = 1024;

      var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
      visualizer && visualizer.setAttribute('viewBox', '0 0 255 255');

      //Through the frequencyArray has a length longer than 255, there seems to be no
      //significant data after this point. Not worth visualizing.
      for (var i = 0; i < 255; i++) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path && path.setAttribute('stroke-dasharray', '4,1');
        mask.appendChild(path);
      }
      var doDraw = function() {
        requestAnimationFrame(doDraw);
        analyser.getByteFrequencyData(frequencyArray);
        var adjustedLength;
        for (var i = 0; i < 255; i++) {
          adjustedLength =
            Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 1);
          adjustedLength = adjustedLength < 80 ? 0 : adjustedLength - 80;
          // adjustedLength = adjustedLength > 100 ? 100 : adjustedLength;
          adjustedLength *= 0.6;

          paths &&
            paths[i] &&
            paths[i].setAttribute(
              'd',
              'M ' + i + ',255 l 0,-' + adjustedLength
            );
        }
      };
      doDraw();
    };

    var soundNotAllowed = function(error) {
      console.log(error);
    };

    /*window.navigator = window.navigator || {};
    /*navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;*/
    this.track = navigator.getUserMedia(
      { audio: true },
      soundAllowed,
      soundNotAllowed
    );
  }

  componentWillUnmount() {}

  render() {
    return (
      <svg
        preserveAspectRatio="none"
        id="visualizer"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <mask id="mask">
            <g id="maskGroup" />
          </mask>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: '#B3E5FC', stopOpacity: 1 }}
            />
            <stop
              offset="20%"
              style={{ stopColor: '#4FC3F7', stopOpacity: 1 }}
            />
            <stop
              offset="90%"
              style={{ stopColor: '#03A9F4', stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#008dcd', stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#gradient)"
          mask="url(#mask)"
        />
      </svg>
    );
  }
}
