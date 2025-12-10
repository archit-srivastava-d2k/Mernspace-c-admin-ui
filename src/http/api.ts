import type { CreateUserData, credentials } from "../Types"
import { api } from "./client"


export const login =(credentials:credentials) => {
    return api.post('/auth/login',credentials)
}
export const self = () => {
    return api.get('/auth/self')
}

export const logout = () => {
    return api.post('/auth/logout')
}

export const getUsers = (queryString: string) => api.get(`/users?${queryString}`);
export const getTenants = () => api.get('/tenants/');
export const createUser = (user: CreateUserData) => api.post('/users', user);