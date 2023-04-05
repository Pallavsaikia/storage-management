export const uploadtype ={
    render:'render',
    archive:'archive',
    qc_render:'qc_render',
    qc_screenshot:'qc_screenshot',
}

export function getUploadTypeString(str){
    if(str===uploadtype.render){
        return 'render'
    }
    if(str===uploadtype.archive){
        return 'archive'
    }
    if(str===uploadtype.qc_render){
        return 'qc render'
    }
    if(str===uploadtype.qc_screenshot){
        return 'qc screenshot'
    }
    
}   