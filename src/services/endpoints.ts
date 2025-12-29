import { create } from 'domain'
import { get } from 'http'

export const appEndpoints = {
  // Authentication Endpoints
  login: '/login',
  signUp: '/register',
  loginSendOtp: '/login/send-otp',
  loginVerifyOtp: '/login/verify-otp',
  loginRefreshToken: '/login/refresh-token',
  logout: '/login/sign-out',
  loginUpgradeJWT: '/login/upgrade-jwt',
  forgetPassword: '/forgot-password',
  resetPassword: '/forgot-password/reset',

  // home page endpoints
  getHomePageData: '/home',

  // dashboard endpoints
  getDashboardData: '/dashboard',
  // User Endpoints
  getUserProfile: '/profile',
  updateUserProfile: '/profile',
  uploadUserProfileImage: '/profile/picture',
  getUserHistory: '/profile/login-history',

  // KYC enpoints
  // kyc status
  getUserKycStatus: '/kyc/status',

  // payment not done
  createKycOrder: '/kyc/initiate-order',
  verifyKycOrder: '/kyc/verify-order',

  // payment done
  initiateKyc: '/kyc/initiate',
  completeKyc: '/kyc/complete',

  // Roles Endpoints
  createRole: '/roles',
  getAllRoles: '/roles',
  getRoleByID: (roleId: string) => `/roles/${roleId}`,
  updateRole: (roleId: string) => `/roles/${roleId}`,
  deleteRole: (roleId: string) => `/roles/${roleId}`,
  // Properties Endpoints
  createProperty: '/properties',
  getAllProperties: '/properties',
  // elastic search endpoints
  getSearchByProperties: '/search/properties',
  getAllPropertiesList: '/properties/search/list',
  getAllPropertyDistrictSummary: '/properties/search/district-summary',
  // New Search Service Endpoints
  publicSearchProperties: '/search/properties',
  publicSearchPropertyFilters: '/search/properties-filters',
  publicSearchAgents: '/search/agents',
  publicSearchAds: '/search/ads',
  publicSearchAgentsAutocomplete: '/search/agents/autocomplete',
  publicSearchAgentsFilters: '/search/agents/filters',
  getPropertiesByID: (propertyId: string) => `/properties/${propertyId}`,
  getAgentPropertiesById: `/properties/my-properties`,
  updatePropertiesByID: (propertyId: string) => `/properties/${propertyId}`,
  deletePropertiesByID: (propertyId: string) => `/properties/${propertyId}`,
  getPropertyFavorite: '/properties/favorites',
  getPropertyByID: (propertyId: string) => `/properties/${propertyId}`,
  updateProperty: (propertyId: string) => `/properties/${propertyId}`,
  updatePropertyStatus: (propertyId: string) => `/properties/${propertyId}/status`,
  deleteProperty: (propertyId: string) => `/properties/${propertyId}`,
  // Property Category Endpoints
  createPropertyCategory: '/master/property-categories',
  getAllPropertyCategories: '/master/property-categories',
  getPropertyCategoryByID: (categoryId: string) => `/master/property-categories/${categoryId}`,
  updatePropertyCategory: (categoryId: string) => `/master/property-categories/${categoryId}`,
  updatePropertyCategoryStatus: (categoryId: string) => `/master/property-categories/${categoryId}/status`,
  deletePropertyCategory: (categoryId: string) => `/master/property-categories/${categoryId}`,
  // Feature Category Endpoints
  createFeatureCategory: '/master/feature-categories',
  getAllFeatureCategories: '/master/feature-categories',
  getFeatureCategoryByID: (categoryId: string) => `/master/feature-categories/${categoryId}`,
  updateFeatureCategory: (categoryId: string) => `/master/feature-categories/${categoryId}`,
  updateFeatureCategoryStatus: (categoryId: string) => `/master/feature-categories/${categoryId}/status`,
  getFeatureCategoryOptions: (categoryId: string) => `/master/feature-categories/${categoryId}/options`,
  updateFeatureCategoryOptions: (categoryId: string) => `/master/feature-categories/${categoryId}/with-options`,
  deleteFeatureCategory: (categoryId: string) => `/master/feature-categories/${categoryId}`,
  // Feature Group Endpoints
  createFeatureGroup: '/master/feature-groups',
  getAllFeatureGroups: '/master/feature-groups',
  getFeatureGroupByID: (groupId: string) => `/master/feature-groups/${groupId}`,
  updateFeatureGroup: (groupId: string) => `/master/feature-groups/${groupId}`,
  updateFeatureGroupStatus: (groupId: string) => `/master/feature-groups/${groupId}/status`,
  deleteFeatureGroup: (groupId: string) => `/master/feature-groups/${groupId}`,
  // Property Category Features Mapping Endpoints
  mapFeaturesToPropertyCategory: '/master/property-mapping/apply',
  getPropertyCategoryFeatureMappingByID: (mappingId: string) => `/master/property-mapping/${mappingId}`,
  updatePropertyCategoryFeatureMapping: `/master/property-mapping/apply`,

  // Property Approval Endpoints
  getAllPropertyApprovals: '/property-approvals',
  getPropertyApprovalByID: (propertyId: string) => `/property-approvals/${propertyId}`,
  getAllPropertyApprovalStats: '/property-approvals/stats',
  approveProperty: (propertyId: string) => `/property-approvals/property/${propertyId}/approve`,
  rejectProperty: (propertyId: string) => `/property-approvals/property/${propertyId}/reject`,
  requestChangesProperty: (propertyId: string) => `/property-approvals/${propertyId}/request-changes`,
  // Property Reports Endpoints
  createPropertyReport: (propertyId: string) => `/property-reports/${propertyId}`,
  getAllPropertyReports: '/property-reports',
  getAllReportByPropertyID: (propertyId: string) => `/property-reports/by-property/${propertyId}`,
  getPropertyReportByID: (reportId: string) => `/property-reports/${reportId}`,
  updatePropertyReportResolve: (reportId: string) => `/property-reports/${reportId}/resolve`,
  updatePropertyReportDismiss: (reportId: string) => `/property-reports/${reportId}/dismiss`,
  getAllPropertyCategoryFeatureMappings: '/property-category/feature-mappings',

  createProperties: (agentId: string) => `/properties/?ownerId=${agentId}`,
  updateProperties: `/properties/`,

  // Property images
  addPropertyMediaLink: (propertyId: string) => `/property-media/${propertyId}`,
  addPropertyMediaLocal: (propertyId: string) => `/property-media/${propertyId}/upload`,

  // Ads Category Endpoints
  createAdsCategory: '/master/ads-category',
  getAdsCategoryByID: (categoryId: string) => `/master/ads-category/${categoryId}`,
  updateAdsCategory: (categoryId: string) => `/master/ads-category/${categoryId}`,
  updateAdsCategoryStatus: (categoryId: string) => `/master/ads-category/${categoryId}/status`,

  // Property Images
  addPropertyImages: (propertyId: string) => `/property-media/${propertyId}/upload`,
  getPropertyImages: (propertyId: string) => `/property-media/${propertyId}`,
  updatePropertyImage: (propertyId: string, imageId: string) => `/property-media/${propertyId}/${imageId}`,
  deletePropertyImage: (propertyId: string, imageId: string) => `/property-media/${propertyId}/${imageId}`,

  // Ads Endpoints
  createAd: '/ads',
  getAllAds: '/ads',
  getAdByID: (adId: string) => `/ads/${adId}`,
  updateAd: (adId: string) => `/ads/${adId}`,
  deleteAd: (adId: string) => `/ads/${adId}`,
  getAllAdsCategories: '/master/ads-category',
  approveAd: (adId: string) => `/ad-approvals/ad/${adId}/approve`,
  rejectAd: (adId: string) => `/ad-approvals/ad/${adId}/reject`,
  getAllAdReports: '/ad-reports',
  getAllReportByAdsID: (adsId: string) => `/ad-reports/by-ad/${adsId}`,
  getAdReportByID: (reportId: string) => `/ad-reports/${reportId}`,
  createAdReport: (adId: string) => `/ad-reports/${adId}`,
  // Ads Images
  addAdImages: (adId: string) => `/ads/${adId}/images`,
  getAdImages: (adId: string) => `/ads/${adId}/images`,
  updateAdImage: (adId: string, imageId: string) => `/ads/${adId}/images/${imageId}`,
  deleteAdImage: (adId: string, imageId: string) => `/ads/${adId}/images/${imageId}`,
  // Favorite Endpoints

  toggleFavorite: '/user-interactions/favorites/toggle',

  deleteFavorite: (propertyId: string) => `/user-interactions/favorites/${propertyId}`,
  // Enquiry
  createPropertyEnquiry: '/user-interactions/enquiries',
  getAllEnquiryByPropertyIdOrAdsId: (entity_type: string, id: string) => `/user-interactions/enquiries/by-entity/${entity_type}/${id}`,
  createEnquiry: '/user-interactions/enquiries',
  getPropertyEnquiry: '/user-interactions/enquiries',
  getAdEnquiry: '/user-interactions/enquiries',

  // agent company profile
  createCompanyProfile: '/agent-company-profiles',
  getCompanyProfile: '/agent-company-profiles',
  getCompanyProfileByID: (agentId: string) => `/agent-company-profiles/${agentId}`,
  getCompanyProfilesByUserID: (userId: string) => `/agent-company-profiles/by-user/${userId}`,
  getCompanyProfilesByName: (profileName: string) => `/agent-company-profiles/by-profile/${profileName}`,
  updateCompanyProfile: (agentId: string) => `/agent-company-profiles/${agentId}`,
  verifyCompanyProfileName: (profileName: string) => `/agent-company-profiles/verify-profile-name?name=${encodeURIComponent(profileName)}`,
  validateProfileName: '/agent-company-profiles/validate-profile-name',
  deleteCompanyProfile: (agentId: string) => `/agent-company-profiles/${agentId}`,
  uploadCompanyProfileImage: (agentId: string) => `/agent-company-profiles/${agentId}/logo`,

  // subscription
  getPublicPlans: '/subscription-plans?includeItems=true',
  getPublicPlan: (planId: string) => `/subscription-plans/${planId}`,
  getUserSubscription: (userId: string) => `/users/${userId}/subscriptions`,
  createSubscriptionOrder: (userId: string) => `/users/${userId}/subscribe/order`,
  verifySubscriptionPayment: (userId: string) => `/users/${userId}/subscribe/verify`,
  createUpgradeOrder: (userId: string, subscriptionId: number) => `/users/${userId}/subscription/${subscriptionId}/upgrade/order`,
  createDowngradeOrder: (userId: string, subscriptionId: number) => `/users/${userId}/subscription/${subscriptionId}/downgrade/order`,
  cancelSubscription: (userId: string, subscriptionId: number) => `/users/${userId}/subscription/${subscriptionId}/cancel`,
  getAllSubscription: "/users/subscriptions/all",
  getSubscriptionPlanAnalytics: '/users/subscriptions/analytics',

  // Addons
  getUserAddons: (userId: string) => `/users/${userId}/add-ons`,
  createAddonOrder: (userId: string) => `/users/${userId}/addons/order`,
  verifyAddonPayment: (userId: string) => `/users/${userId}/addons/verify`,
  purchaseAddon: (userId: string) => `/users/${userId}/add-ons`,
  getFeatureAccess: (userId: string, featureName: string) => `/users/${userId}/features/${featureName}/access`,
  getFeatureUsage: (userId: string) => `/users/${userId}/features/usage`,
  recordFeatureUsage: (userId: string, featureName: string) => `/users/${userId}/features/${featureName}/usage`,

  // Payment Transactions
  getUserTransactions: '/payment-transactions/users/transactions',
  getAllTransactions: '/payment-transactions/transactions',
  getTransactionAnalytics: '/payment-transactions/analytics',
  getTransactionInvoice: (transactionId: string) => `/payment-transactions/transactions/${transactionId}/invoice`,
  // User Wallets
  getUserWalletBalance: (userId: string) => `/user-wallets/users/${userId}/balance`,

  // Reviews Endpoints
  createReview: '/reviews',
  getAllReviews: '/reviews',
  getReviewByID: (reviewId: string) => `/reviews/${reviewId}`,
  updateReview: (reviewId: string) => `/reviews/${reviewId}`,
  deleteReview: (reviewId: string) => `/reviews/${reviewId}`,

  // Notification Endpoints
  getNotifications: '/notifications',
  getUnreadCount: '/notifications/unread-count',
  markNotificationAsRead: (id: string) => `/notifications/${id}/read`,
  markMultipleAsRead: '/notifications/mark-read',
  markAllAsRead: '/notifications/mark-all-read',
  deleteNotification: (id: string) => `/notifications/${id}`,
  deleteAllNotifications: '/notifications',
  // Admin Notification Endpoints
  getNotificationTemplates: '/admin/notifications/templates',
  getNotificationTemplate: (id: string) => `/admin/notifications/templates/${id}`,
  getNotificationTemplateByCode: (code: string) => `/admin/notifications/templates/code/${code}`,
  createNotificationTemplate: '/admin/notifications/templates',
  updateNotificationTemplate: (id: string) => `/admin/notifications/templates/${id}`,
  deleteNotificationTemplate: (id: string) => `/admin/notifications/templates/${id}`,
  sendNotification: '/admin/notifications/send',
  sendBulkNotification: '/admin/notifications/send-bulk',
  getUserQuota: (userId: string) => `/admin/notifications/quota/user/${userId}`,
  getUsersNearQuotaLimit: '/admin/notifications/quota/near-limit',
  processScheduledNotifications: '/admin/notifications/process-scheduled',
  previewNotificationTemplate: '/admin/notifications/templates/preview',

  // Newsletter Endpoints
  getAllNewsletters: '/newsletters',
  createNewsletter: '/newsletters',
  subscribeNewsletter: '/newsletters/subscribe',
  unsubscribeNewsletter: '/newsletters/unsubscribe',
  getNewsletterAnalytics: '/newsletters/analytics',
}




export const testAppEndpoints = { 
  testKycNotification: '/kyc/test/notification',
}
