import * as React from 'react';
import { ResourceStringUtility, FieldLengthValidator, addDataImage, removeDataImage } from '../utilities';

export interface IProps {
    value: string | null;
    fieldLength: number;
    maxFieldLength: number;
    resourceStrings: ResourceStringUtility;
    displayBorder: boolean;
    isDisabled: boolean;
    editable: boolean;
    toBase64: (file: File) => Promise<string>;
    alertError: (message: string) => void;
    notifyOutputChanged: () => void;
    pickFile: () => Promise<ComponentFramework.FileObject[]>;
}

interface IState {
    value: string | null;
}

export default class ImageControlComponent extends React.Component<IProps, IState> {

    private fieldLengthValidator: FieldLengthValidator;

    constructor(props: IProps) {
        super(props);
        this.fieldLengthValidator = new FieldLengthValidator({ ...props });
        this.state = {
            value: this.props.value,
        }
    }

    render() {
        return (
            <div
                className='ImageControl'
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
            >
                <img
                    className={this.getImageClass()}
                    src={this.getImageSource()}
                />
                <p
                    className={this.getLabelClass()}
                >
                    {this.props.resourceStrings.dragImageHere}
                </p>
                <div className='button-container'>
                    <button
                        className={this.getClickToClearButtonClass()}
                        onClick={this.onClickClearButton}
                    >
                        {this.props.resourceStrings.clickToClear}
                    </button>
                    <button
                        className={this.getPickFileButtonClass()}
                        onClick={this.onClickPickFileButton}
                    >
                        {this.props.resourceStrings.pickFile}
                    </button>
                </div>
            </div>
        );
    }

    // State
    getValue = (): string | null => this.state.value;
    setValue = (value: string | null): void => {
        if (value) value = removeDataImage(value);
        if (this.state.value === value) return;
        this.setState({ value }, this.props.notifyOutputChanged);
    }
    private getImageSource = (): string => this.state.value && addDataImage(this.state.value) || '';
    private isEmpty = (): boolean => !this.state.value || this.state.value === 'val';
    private isEditable = (): boolean => !this.props.isDisabled && this.props.editable;

    // Styles
    private getLabelClass = (): string => 'label' + (this.isEmpty() ? '' : ' hidden');
    private getImageClass = (): string => (this.isEmpty() ? ' hidden' : '') + (this.props.displayBorder ? ' image-border' : '');
    private getClickToClearButtonClass = (): string => this.isEmpty() ? ' hidden' : '';
    private getPickFileButtonClass = (): string => this.isEmpty() ? '' : ' hidden';

    // Event handlers
    private onDragOver = (ev: React.DragEvent): void => ev.preventDefault();
    private onDropSuccess = (value: string): void => this.setValue(value);
    private onDrop = (ev: React.DragEvent): void => {
        ev.preventDefault();

        if (!this.isEditable()) return;
        if (!ev.dataTransfer || !ev.dataTransfer.files) return; // Don't alert as this is not an error condition        
        const files = ev.dataTransfer.files;
        if (files.length === 0) return this.props.alertError(this.props.resourceStrings.noFileError);
        if (files.length > 1) return this.props.alertError(this.props.resourceStrings.multipleFileError);

        const file = files[0];
        if (file.type !== 'image/png') return this.props.alertError(this.props.resourceStrings.fileTypeError);

        this.props.toBase64(file)
            .then(this.fieldLengthValidator.validate)
            .then(this.onDropSuccess)
            .catch(this.props.alertError)
    }
    private onClickClearButton = (ev: React.MouseEvent): void => {
        if (!this.isEditable()) return;
        this.setValue(null);
    }
    private onClickPickFileButton = (ev: React.MouseEvent): void => {
        if (!this.isEditable()) return;

        const { alertError, resourceStrings } = this.props;

        this.props.pickFile()
            .then(response => {
                return new Promise<string>((resolve, reject) => {
                    if (response == null || response.length === 0) return reject();
                    if (response.length !== 1) return reject(resourceStrings.onlyPickOneFileError);
                    const { mimeType, fileContent } = response[0];
                    if (mimeType !== 'image/png') return reject(resourceStrings.onlyPngImagesSupported);

                    resolve(fileContent);
                });
            })
            .then(fileContent => this.fieldLengthValidator.validate(fileContent))
            .then(result => this.onDropSuccess(result))
            .catch(message => alertError(message));
    }
}