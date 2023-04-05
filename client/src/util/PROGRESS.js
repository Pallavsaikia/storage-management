export function PROGRESS_OBJ(_id, filename, progress, type, chunkProgressArray, filesize) {
    return {
        _id: _id,
        filename: filename,
        progress: progress,
        type: type,
        chunkProgress: chunkProgressArray,
        filesize: filesize
    }
}