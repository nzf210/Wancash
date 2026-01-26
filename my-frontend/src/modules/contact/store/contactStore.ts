import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { ContactFormData, Attachment } from '../types/contact.types'
import { submitContactForm } from '../services/contactApi'

export const useContactStore = defineStore('contact-form', () => {
    // State
    const loading = ref(false)
    const selectedType = ref('technical')
    const attachments = ref<Attachment[]>([])

    const form = reactive<ContactFormData>({
        name: '',
        email: '',
        wallet: '',
        subject: '',
        message: '',
        urgent: false
    })

    // Actions
    const resetForm = () => {
        form.name = ''
        form.email = ''
        form.wallet = ''
        form.subject = ''
        form.message = ''
        form.urgent = false
        attachments.value = []
        selectedType.value = 'technical'
    }

    const addAttachment = (file: File) => {
        if (file.size <= 5 * 1024 * 1024) {
            attachments.value.push({
                name: file.name,
                size: file.size,
                file
            })
            return true
        }
        return false
    }

    const removeAttachment = (index: number) => {
        if (index >= 0 && index < attachments.value.length) {
            attachments.value.splice(index, 1)
        }
    }

    const submitForm = async () => {
        loading.value = true
        try {
            const result = await submitContactForm({
                ...form,
                type: selectedType.value,
                attachments: attachments.value
            })

            if (result.success && result.data) {
                resetForm()
                return {
                    success: true,
                    message: `${result.data.message} Your ticket number is: ${result.data.ticketNumber}`,
                    ticketNumber: result.data.ticketNumber
                }
            } else {
                return { success: false, message: result.error || 'Failed to send message. Please try again.' }
            }
        } catch {
            return { success: false, message: 'Failed to send message. Please try again.' }
        } finally {
            loading.value = false
        }
    }

    return {
        // State
        loading,
        selectedType,
        attachments,
        form,
        // Actions
        resetForm,
        addAttachment,
        removeAttachment,
        submitForm
    }
})
