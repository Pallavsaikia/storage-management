import { UPLOAD_CHUNK_SIZE_IN_BYTE } from "../metadata/APP_META";

export function sliceFile(file) {
    const sliceFileList = []

    const filesize = file.size
    var numberofChunks = Math.ceil(filesize / UPLOAD_CHUNK_SIZE_IN_BYTE);

    for (let i = 1; i <= numberofChunks; i++) {
        sliceFileList.push(file.slice((i - 1) * UPLOAD_CHUNK_SIZE_IN_BYTE, i * UPLOAD_CHUNK_SIZE_IN_BYTE))
    }
    return sliceFileList
}