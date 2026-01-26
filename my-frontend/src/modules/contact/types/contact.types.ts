/**
 * Contact module type definitions
 */

export interface ContactFormData {
    name: string
    email: string
    wallet: string
    subject: string
    message: string
    urgent: boolean
}

export interface ContactType {
    id: string
    name: string
    desc: string
    icon: string
}

export interface FAQItem {
    id: number
    question: string
}

export interface Attachment {
    name: string
    size?: number
    file?: File
}

export interface ContactInfo {
    type: 'phone' | 'email' | 'chat' | 'social'
    label: string
    value: string
    icon: string
}

export interface SocialLink {
    id: string
    name: string
    url: string
    icon?: string
    isActive: boolean
}
