export function verifyRequiredPermissions(
  findUserPermission: { permissions: { type: string }[] },
  requiredPermissions: string[]
): boolean {
  if (!findUserPermission || !findUserPermission.permissions) {
    return false;
  }

  const userPermissions = findUserPermission.permissions.map(
    (permission) => permission.type
  );

  for (const permission of requiredPermissions) {
    if (userPermissions.includes(permission)) {
      return true;
    }
  }

  return false;
}

export function isValidEnumValue<T extends { [key: string]: any }>(
  enumObj: T,
  value: any
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}
