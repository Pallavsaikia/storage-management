const fs =require('fs')
const path=require('path')
const { renderDir,qc_screenshotDir,qc_renderDir,archiveDir}=require('../../static_vars/upload_dirs')
module.exports=function(render,qcscreenshot,qcrender,archive){
    if(render){
        fs.unlink(path.join(appRoot,renderDir, render), (err) => {
            if (err) console.log(err)
        });

    }
    if(qcscreenshot){
        fs.unlink(path.join(appRoot,qc_screenshotDir, qcscreenshot), (err) => {
            if (err) console.log(err)
        });

    }

    if(qcrender){
        fs.unlink(path.join(appRoot,qc_renderDir, qcrender), (err) => {
            if (err) console.log(err)
        });

    }
    
    if(archive){
        fs.unlink(path.join(appRoot,archiveDir, archive), (err) => {
            if (err) console.log(err)
        });

    }


}