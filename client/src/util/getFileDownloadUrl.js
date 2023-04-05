import { DOWNLOAD_FILE_URL } from "../metadata/URLS";

export const filetypeDict = {
    archive: 'archive',
    render: 'render',
    qcrender: 'qcrender',
    qcscreenshot: 'qcscreenshot'
}

export default function generateFileURL(filekey,filetype, token, ) {
    return DOWNLOAD_FILE_URL + "/" + filetype + "?token=" + token + "&filekey=" + filekey
}