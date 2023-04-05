import { TOKEN_EMAIL, TOKEN_EMP_ID, TOKEN_JWT, TOKEN_NAME, TOKEN_ROLE, TOKEN_REFRESH } from "./tokens/tokens"


function setLocalStorage(key, str) {
    try {
        localStorage.setItem(key, str)
        return true
    } catch (e) {
        return false
    }
}


export function getRefresh() {
    return localStorage.getItem(TOKEN_REFRESH)
}
export function setRefresh(str) {
    return setLocalStorage(TOKEN_REFRESH, str)
}

export function getJWT() {
    return localStorage.getItem(TOKEN_JWT)
}
export function setJWT(str) {
    return setLocalStorage(TOKEN_JWT, str)
}


export function getName() {
    return localStorage.getItem(TOKEN_NAME)
}
export function setName(str) {
    return setLocalStorage(TOKEN_NAME, str)
}


export function getEmail() {
    return localStorage.getItem(TOKEN_EMAIL)
}
export function setEmail(str) {
    return setLocalStorage(TOKEN_EMAIL, str)
}


export function getRole() {
    return localStorage.getItem(TOKEN_ROLE)
}
export function setRole(str) {
    return setLocalStorage(TOKEN_ROLE, str)
}


export function getEmpID() {
    return localStorage.getItem(TOKEN_EMP_ID)
}
export function setEmpID(str) {
    return setLocalStorage(TOKEN_EMP_ID, str)
}

export function clearAllLocalStorage() {
    localStorage.clear()
}