import {clearAllLocalStorage} from './local_storage/local_storage' 
export function logout(){
    clearAllLocalStorage()
    window.location.href = '/';
}