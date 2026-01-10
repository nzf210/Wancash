import { ref, computed, type Ref } from 'vue'

/**
 * Reusable pagination composable
 */
export function usePagination(itemsPerPage = 10) {
    const currentPage = ref(1)

    /**
     * Calculate total pages based on total items
     */
    const getTotalPages = (totalItems: number) => {
        return Math.ceil(totalItems / itemsPerPage)
    }

    /**
     * Go to next page
     */
    const nextPage = (totalPages: number) => {
        if (currentPage.value < totalPages) {
            currentPage.value++
        }
    }

    /**
     * Go to previous page
     */
    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--
        }
    }

    /**
     * Go to specific page
     */
    const goToPage = (page: number, totalPages: number) => {
        if (page >= 1 && page <= totalPages) {
            currentPage.value = page
        }
    }

    /**
     * Reset to first page
     */
    const resetPage = () => {
        currentPage.value = 1
    }

    /**
     * Get paginated items from array
     */
    const getPaginatedItems = <T>(items: T[]) => {
        const start = (currentPage.value - 1) * itemsPerPage
        return items.slice(start, start + itemsPerPage)
    }

    /**
     * Get pagination info
     */
    const getPaginationInfo = (totalItems: number) => {
        const totalPages = getTotalPages(totalItems)
        const start = Math.min((currentPage.value - 1) * itemsPerPage + 1, totalItems)
        const end = Math.min(currentPage.value * itemsPerPage, totalItems)

        return {
            currentPage: currentPage.value,
            totalPages,
            start,
            end,
            totalItems,
            itemsPerPage,
        }
    }

    return {
        // State
        currentPage,

        // Methods
        nextPage,
        prevPage,
        goToPage,
        resetPage,
        getTotalPages,
        getPaginatedItems,
        getPaginationInfo,
    }
}
