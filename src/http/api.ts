import type { CreateUserData, credentials } from "../Types"
import { api } from "./client"
import { AUTH_SERVICE, AUTH_ROUTE, CATALOG_SERVICE } from "../constants"

export const login =(credentials:credentials) => {
    return api.post(`${AUTH_ROUTE}/login`,credentials)
}
export const self = () => {
    return api.get(`${AUTH_ROUTE}/self`)
}

export const logout = () => {
    return api.post(`${AUTH_ROUTE}/logout`)
}

export const getUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getTenants = () => api.get(`${AUTH_SERVICE}/tenants/`);
export const createUser = (user: CreateUserData) => api.post(`${AUTH_SERVICE}/users`, user);
export const updateUser = (user: CreateUserData, id: string) => api.patch(`${AUTH_SERVICE}/users/${id}`, user);

// Categories
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);

// Products
export const getProducts = (queryString: string) => api.get(`${CATALOG_SERVICE}/products?${queryString}`);
export const createProduct = (data: FormData) =>
    api.post(`${CATALOG_SERVICE}/products`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const updateProduct = (data: FormData, id: string) =>
    api.patch(`${CATALOG_SERVICE}/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });