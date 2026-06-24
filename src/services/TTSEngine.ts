import type { VoiceInstruction } from '../types'

const TONE_PARAMS: Record<string, { rate: number; pitch: number }> = {
  'мягкий':     { rate: 0.85, pitch: 1.1 },
  'уверенный':  { rate: 1.0,  pitch: 1.0 },
  'глубокий':   { rate: 0.75, pitch: 0.75 },
  'нейтральный':{ rate: 1.0,  pitch: 1.0 },
  'энергичный': { rate: 1.25, pitch: 1.1 },
  'шёпот':      { rate: 0.65, pitch: 1.3 },
}

const TEMPO_MAP: Record<string, number> = {
  'медленный': 0.7,
  'средний':   1.0,
  'быстрый':   1.4,
}

class TTSEngine {
  private currentUtterance: SpeechSynthesisUtterance | null = null

  speak(instruction: VoiceInstruction): void {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(instruction.text)
    utterance.lang = 'ru-RU'
    const toneRate = TONE_PARAMS[instruction.tone || 'нейтральный']?.rate ?? 1.0
    const tempoRate = TEMPO_MAP[instruction.tempo || 'средний'] ?? 1.0
    utterance.rate = toneRate * tempoRate
    utterance.pitch = TONE_PARAMS[instruction.tone || 'нейтральный']?.pitch ?? 1.0
    utterance.volume = 1.0

    this.currentUtterance = utterance
    utterance.onend = () => { this.currentUtterance = null }
    utterance.onerror = () => { this.currentUtterance = null }

    window.speechSynthesis.speak(utterance)
  }

  stop(): void {
    window.speechSynthesis.cancel()
    this.currentUtterance = null
  }

  pause(): void {
    window.speechSynthesis.pause()
  }

  resume(): void {
    window.speechSynthesis.resume()
  }
}

export const ttsEngine = new TTSEngine()
