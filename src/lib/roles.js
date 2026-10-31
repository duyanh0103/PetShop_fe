// Roles allowed into the /admin area. CUSTOMER accounts only use the storefront.
export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "STAFF"];

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);
