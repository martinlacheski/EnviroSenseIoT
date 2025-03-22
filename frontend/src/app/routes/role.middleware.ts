export enum RolesEnum {
    ADMIN = "ADMIN",
    USUARIO = "USUARIO",
}

export const hasRole = (roles: string[], requiredRoles: string[]) => {
    return requiredRoles.some(role => roles.includes(role));
};