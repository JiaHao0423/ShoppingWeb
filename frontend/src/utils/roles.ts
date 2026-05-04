/** 後端權限字串可能含空白，或日後出現 ROLE_ 前綴 */
export const normalizeRole = (role: string) => role.trim().replace(/^ROLE_/i, "");

export const hasAdminRole = (roles?: string[] | null): boolean => {
  if (!roles?.length) return false;
  return roles.some((r) => normalizeRole(r).toUpperCase() === "ADMIN");
};
