import type { CreateUserData, credentials } from "../Types"
import { api } from "./client"
import { AUTH_SERVICE } from "../constants"

export const login =(credentials:credentials) => {
    return api.post(`${AUTH_SERVICE}/login`,credentials)
}
export const self = () => {
    return api.get(`${AUTH_SERVICE}/self`)
}

export const logout = () => {
    return api.post(`${AUTH_SERVICE}/logout`)
}

export const getUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getTenants = () => api.get(`${AUTH_SERVICE}/tenants/`);
export const createUser = (user: CreateUserData) => api.post(`${AUTH_SERVICE}/users`, user);
export const updateUser = (user: CreateUserData, id: string) => api.patch(`${AUTH_SERVICE}/users/${id}`, user);