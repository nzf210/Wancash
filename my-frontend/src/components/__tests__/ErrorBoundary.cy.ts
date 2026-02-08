
import ErrorBoundary from '../ErrorBoundary.vue'
import { defineComponent, h } from 'vue'

const ThrowError = defineComponent({
    setup() {
        throw new Error('Test Error')
    },
    render() {
        return h('div', 'Should not see this')
    }
})

describe('ErrorBoundary.vue', () => {
    // Suppress expected error logs during test
    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            // we expect this error
            if (err.message.includes('Test Error')) {
                return false
            }
        })
    })

    it('renders default content when no error', () => {
        cy.mount(ErrorBoundary, {
            slots: {
                default: '<div>No Error Content</div>'
            }
        })
        cy.contains('No Error Content').should('be.visible')
    })

    it('catches error and displays error message', () => {
        cy.mount(ErrorBoundary, {
            slots: {
                default: ThrowError
            }
        })

        cy.contains('Something went wrong').should('be.visible')
        cy.contains('Test Error').should('be.visible')
        cy.get('button').contains('Reload Application').should('be.visible')
    })
})
