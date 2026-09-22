export interface SubscriptionItem {
    id: number;
    name: string;
    type: string; // BASIC_FEATURE, ADDON_BOOSTER, ADDON_SERVICE
    valueType: string; // BOOLEAN, NUMERIC, TEXT, DAYS
    category?: string;
    unit?: string;
    description?: string;
    basePrice: number;
    defaultValue: number;
    isPremium: boolean;
    isAddon: boolean;
    displayOrder: number;
    iconName?: string;
    isActive: boolean;
}

export interface SubscriptionPlanItem {
    id: number;
    plan_id: number;
    item_id: number;
    isIncluded: boolean;
    isConfigurable: boolean;
    price: number;
    numericValue: number;
    textValue?: string;
    durationDays: number;
    isUnlimited: boolean;
    isHighlighted: boolean;
    customSettings?: any;
    item?: SubscriptionItem;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    tagline?: string;
    price: number;
    hasValueBasedPricing: boolean;
    valuePricingTiers?: any;
    durationDays: number;
    billingCycle: string;
    targetAudience?: string;
    description?: string;
    displayOrder: number;
    isPopular: boolean;
    isActive: boolean;
    planItems?: SubscriptionPlanItem[];
}

export interface UserSubscriptionUsage {
    id: number;
    user_subscription_id: number;
    item_id: number;
    usedCount: number;
    usedValue: number;
    usageDetails?: any;
    lastUsedAt?: string; // ISO Date string
    item?: SubscriptionItem;
}

export interface UserPurchasedItem {
    id: number;
    user_subscription_id: number;
    item_id: number;
    plan_item_id?: number;
    startDate: string; // ISO Date string
    endDate: string; // ISO Date string
    isActive: boolean;
    paidAmount: number;
    status: string;
    paymentStatus: string;
    transactionId?: string;
    appliedTo?: string;
    itemSettings?: any;
    item?: SubscriptionItem;
}

export interface UserSubscription {
    id: number;
    user_id: number;
    plan_id: number;
    startDate: string; // ISO Date string
    endDate: string; // ISO Date string
    isActive: boolean;
    autoRenew: boolean;
    paidAmount?: number;
    status: string;
    paymentStatus?: string;
    transactionId?: string;
    promoCodeUsed?: string;
    canceledAt?: string; // ISO Date string
    cancellationReason?: string;
    plan?: SubscriptionPlan;
    usages?: UserSubscriptionUsage[];
    purchasedItems?: UserPurchasedItem[];
}
