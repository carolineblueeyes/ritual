import { audioEngine } from './AudioEngine'

class SoundscapeEngine {
  private nodes: Map<string, OscillatorNode | AudioBufferSourceNode | GainNode> = new Map()
  private ctx: AudioContext | null = null

  private async ensureCtx(): Promise<AudioContext> {
    this.ctx = await audioEngine.init()
    await audioEngine.resume()
    return this.ctx
  }

  async playBinauralBeat(leftHz: number, rightHz: number, volume = 0.3): Promise<void> {
    const ctx = await this.ensureCtx()
    this.stopBinaural()

    const masterGain = audioEngine.getMasterGain()
    if (!masterGain) return

    const leftOsc = ctx.createOscillator()
    leftOsc.type = 'sine'
    leftOsc.frequency.value = leftHz
    const leftGain = ctx.createGain()
    leftGain.gain.value = volume
    const leftPanner = ctx.createStereoPanner()
    leftPanner.pan.value = -1
    leftOsc.connect(leftGain).connect(leftPanner).connect(masterGain)
    leftOsc.start()
    this.nodes.set('binauralL', leftOsc)
    this.nodes.set('binauralLGain', leftGain)

    const rightOsc = ctx.createOscillator()
    rightOsc.type = 'sine'
    rightOsc.frequency.value = rightHz
    const rightGain = ctx.createGain()
    rightGain.gain.value = volume
    const rightPanner = ctx.createStereoPanner()
    rightPanner.pan.value = 1
    rightOsc.connect(rightGain).connect(rightPanner).connect(masterGain)
    rightOsc.start()
    this.nodes.set('binauralR', rightOsc)
    this.nodes.set('binauralRGain', rightGain)
  }

  stopBinaural(): void {
    ;['binauralL', 'binauralR'].forEach(k => {
      const n = this.nodes.get(k) as OscillatorNode | undefined
      if (n) { try { n.stop() } catch {} }
      this.nodes.delete(k)
    })
    ;['binauralLGain', 'binauralRGain'].forEach(k => this.nodes.delete(k))
  }

  async playIsochronicTone(freq: number, pulseRate: number, volume = 0.3): Promise<void> {
    const ctx = await this.ensureCtx()
    this.stopIsochronic()

    const masterGain = audioEngine.getMasterGain()
    if (!masterGain) return

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const ampGain = ctx.createGain()
    ampGain.gain.value = volume

    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = pulseRate
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.5
    lfo.connect(lfoGain).connect(ampGain.gain)

    osc.connect(ampGain).connect(masterGain)
    osc.start()
    lfo.start()
    this.nodes.set('isochronicOsc', osc)
    this.nodes.set('isochronicLFO', lfo)
    this.nodes.set('isochronicGain', ampGain)
  }

  stopIsochronic(): void {
    ;['isochronicOsc', 'isochronicLFO'].forEach(k => {
      const n = this.nodes.get(k) as OscillatorNode | undefined
      if (n) { try { n.stop() } catch {} }
      this.nodes.delete(k)
    })
    this.nodes.delete('isochronicGain')
  }

  async playNoise(volume = 0.15): Promise<void> {
    const ctx = await this.ensureCtx()
    this.stopNoise()

    const masterGain = audioEngine.getMasterGain()
    if (!masterGain) return

    const bufferSize = ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = volume
    source.connect(noiseGain).connect(masterGain)
    source.start()
    this.nodes.set('noise', source)
    this.nodes.set('noiseGain', noiseGain)
  }

  stopNoise(): void {
    const n = this.nodes.get('noise') as AudioBufferSourceNode | undefined
    if (n) { try { n.stop() } catch {} }
    this.nodes.delete('noise')
    this.nodes.delete('noiseGain')
  }

  stopAll(): void {
    this.stopBinaural()
    this.stopIsochronic()
    this.stopNoise()
  }

  async playLayer(music?: import('../types').MusicLayer): Promise<void> {
    if (!music) return
    this.stopAll()
    if (music.binauralBeat) {
      await this.playBinauralBeat(music.binauralBeat.left, music.binauralBeat.right, (music.volume ?? 0.3) * 0.7)
    } else if (music.isochronicTone) {
      await this.playIsochronicTone(music.padFreq ?? 40, music.isochronicTone, (music.volume ?? 0.3) * 0.7)
    } else if (music.padFreq) {
      await this.playBinauralBeat(music.padFreq, music.padFreq * 0.9, (music.volume ?? 0.3) * 0.5)
    }
  }

  async playSoundscape(name: string, volume = 0.5): Promise<void> {
    switch (name) {
      case 'Фокус': await this.playBinauralBeat(44, 30, volume); break
      case 'Поток': await this.playBinauralBeat(50, 34, volume); break
      case 'Расслабление': await this.playIsochronicTone(40, 8, volume); break
      case 'Сон': await this.playBinauralBeat(30, 26, volume * 0.7); break
      case 'Тишина': await this.playNoise(volume * 0.3); break
      case 'Пробуждение': await this.playIsochronicTone(256, 18, volume); break
      case 'Восстановление': await this.playBinauralBeat(35, 30, volume * 0.8); break
      case 'Творчество': await this.playIsochronicTone(256, 10, volume * 0.6); break
      case 'Дыхание': await this.playIsochronicTone(220, 0.125, volume * 0.5); break
      case 'Лес': await this.playNoise(volume * 0.4); break
      default: await this.playNoise(volume * 0.2)
    }
  }
}

export const soundscapeEngine = new SoundscapeEngine()
