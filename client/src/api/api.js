import { REFRESHTOKEN_URL, LOGIN_URL, META_DATA_SET_CREATION_URL, SETS_URL, META_DATA_ROOM_CREATION_URL, GET_ROOM_IN_FOLDER_URL, ROOMS_URL, ROOM_DELETE_URL, SEARCH_URL, GET_PRESIGNED_UPLOAD_URLS, SET_MULTIPART_UPLOAD_COMPLETE_URL, DOWNLOAD_FILE_URL, } from "../metadata/URLS";
import axios from 'axios';
import { getJWT, getRefresh, setJWT } from "../util/local_storage/local_storage";
import { logout } from '../util/logout'
import { FILETYPES } from "../util/UPLOAD_FOLDER_DATA";

const GET = 'get'
const POST = 'post'
const PUT = 'put'

const FILE_CONTENT = 'multipart/form-data'

function axiosInit(method = GET, url, payload, request, contentType, uploadProgress) {
    return {
        method: method,
        url: url,
        data: payload,
        cancelToken: request ? request.token : null,
        headers: {
            'Authorization': getJWT(),
            'Content-Type': contentType ? contentType : 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
        onUploadProgress: uploadProgress
    }
}

async function axiosHandler(method, url, payload, request, contentType, uploadProgress) {

    try {
        const response = await axios(axiosInit(method, url, payload, request, contentType, uploadProgress))
        return response.data
    } catch (e) {

        if (e.response) {
            const data = e.response.data
            // none:0,
            // refresh: 1,
            // logout: 2,
            // invalidtoken:3

            data.cancelled = false
            if (data.__t === 0) {
                //no token error
                data.cancelAlert = false

            } else if (data.__t === 1) {
                data.cancelAlert = true
                const goAhead = await refreshToken()
                if (goAhead) {
                    return axiosHandler(method, url, payload, request, contentType, uploadProgress)
                }
                // refresh
            }
            else if (data.__t === 2) {
                data.cancelAlert = true
                logout()
            }
            else if (data.__t === 3) {
                data.cancelAlert = false
                logout()
            } else {

            }
            return data
        }

        if (e.code === "ERR_CANCELED") {
            e.cancelled = true
            const data = {
                success: false,
                message: 'cancelled',
                cancelAlert: true,
                cancelled: true,
            }
            return data
        }

        const data = {
            success: false,
            message: 'something went wrong',
            cancelAlert: false,
            cancelled: false,

        }
        return data

    }

}


async function refreshToken() {
    try {
        const payload = {
            refreshtoken: getRefresh()
        }
        const response = await axios(axiosInit(POST, REFRESHTOKEN_URL, payload, null))
        if (response.data.success) {

            setJWT(response.data.data.accesstoken)
            return true
        } else {

            return false
        }
    } catch (e) {
        if (e.response) {
            if (e.response.data.__t === 2 || e.response.data.__t === 3) {
                logout()
            }
        }
        return false
    }
}

export async function loginApi(email, password) {
    const payload = {
        email: email,
        password: password
    }
    const res = await axiosHandler(POST, LOGIN_URL, payload, null)
    return res
}


export async function getSets(pageno = 1) {
    const res = await axiosHandler(GET, SETS_URL + "?page=" + pageno, null, null)
    return res
}

export async function getSetByID(id, request) {
    const res = await axiosHandler(GET, SETS_URL + "/" + id, null, request)
    return res

}


export async function createSets(setid, style, createdby, isqcdone, isgltfdone, isactive, remarks) {
    const payload = {
        setid: setid,
        style: style,
        createdby: createdby,
        isqcdone: isqcdone,
        isgltfdone: isgltfdone,
        isactive: isactive,
        remarks: remarks
    }
    const res = await axiosHandler(POST, SETS_URL, payload, null)
    return res
}


export async function updateSets(id, setid, style, createdby, isqcdone, isgltfdone, isactive, remarks) {
    const payload = {
        _id: id,
        setid: setid,
        style: style,
        createdby: createdby,
        isqcdone: isqcdone,
        isgltfdone: isgltfdone,
        isactive: isactive,
        remarks: remarks
    }
    const res = await axiosHandler(PUT, SETS_URL, payload, null)
    return res

}

export async function getMetaForSetCreate() {
    const res = await axiosHandler(GET, META_DATA_SET_CREATION_URL, null, null)
    return res
}

export async function getRoomList(id) {
    const res = await axiosHandler(GET, GET_ROOM_IN_FOLDER_URL + "/" + id, null, null)
    return res
}

export async function getMetaForRoomCreate() {
    const res = await axiosHandler(GET, META_DATA_ROOM_CREATION_URL, null, null)
    return res
}


export async function addRoom(setid, roomtype) {
    const payload = {
        setid: setid,
        roomtype: roomtype
    }

    const res = await axiosHandler(POST, ROOMS_URL, payload, null)
    return res
}


export async function getRoom(id, cancelToken) {
    const res = await axiosHandler(GET, ROOMS_URL + "/" + id, null, cancelToken)

    return res
}

export async function updateroom(payload, setProgress) {

    const uploadProgress = function (progressEvent) {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted)
    }
    const res = await axiosHandler(PUT, ROOMS_URL, payload, null, FILE_CONTENT, uploadProgress)
    return res
}




export async function deleteRoom(roomid, password) {
    const payload = {
        roomid: roomid,
        password: password
    }

    const res = await axiosHandler(POST, ROOM_DELETE_URL, payload, null)
    return res
}


export async function searchSetOrRoom(searchstr) {
    const res = await axiosHandler(GET, SEARCH_URL + "/" + searchstr, null, null)
    return res
}

export async function getPresignedUrls(foldername, filename, roomid, chunkcount) {

    const res = await axiosHandler(GET, GET_PRESIGNED_UPLOAD_URLS
        + "?filePartCount=" + chunkcount
        + "&foldername=" + foldername
        + "&roomid=" + roomid
        + "&filename=" + filename,
        null, null)
    console.log(res)
    return res
}


export async function uploadToPresignedUrls(presignedurl, chunk, _id, indexofChunkList, setProgress, setProgressCounter) {

    const myUploadProgress = function (progressEvent) {

        setProgress(oldata => {
            for (let i = 0; i < oldata.length; i++) {
                if (oldata[i]._id === _id) {
                    oldata[i].chunkProgress[indexofChunkList] = progressEvent.loaded
                    var uploadsize = 0
                    for (let index = 0; index < oldata[i].chunkProgress.length; index++) {
                        uploadsize = uploadsize + oldata[i].chunkProgress[index]
                    }
                    oldata[i].progress = uploadsize * 100 / oldata[i].filesize
                }
            }
            return oldata
        })
        setProgressCounter(prevC => { return prevC + 1 })
    }

    return axios({
        method: PUT,
        url: presignedurl,
        data: chunk,
        onUploadProgress: myUploadProgress
    })
}


export async function multiPartUploadComplete(foldername, filename, uploadid, parts, roomid) {

    const payload = {
        fileParts: parts,
        foldername: foldername,
        filename: filename,
        uploadid: uploadid,
        roomid: roomid
    }
    const res = await axiosHandler(POST, SET_MULTIPART_UPLOAD_COMPLETE_URL, payload, null)
    return res
}


export async function downloadArchive(filename) {
    const res = await axiosHandler(GET, DOWNLOAD_FILE_URL + "/" + FILETYPES.archive.foldername + "/" + filename, null, null)
    return res
}