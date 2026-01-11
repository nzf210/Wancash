/**
 * Redemption API - Re-export from global service
 * @deprecated Import from '@/app/services/redemptionService' instead
 * 
 * This file is kept for backward compatibility.
 * New code should import directly from the global service.
 */

export {
    redemptionService as redemptionApi,
    type CreateRedemptionRequest,
    type RedemptionRecord as RedemptionRequest,
    type GoldProduct,
    type RedemptionConfig
} from '@/app/services/redemptionService';

// For backward compatibility, re-export with old naming
import { redemptionService } from '@/app/services/redemptionService';
export { redemptionService };
