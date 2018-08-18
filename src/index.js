import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

function timeout(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(duration), duration);
    })
}

/*
// Then
timeout(3000).then( (v) => {
        console.log('resolved with: ' + v);
        return timeout(3001);
    }, (v) => {
        console.log('rejected with: ' + v);
    }).then( (v) => {
        console.log('resolved with1: ' + v);
    }, (v) => {
        console.log('rejected with1: ' + v);
    })
*/
// Catch
timeout(1000).then((v) => {
    console.log('resolved with: ' + v);
    throw Error("hmm");
}, (v) => {
    console.log('rejected with: ' + v);
}).catch((err) => {
    console.log(err);
})


