// src/utils/useSEO.ts
import { useHead } from '@unhead/vue'

export interface SEOOptions {
    title: string
    description: string
    image?: string
    url?: string
    type?: 'website' | 'article'
    keywords?: string[]
}

/**
 * Reusable SEO composable for setting meta tags
 * Includes Open Graph and Twitter Card support
 */
export function useSEO(options: SEOOptions) {
    const baseUrl = typeof window !== 'undefined' ? globalThis.window.location.origin : 'https://wancash.org'
    const defaultImage = `${baseUrl}/og-default.png`
    const siteName = 'Wancash'

    const fullTitle = options.title.includes(siteName)
        ? options.title
        : `${options.title} | ${siteName}`

    // Debug: Check if useSEO is being called
    console.log('[useSEO] Called with:', { title: fullTitle, description: options.description })

    useHead({
        title: fullTitle,
        meta: [
            // Standard meta tags
            { name: 'description', content: options.description },
            { name: 'keywords', content: options.keywords?.join(', ') || 'wancash, crypto, token, bridge, cross-chain, defi' },

            // Open Graph
            { property: 'og:site_name', content: siteName },
            { property: 'og:title', content: fullTitle },
            { property: 'og:description', content: options.description },
            { property: 'og:image', content: options.image || defaultImage },
            { property: 'og:url', content: options.url || baseUrl },
            { property: 'og:type', content: options.type || 'website' },

            // Twitter Card
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: fullTitle },
            { name: 'twitter:description', content: options.description },
            { name: 'twitter:image', content: options.image || defaultImage },

            // Additional meta
            { name: 'theme-color', content: '#8b5cf6' },
            { name: 'application-name', content: siteName },
        ],
        link: [
            { rel: 'canonical', href: options.url || baseUrl }
        ]
    })
}

/**
 * Add organization structured data for better SEO
 */
export function useOrganizationSchema() {
    const baseUrl = typeof window !== 'undefined' ? globalThis.window.location.origin : 'https://wancash.org'

    useHead({
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Wancash',
                    url: baseUrl,
                    logo: `${baseUrl}/logo.png`,
                    description: 'Decentralized cross-chain token bridge platform',
                    sameAs: [
                        // Add your social media links here
                        'https://twitter.com/wancash_token',
                        'https://t.me/wancash_token',
                        'https://github.com/wancash'
                    ]
                })
            }
        ]
    })
}

/**
 * Add WebApplication structured data
 */
export function useWebApplicationSchema() {
    const baseUrl = typeof window !== 'undefined' ? globalThis.window.location.origin : 'https://wancash.org'

    useHead({
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebApplication',
                    name: 'Wancash',
                    url: baseUrl,
                    applicationCategory: 'FinanceApplication',
                    operatingSystem: 'Web',
                    offers: {
                        '@type': 'Offer',
                        price: '0',
                        priceCurrency: 'USD'
                    },
                    description: 'Cross-chain token bridge for WCH tokens across multiple blockchains'
                })
            }
        ]
    })
}
