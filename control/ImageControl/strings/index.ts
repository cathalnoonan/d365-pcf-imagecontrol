import { IInputs } from '../generated/ManifestTypes'

export interface ResourceStringsOptions {
    context: ComponentFramework.Context<IInputs>
}

export class ResourceStrings {

    constructor(options: ResourceStringsOptions) {
        const getResourceString = (key: string) => options.context.resources.getString(key)

        // Title
        this.imageControl = getResourceString('ImageControl_Display_Key')

        // Info
        this.dragImageHere = getResourceString('DragImageHere_message')
        this.clickToClear = getResourceString('ClickToClear_message')
        this.pickFile = getResourceString('PickFileButton_message')
        this.processingLargeImagePleaseWait = getResourceString('ProcessingLargeImagePleaseWait_message')

        // Error
        this.noFileError = getResourceString('NoFileError_message')
        this.multipleFileError = getResourceString('MultipleFileError_message')
        this.fieldMetadataMissingError = getResourceString('FieldMetadataMissingError_message')
        this.fieldLengthError = getResourceString('FieldLengthError_message')
        this.maxFieldLengthError = getResourceString('MaxFieldLengthError_message')
        this.onlyPickOneFileError = getResourceString('OnlyPickOneFile_message')
    }

    // Title
    readonly imageControl: string

    // Info
    readonly dragImageHere: string
    readonly clickToClear: string
    readonly pickFile: string
    readonly processingLargeImagePleaseWait: string

    // Errors
    readonly noFileError: string
    readonly multipleFileError: string
    readonly fileTypeError: string
    readonly fieldMetadataMissingError: string
    readonly fieldLengthError: string
    readonly maxFieldLengthError: string
    readonly onlyPickOneFileError: string

}