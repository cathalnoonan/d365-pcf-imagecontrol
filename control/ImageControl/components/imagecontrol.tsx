import * as React from 'react'
import classNames from 'classnames'
import imageCompression from 'browser-image-compression'

import { ResourceStrings } from '../strings'
import { FieldLengthValidator, addDataImage, removeDataImage, toBase64, fromFileObject } from '../utilities'

export interface ImageControlComponentProps {
    value: string | null
    displayBorder: boolean
    resourceStrings: ResourceStrings
    attribute: {
        fieldLength: number
        maxFieldLength: number
        isDisabled: boolean
        isEditable: boolean
    }
    updateValue: (value: string | null) => void
    pickFile: () => Promise<ComponentFramework.FileObject[]>
    alertError: (message: string) => void
}

export function ImageControlComponent(props: ImageControlComponentProps) {
    const fieldLengthValidator = new FieldLengthValidator({
        fieldLength: props.attribute.fieldLength,
        maxFieldLength: props.attribute.maxFieldLength,
        resourceStrings: props.resourceStrings,
    })

    // State
    const isEmpty = !props.value
    const isEditable = !props.attribute.isDisabled && props.attribute.isEditable
    const imageSrc = isEmpty ? '' : addDataImage(props.value!)
    const updateValue = (value: string | null) => {
        if (!isEditable) return

        if (value) {
            value = removeDataImage(value)
        }
        props.updateValue(value)
    }
    const [isProcessingLargeImage, setIsProcessingLargeImage] = React.useState<boolean | null>(null)

    // Styles
    const labelClass = classNames({ 'label': true, 'hidden': !isEmpty })
    const imageClass = classNames({ 'hidden': isEmpty, 'image-border': props.displayBorder })
    const buttonClassClickToClear = classNames({ 'hidden': isEmpty })
    const buttonClassPickFile = classNames({ 'hidden': !isEmpty })

    // Events
    const processLargeImage = async (file: File): Promise<File> => {
        if (file.size < props.attribute.maxFieldLength) {
            return file
        }

        setIsProcessingLargeImage(true)
        const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.8,
            useWebWorker: true,
            maxWidthOrHeight: 1024,
        })
        setIsProcessingLargeImage(false)
        return compressedFile
    }
    const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()
    }
    const onDrop = async (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()

        if (!isEditable) return
        if (!ev.dataTransfer || !ev.dataTransfer.files) return // Don't alert as this is not an error condition        

        try {
            const files = ev.dataTransfer.files

            // Guard: Exactly one file
            if (files.length === 0) throw props.resourceStrings.noFileError
            if (files.length > 1) throw props.resourceStrings.multipleFileError

            const file = await processLargeImage(files[0])

            const base64 = await toBase64(file)
            await fieldLengthValidator.validate(base64)
            updateValue(base64)

        } catch (errorMessage) {
            // @ts-ignore
            props.alertError(errorMessage)
            console.error('IMAGE_CONTROL', { errorMessage })
        }
    }
    const onClickClear = (ev: React.MouseEvent) => {
        updateValue(null)
    }
    const onClickPickFile = async (ev: React.MouseEvent): Promise<void> => {
        if (!isEditable) return

        try {
            const response = await props.pickFile()

            // Guard: Exactly one file
            if (response == null || response.length === 0) return
            if (response.length !== 1) throw props.resourceStrings.onlyPickOneFileError

            const file = await processLargeImage(await fromFileObject(response[0]))

            const fileContent = await toBase64(file)
            await fieldLengthValidator.validate(fileContent)
            updateValue(fileContent)

        } catch (errorMessage) {
            // @ts-ignore
            props.alertError(errorMessage)
            console.error('IMAGE_CONTROL', { errorMessage })
        }
    }

    // Render
    if (isProcessingLargeImage) {
        return (
            <div className='ImageControl processing' onDragOver={onDragOver} onDrop={onDrop}>
                <label>{props.resourceStrings.processingLargeImagePleaseWait}</label>
            </div>
        )
    }

    return (
        <div className='ImageControl' onDragOver={onDragOver} onDrop={onDrop}>
            <img className={imageClass} src={imageSrc} />

            <p className={labelClass}>
                {props.resourceStrings.dragImageHere}
            </p>

            <div className='button-container'>
                <button className={buttonClassClickToClear} onClick={onClickClear}>
                    {props.resourceStrings.clickToClear}
                </button>

                <button className={buttonClassPickFile} onClick={onClickPickFile}>
                    {props.resourceStrings.pickFile}
                </button>
            </div>
        </div>
    )
}
