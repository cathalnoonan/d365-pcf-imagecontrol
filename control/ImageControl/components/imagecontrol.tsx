import * as React from 'react'
import classNames from 'classnames'
import imageCompression from 'browser-image-compression'

import { ResourceStrings } from '../strings'
import { FieldLengthValidator, addDataImage, removeDataImage, toBase64, fromFileObject } from '../utilities'

export interface ImageControlComponentProps {
    value: string | null
    displayBorder: boolean
    resourceStrings: ResourceStrings
    imageMaxHeightCss: string
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
        // Chromium browsers started setting 'size=0' for the drag-and-drop files.
        // Use imageCompression if the size of the file is zero (because it's probably not actually zero).
        if (file.size !== 0 && file.size < props.attribute.maxFieldLength) {
            return file
        }

        // Issue #30:
        // Huge images are sometimes not compressed below the provided size.
        // Attempt to compress again if the image is still too big.
        setIsProcessingLargeImage(true)
        let compressedFile = await imageCompression(file, {
            maxSizeMB: 0.6,
            useWebWorker: true,
            maxWidthOrHeight: 1024,
        })
        try {
            fieldLengthValidator.validate(await toBase64(compressedFile))
        }
        catch (errorMessage) {
            // Retry once. Don't call this function recursively in case the issue reoccurs.
            console.warn('IMAGE_CONTROL', 'large image detected, trying to compress again')
            compressedFile = await imageCompression(compressedFile, {
                maxSizeMB: 0.5,
                useWebWorker: true,
                maxWidthOrHeight: 720,
            })
        }
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

        } catch (errorMessage: any) {
            if (errorMessage && errorMessage.message && typeof(errorMessage.message) === 'string') {
                props.alertError(errorMessage.message)
            } else {
                // @ts-ignore
                props.alertError(errorMessage)
            }
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

        } catch (errorMessage: any) {
            if (errorMessage && errorMessage.message && typeof(errorMessage.message) === 'string') {
                props.alertError(errorMessage.message)
            } else {
                // @ts-ignore
                props.alertError(errorMessage)
            }
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

    // Either set the width/height to auto, and set the height as user specified
    const imgStyles: React.CSSProperties = {}
    if (props.imageMaxHeightCss !== 'auto') {
        imgStyles.maxHeight = props.imageMaxHeightCss
        imgStyles.width = 'auto'
        imgStyles.maxWidth = '100%'
    } else {
        imgStyles.width = '100%'
        imgStyles.maxWidth = '100%'
    }

    return (
        <div className='ImageControl' onDragOver={onDragOver} onDrop={onDrop}>
            <img className={imageClass} src={imageSrc} style={imgStyles} />

            {isEditable ? (
                <p className={labelClass}>
                    {props.resourceStrings.dragImageHere}
                </p>
            ) : (
                <p className={labelClass}>
                    {props.resourceStrings.noImageProvided}
                </p>
            )}

            {isEditable && (
                <div className='button-container'>
                    <button className={buttonClassClickToClear} onClick={onClickClear}>
                        {props.resourceStrings.clickToClear}
                    </button>

                    <button className={buttonClassPickFile} onClick={onClickPickFile}>
                        {props.resourceStrings.pickFile}
                    </button>
                </div>
            )}
        </div>
    )
}
