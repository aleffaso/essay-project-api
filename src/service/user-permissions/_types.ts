export type UserPermissionType = {
  id: string;
  type: string;
};

export type UserPermissionCreateType = Omit<UserPermissionType, "id">;
