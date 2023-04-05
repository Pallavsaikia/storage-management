const fs = require('fs')
const path = require('path')
const { renderDir, qc_renderDir, qc_screenshotDir, tempDir, archiveDir, protectedZipDir } = require('../../static_vars/upload_dirs')

module.exports = function () {
    const renderFolder = path.join(appRoot, renderDir)
    const qcRenderFolder = path.join(appRoot, qc_renderDir)
    const qcScreenshotFolder = path.join(appRoot, qc_screenshotDir)
    const tempFolder = path.join(appRoot, tempDir)
    const archiveFolder = path.join(appRoot, archiveDir)
    const protectedZipFolder = path.join(appRoot, protectedZipDir)

    if (!fs.existsSync(renderFolder)) {
        fs.mkdirSync(renderFolder, { recursive: true });
    }
    if (!fs.existsSync(qcRenderFolder)) {
        fs.mkdirSync(qcRenderFolder, { recursive: true });
    }
    if (!fs.existsSync(qcScreenshotFolder)) {
        fs.mkdirSync(qcScreenshotFolder, { recursive: true });
    }
    if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder, { recursive: true });
    }
    if (!fs.existsSync(archiveFolder)) {
        fs.mkdirSync(archiveFolder, { recursive: true });
    }
    if (!fs.existsSync(protectedZipFolder)) {
        fs.mkdirSync(protectedZipFolder, { recursive: true });
    }
    if (!fs.existsSync(protectedZipFolder)) {
        fs.mkdirSync(protectedZipFolder, { recursive: true });
    }
}