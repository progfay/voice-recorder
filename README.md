# voice-recorder

JavaScript dictation library with Web Audio API

## Usage

```js
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(async (stream) => {
        const results = []
        const audioRecorder = new AudioRecorder(stream)
        audioRecorder.addEventListener('dataavailable', ({ data }) => results.push(data))
        audioRecorder.start()
        await sleep(2000)
        audioRecorder.stop()
        const buffer = Buffer.from(results)
    })
    .catch(console.error)
```

