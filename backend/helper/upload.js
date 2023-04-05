    
var multer = require('multer');
var path = require('path');
const { tempDir, archiveDir, renderDir, qc_renderDir, qc_screenshotDir } = require('../static_vars/upload_dirs')

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if (file.fieldname == "archive") {
                loc = archiveDir
            }
            if (file.fieldname == "render") {
                loc = renderDir
            }
            if (file.fieldname == "qcscreenshot") {
                loc = qc_screenshotDir
            }
            if (file.fieldname == "qcrender") {
                loc = qc_renderDir
            }
            cb(null, loc)
        },
        filename: function (req, file, cb) {

            const currentTime = new Date().getTime();
            var fileN = currentTime +  path.extname(file.originalname);
            if (file.fieldname == "archive") {
                req.archive = fileN;
            }
            if (file.fieldname == "render") {
                req.render = fileN;
            }
            if (file.fieldname == "qcscreenshot") {
                fileN = currentTime + "-qc-screenshot" + path.extname(file.originalname);
                req.qc_screenshot = fileN;
            }
            if (file.fieldname == "qcrender") {
                fileN = currentTime + "-qc-render" + path.extname(file.originalname);
                req.qc_render = fileN;
            }
            cb(null, fileN);
        }
    })
}).any(["archive", "render", "qcscreenshot", "qcrender"]);


module.exports = upload