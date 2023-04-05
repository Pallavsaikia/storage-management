export function debounce(cb,delay=500){
    let timeout
    return (...args)=>{
        clearTimeout(timeout)
         timeout=setTimeout(()=>{
            cb(...args)
        },delay)
    }
}