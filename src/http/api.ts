import type { credentials } from "../Types"
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

export const getUsers = () => {
    return api.get('/users')
}