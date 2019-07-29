# voice-recorder

JavaScript dictation library with Web Audio API

## Usage

```js
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(async (stream) => {
        const results = []
        const voiceRecorder = new voiceRecorder(stream)
        voiceRecorder.addEventListener('dataavailable', ({ data }) => results.push(data))
        voiceRecorder.start()
        await sleep(2000)
        voiceRecorder.stop()
        const buffer = Buffer.from(results)
    })
    .catch(console.error)
```

