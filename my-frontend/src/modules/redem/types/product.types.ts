export interface GoldProduct {
    id: string
    name: string
    weight_grams: number
    purity: string // e.g., "99.9%"
    price_wch: number
    image_url: string
    stock: number
    description: string
}
