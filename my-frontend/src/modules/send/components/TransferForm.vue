<template>
  <div
    class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
    <div class="p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Transfer Form</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Fill in token transfer details to the destination address
          </p>
        </div>
      </div>

      <div class="space-y-8">
        <RecipientInput :recipient-address="form.recipientAddress" :address-error="addressError"
          :recipient-name="recipientName" @update:recipient-address="updateRecipientAddress"
          @show-address-book="$emit('show-address-book')" @validate-address="$emit('validate-address')" />

        <AmountInput :amount="form.amount" :minimum-transfer="minimumTransfer" :max-transferable="maxTransferable"
          :amount-error="amountError" :equivalent-value="equivalentValue" @update:amount="updateAmount"
          @set-max-amount="$emit('set-max-amount')" @validate-amount="$emit('validate-amount')" />

        <NetworkFeeDisplay :network-fee="networkFee" :estimated-time="estimatedTime" :total-amount="totalAmount" />

        <MemoInput :memo="form.memo" @update:memo="updateMemo" />

        <TermsCheckbox :agree-terms="agreeTerms" @update:agree-terms="$emit('update:agree-terms', $event)" />
      </div>
    </div>
  </div>

  <div class="flex flex-col sm:flex-row gap-4 mt-8">
    <Button @click="$emit('reset-form')"
      class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl py-4 text-lg font-semibold transition-colors">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Reset Form
    </Button>
    <Button @click="$emit('preview-transfer')" :disabled="!isFormValid"
      class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Continue to Preview
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import RecipientInput from './RecipientInput.vue'
import AmountInput from './AmountInput.vue'
import NetworkFeeDisplay from './NetworkFeeDisplay.vue'
import MemoInput from './MemoInput.vue'
import TermsCheckbox from './TermsCheckbox.vue'

const props = defineProps<{
  form: { recipientAddress: string; amount: string; memo: string };
  minimumTransfer: number;
  maxTransferable: number;
  networkFee: number;
  estimatedTime: string;
  agreeTerms: boolean;
  addressError: string;
  amountError: string;
  recipientName: string;
  equivalentValue: number;
  totalAmount: number;
}>()

const emit = defineEmits<{
  'update:form': [{ recipientAddress: string; amount: string; memo: string }];
  'update:agree-terms': [boolean];
  'validate-address': [];
  'validate-amount': [];
  'set-max-amount': [];
  'show-address-book': [];
  'preview-transfer': [];
  'reset-form': [];
}>()

const updateRecipientAddress = (value: string) => emit('update:form', { ...props.form, recipientAddress: value })
const updateAmount = (value: string) => emit('update:form', { ...props.form, amount: value })
const updateMemo = (value: string) => emit('update:form', { ...props.form, memo: value })

// This computed is passed from parent, but if needed, can be local
const isFormValid = computed(() => true) // Placeholder; actual in parent
</script>
