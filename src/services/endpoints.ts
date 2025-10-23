
export const appEnpoints = {
    // Authentication Endpoints
    "login": "/login",
    "signUp": "/register",
    "loginSendOtp": "/login/send-otp",
    "loginVerifyOtp": "/login/verify-otp",
    "loginRefreshToken": "/login/refresh-token",
    "logout": "/login/sign-out",
    "loginUpgradeJWT": "/login/upgrade-jwt",
    "forgetPassword": "/forgot-password",
    "resetPassword": "/forgot-password/reset",
    // User Endpoints
    "getUserProfile": "/profile",
    "updateUserProfile": "/profile",
    "getUserHistory": "/profile/login-history",
    // Roles Endpoints
    "createRole": "/roles",
    "getAllRoles": "/roles",
    "getRoleByID": (roleId: string) => `/roles/${roleId}`,
    "updateRole": (roleId: string) => `/roles/${roleId}`,
    "deleteRole": (roleId: string) => `/roles/${roleId}`,
    // Property Category Endpoints
    "createPropertyCategory": "/master/property-categories?activeOnly=true",
    "getAllPropertyCategories": "/master/property-categories",
    "getPropertyCategoryByID": (categoryId: string) => `/master/property-categories/${categoryId}`,
    "updatePropertyCategory": (categoryId: string) => `/master/property-categories/${categoryId}`,
    "deletePropertyCategory": (categoryId: string) => `/master/property-categories/${categoryId}`,
    // Feature Category Endpoints
    "createFeatureCategory": "/features-category",
    "getAllFeatureCategories": "/features-category",
    "getFeatureCategoryByID": (categoryId: string) => `/features-category/${categoryId}`,
    "updateFeatureCategory": (categoryId: string) => `/features-category/${categoryId}`,
    "deleteFeatureCategory": (categoryId: string) => `/features-category/${categoryId}`,
    // Feature Options Endpoints
    "createFeatureOption": "/feature_options",
    "getAllFeatureOptions": "/feature_options",
    "getFeatureOptionByID": (optionId: string) => `/feature_options/${optionId}`,
    "updateFeatureOption": (optionId: string) => `/feature_options/${optionId}`,
    "deleteFeatureOption": (optionId: string) => `/feature_options/${optionId}`,
    // Property Category Features Mapping Endpoints
    "mapFeaturesToPropertyCategory": "/property-category/feature-mappings",
    "getAllPropertyCategoryFeatureMappings": "/property-category/feature-mappings",
    "getPropertyCategoryFeatureMappingByID": (mappingId: string) => `/property-category/feature-mappings/${mappingId}`,
    "updatePropertyCategoryFeatureMapping": (mappingId: string) => `/property-category/feature-mappings/${mappingId}`,
    "deletePropertyCategoryFeatureMapping": (mappingId: string) => `/property-category/feature-mappings/${mappingId}`,
}; 