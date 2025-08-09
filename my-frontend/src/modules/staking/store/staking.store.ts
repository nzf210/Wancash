import { defineStore } from 'pinia'

export const useStakingStore = defineStore('staking', {
  state: () => ({
    balance: 1000,
    stakedAmount: 120,
    pendingRewards: 12.34,
    veSTG: 45
  }),
  actions: {
    stake(amount: number) {
      this.balance -= amount
      this.stakedAmount += amount
    },
    unstake(amount: number) {
      this.stakedAmount -= amount
      this.balance += amount
    },
    claimRewards() {
      this.pendingRewards = 0
    }
  }
})
