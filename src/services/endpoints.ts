export const appEnpoints = {
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
  // Property Category Endpoints
  createPropertyCategory: '/master/property-categories',
  getAllPropertyCategories: '/master/property-categories',
  getPropertyCategoryByID: (categoryId: string) =>
    `/master/property-categories/${categoryId}`,
  updatePropertyCategory: (categoryId: string) =>
    `/master/property-categories/${categoryId}`,
  updatePropertyCategoryStatus: (categoryId: string) =>
    `/master/property-categories/${categoryId}/status`,
  deletePropertyCategory: (categoryId: string) =>
    `/master/property-categories/${categoryId}`,
  // Feature Category Endpoints
  createFeatureCategory: '/master/feature-categories',
  getAllFeatureCategories: '/master/feature-categories',
  getFeatureCategoryByID: (categoryId: string) =>
    `/master/feature-categories/${categoryId}`,
  updateFeatureCategory: (categoryId: string) =>
    `/master/feature-categories/${categoryId}`,
  updateFeatureCategoryStatus: (categoryId: string) =>
    `/master/feature-categories/${categoryId}/status`,
  getFeatureCategoryOptions: (categoryId: string) =>
    `/master/feature-categories/${categoryId}/options`,
  updateFeatureCategoryOptions: (categoryId: string) =>
    `/master/feature-categories/${categoryId}/with-options`,
  deleteFeatureCategory: (categoryId: string) =>
    `/master/feature-categories/${categoryId}`,
  // Feature Group Endpoints
  createFeatureGroup: '/master/feature-groups',
  getAllFeatureGroups: '/master/feature-groups',
  getFeatureGroupByID: (groupId: string) => `/master/feature-groups/${groupId}`,
  updateFeatureGroup: (groupId: string) => `/master/feature-groups/${groupId}`,
  updateFeatureGroupStatus: (groupId: string) =>
    `/master/feature-groups/${groupId}/status`,
  deleteFeatureGroup: (groupId: string) => `/master/feature-groups/${groupId}`,
  // Property Category Features Mapping Endpoints
  mapFeaturesToPropertyCategory: '/master/property-mapping/apply',
  getAllPropertyCategoryFeatureMappings: '/property-category/feature-mappings',
  getPropertyCategoryFeatureMappingByID: (mappingId: string) =>
    `/master/property-mapping/${mappingId}`,
  updatePropertyCategoryFeatureMapping: (mappingId: string) =>
    `/master/property-mapping/apply/${mappingId}`,
  deletePropertyCategoryFeatureMapping: (mappingId: string) =>
    `/property-category/feature-mappings/${mappingId}`,
}
