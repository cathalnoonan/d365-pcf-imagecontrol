export interface ResourceStringUtilityOptions {
    getResourceString(name: string): string;
}

export class ResourceStringUtility {

    constructor(options: ResourceStringUtilityOptions) {
        // Info
        this.dragImageHere = options.getResourceString('DragImageHere_message');
        this.clickToClear = options.getResourceString('ClickToClear_message');
        this.pickFile = options.getResourceString('PickFileButton_message');

        // Error
        this.noFileError = options.getResourceString('NoFileError_message');
        this.multipleFileError = options.getResourceString('MultipleFileError_message');
        this.fileTypeError = options.getResourceString('FileTypeError_message');
        this.fieldMetadataMissingError = options.getResourceString('FieldMetadataMissingError_message');
        this.fieldLengthError = options.getResourceString('FieldLengthError_message');
        this.maxFieldLengthError = options.getResourceString('MaxFieldLengthError_message');
        this.onlyPickOneFileError = options.getResourceString('OnlyPickOneFile_message');
        this.onlyPngImagesSupported = options.getResourceString('OnlyPngImagesSupported_message');
    }

    // Info
    readonly dragImageHere: string;
    readonly clickToClear: string;
    readonly pickFile: string;

    // Errors
    readonly noFileError: string;
    readonly multipleFileError: string;
    readonly fileTypeError: string;
    readonly fieldMetadataMissingError: string;
    readonly fieldLengthError: string;
    readonly maxFieldLengthError: string;
    readonly onlyPickOneFileError: string;
    readonly onlyPngImagesSupported: string;

}