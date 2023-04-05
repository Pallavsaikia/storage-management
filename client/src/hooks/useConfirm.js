
import React, { useState } from 'react'
import { ConfirmDialog } from '../components/dialog/ConfirmDialog';

const createPromise = () => {
    let resolver;
    return [new Promise((resolve, reject) => {

        resolver = resolve
    }), resolver]
}


const useConfirm = () => {
    const [open, setOpen] = useState(false);
    const [resolver, setResolver] = useState({ resolver: null })
    const [label, setLabel] = useState('')

    const getConfirmation = async (text) => {
        setLabel(text);
        setOpen(true);
        const [promise, resolve] = await createPromise()
        setResolver({ resolve })
        return promise;
    }

    const onClick = async (status) => {
        setOpen(false);
        resolver.resolve(status)
    }

    function getUI(open) {
        if (open) {
            return (<ConfirmDialog label={label} onClick={onClick}></ConfirmDialog>)
          
        } else {
            return (<></>)
        }
    }

    const Confirmation = () => (
        (<>{getUI(open)}</>)
    )

    return [getConfirmation, Confirmation]

}

export default useConfirm;