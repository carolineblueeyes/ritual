class AudioEngine {
  private static instance: AudioEngine
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private initialized = false

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine()
    }
    return AudioEngine.instance
  }

  async init(): Promise<AudioContext> {
    if (this.initialized && this.ctx?.state !== 'closed') {
      await this.resume()
      return this.ctx!
    }
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.7
    this.masterGain.connect(this.ctx.destination)
    this.initialized = true
    return this.ctx
  }

  async resume(): Promise<void> {
    if (this.ctx?.state === 'suspended') await this.ctx.resume()
  }

  getContext(): AudioContext | null {
    return this.ctx
  }

  getMasterGain(): GainNode | null {
    return this.masterGain
  }

  setVolume(v: number): void {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, v))
  }

  close(): void {
    this.ctx?.close()
    this.ctx = null
    this.initialized = false
  }
}

export const audioEngine = AudioEngine.getInstance()
