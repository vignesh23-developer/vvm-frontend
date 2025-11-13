import { create } from 'domain'

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
  // User Endpoints
  getUserProfile: '/profile',
  updateUserProfile: '/profile',
  getUserHistory: '/profile/login-history',
  // Roles Endpoints
  createRole: '/roles',
  getAllRoles: '/roles',
  getRoleByID: (roleId: string) => `/roles/${roleId}`,
  updateRole: (roleId: string) => `/roles/${roleId}`,
  deleteRole: (roleId: string) => `/roles/${roleId}`,
  // Properties Endpoints
  createProperty: '/properties',
  getAllProperties: '/properties',
  getAllPropertiesList: '/properties/search/list',
  getPropertiesByID: (propertyId: string) => `/properties/${propertyId}`,
  updatePropertiesByID: (propertyId: string) => `/properties/${propertyId}`,
  deletePropertiesByID: (propertyId: string) => `/properties/${propertyId}`,

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
  getPropertyReportByID: (reportId: string) => `/property-reports/${reportId}`,
  updatePropertyReportResolve: (reportId: string) => `/property-reports/${reportId}/resolve`,
  updatePropertyReportDismiss: (reportId: string) => `/property-reports/${reportId}/dismiss`,
  getAllPropertyCategoryFeatureMappings: '/property-category/feature-mappings',

  createProperties: (agentId: string) => `/properties/?ownerId=${agentId}`,
  updateProperties: `/properties/`,

  addPropertyMediaLink: (propertyId: string) => `/property-media/${propertyId}`,
  addPropertyMediaLocal: (propertyId: string) => `/property-media/${propertyId}/upload`,

  // Ads Endpoints
  createAd: '/ads',
  getAllAds: '/ads',
  getAdByID: (adId: string) => `/ads/${adId}`,
  updateAd: (adId: string) => `/ads/${adId}`,
  deleteAd: (adId: string) => `/ads/${adId}`,
  getAllAdsCategories: '/master/ads-category',

  // Favorite Endpoints
  toggleFavorite: '/user-interactions/favorites/toggle',
  deleteFavorite: (propertyId: string) => `/user-interactions/favorites/${propertyId}`,
  // Enquiry
  createPropertyEnquiry: '/user-interactions/enquiries',
  getPropertyEnquiry: '/user-interactions/enquiries',

  // agent company profile
  createCompanyProfile: '/agent-company-profiles',
  getCompanyProfile: '/agent-company-profiles',
  getCompanyProfileByID: (agentId: string) => `/agent-company-profiles/${agentId}`,
  updateCompanyProfile: (agentId: string) => `/agent-company-profiles/${agentId}`,
  verifyCompanyProfileName: (profileName: string) => `/agent-company-profiles/verify-profile-name?name=${encodeURIComponent(profileName)}`,
  validateProfileName: '/agent-company-profiles/validate-profile-name',
  deleteCompanyProfile: (agentId: string) => `/agent-company-profiles/${agentId}`,
}
