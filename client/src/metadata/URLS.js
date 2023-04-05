import { APP_URL, BASE_URL } from "./APP_META"

export const REFRESHTOKEN_URL = APP_URL + "/refreshtoken"


export const LOGIN_URL = APP_URL + "/login"
export const SETS_URL = APP_URL + "/sets"
export const ROOMS_URL = APP_URL + "/rooms"
export const SEARCH_URL = APP_URL + "/search"
export const ROOM_DELETE_URL = APP_URL + "/delete-room"
export const META_DATA_SET_CREATION_URL = APP_URL + "/pre-set-create-data"
export const META_DATA_ROOM_CREATION_URL = APP_URL + "/pre-room-create-data"
export const GET_ROOM_IN_FOLDER_URL = SETS_URL + "/list-all-rooms"
export const DOWNLOAD_FILE_URL = APP_URL + "/download"
export const UPLOAD_FUNC_URL = APP_URL + "/upload"
export const GET_PRESIGNED_UPLOAD_URLS = UPLOAD_FUNC_URL + "/get_multipart_upload_urls"
export const SET_MULTIPART_UPLOAD_COMPLETE_URL = UPLOAD_FUNC_URL + "/multipart_upload_complete"

export const RENDER_FILE_URL = BASE_URL + "files/render/"
export const QC_RENDER_FILE_URL = BASE_URL + "files/qc_render/"
export const QC_SCREENSHOT_FILE_URL = BASE_URL + "files/qc_screenshot/"

