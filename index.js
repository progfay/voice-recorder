/* global document, Event */

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()

class AudioRecorder {
  constructor (stream) {
    this.stream = stream
    this.mediaStreamSource = null
    this.processor = null
    this.floatData = null
    this.state = 'inactive'
    this.em = document.createDocumentFragment()
    this.num = 0
    this.length = 0
    this.sampleRate = 0
    this.onAudioProcess = this.onAudioProcess.bind(this)
  }

  start (timeslice) {
    this.state = 'recording'

    this.mediaStreamSource = audioContext.createMediaStreamSource(this.stream)
    this.processor = audioContext.createScriptProcessor(1024, 1, 1)
    this.mediaStreamSource.connect(this.processor)

    this.processor.onaudioprocess = this.onAudioProcess
    if (timeslice) {
      this.slicing = setInterval(() => {
        if (this.state === 'recording') this.requestData()
      }, timeslice)
    }

    this.processor.connect(audioContext.destination)
  }

  stop () {
    if (!this.processor) return
    this.state = 'inactive'
    this.mediaStreamSource.disconnect()
    this.processor.disconnect()
    this.processor.onaudioprocess = null
    this.processor = null
    this.stream.getTracks().forEach(track => track.stop())
    this.stream = null
    clearInterval(this.slicing)
  }

  requestData () {
    const audioBuffer = audioContext.createBuffer(this.num, this.length, this.sampleRate)
    for (let i = 0; i < this.num; i++) {
      audioBuffer.getChannelData(i).set(this.floatData[i])
    }

    this.num = 0
    this.length = 0
    this.sampleRate = 0
    this.floatData = null

    const event = new Event('dataavailable')
    event.data = audioBuffer
    this.em.dispatchEvent(event)
  }

  onAudioProcess ({ inputBuffer }) {
    if (!this.num) {
      this.num = inputBuffer.numberOfChannels
      this.floatData = []
      this.sampleRate = inputBuffer.sampleRate
    }

    if (!inputBuffer.getChannelData(0).some(Boolean)) return

    this.length += inputBuffer.length
    for (let i = 0; i < this.num; i++) {
      this.floatData.push(inputBuffer.getChannelData(i))
    }
  }

  addEventListener () {
    this.em.addEventListener(...arguments)
  }

  removeEventListener () {
    this.em.removeEventListener(...arguments)
  }
}

module.exports = AudioRecorder
