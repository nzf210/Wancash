import type { RouteRecordRaw } from 'vue-router'

import FeaturePage from '@/modules/features/pages/FeaturePage.vue'
import StakingPage from '@/modules/staking/pages/StakingPage.vue'
import BuyTokenPage from '@/modules/buyToken/pages/BuyTokenPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/features',
  },
  {
    path: '/features',
    name: 'Features',
    component: FeaturePage,
  },
  {
    path: '/staking',
    name: 'Staking',
    component: StakingPage,
  },
  {
    path: '/buy-token',
    name: 'BuyToken',
    component: BuyTokenPage,
  },
]

export default routes
