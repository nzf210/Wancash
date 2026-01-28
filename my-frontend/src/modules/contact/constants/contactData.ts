import type { ContactType, FAQItem } from '../types/contact.types'

/**
 * Contact issue types for support form
 */
export const CONTACT_TYPES: ContactType[] = [
    {
        id: 'technical',
        name: 'Technical',
        desc: 'Transaction issues, wallet, etc.',
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
    },
    {
        id: 'staking',
        name: 'Staking',
        desc: 'Questions about staking',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
        id: 'general',
        name: 'General',
        desc: 'General token questions',
        icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
]

/**
 * Quick FAQ items
 */
export const QUICK_FAQS: FAQItem[] = [
    { id: 1, question: 'What is Wancash (WCH)?' },
    { id: 2, question: 'What is the total supply of WCH?' },
    { id: 3, question: 'How does the vesting mechanism work?' },
    { id: 4, question: 'Is there a max holding limit per wallet?' },
    { id: 5, question: 'Where does staking revenue come from?' }
]

/**
 * Contact information
 */
export const CONTACT_INFO = {
    phone: '+62 812-3456-7890',
    email: 'support@wancash.org',
    tokenSymbol: 'WCH',
    tokenName: 'Wancash Token'
}

/**
 * Stats display data
 */
export const SUPPORT_STATS = [
    { value: '24/7', label: 'Support Available' },
    { value: '≤ 1h', label: 'Response Time' },
    { value: '99%', label: 'Satisfaction Rate' }
]
