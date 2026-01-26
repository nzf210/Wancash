import { describe, it, expect } from 'bun:test'
import en from '../locales/en.json'

describe('I18n Configuration', () => {
    it('should have valid english locale', () => {
        expect(en).toBeDefined()
        expect(en.nav.home).toBe('Home')
        expect(en.hero.title).toContain('Decentralized')
    })

    it('should have all required sections', () => {
        expect(en).toHaveProperty('nav')
        expect(en).toHaveProperty('hero')
        expect(en).toHaveProperty('common')
    })
})
