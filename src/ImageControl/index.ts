import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IInputs, IOutputs } from './generated/ManifestTypes';
import { ImageControlComponent, ImageControlComponentProps } from './components/';
import { toBase64, ResourceStringUtility } from './utilities';

export class ImageControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private component: ImageControlComponent;
    private container: HTMLDivElement;

    /** 
     * Empty constructor.
     */
    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        this.container = container;

        const readable = context.parameters.field.security?.readable ?? true;
        if (!readable) return this.destroy();

        const fieldMetadata = context.parameters.field.attributes;
        const isDisabled = context.mode.isControlDisabled;
        const editable = context.parameters.field.security?.editable ?? true;
        const resourceStrings: ResourceStringUtility = new ResourceStringUtility({
            getResourceString: (s: string) => context.resources.getString(s),
        })

        const props: ImageControlComponentProps = {
            value: context.parameters.field.raw,
            displayBorder: context.parameters.imageBorder.raw === 'yes',
            fieldLength: fieldMetadata?.MaxLength ?? 0,
            maxFieldLength: 1048576, // Constant
            resourceStrings,
            isDisabled,
            editable,
            toBase64,
            notifyOutputChanged,
            alertError: (message) => !!message && context.navigation.openErrorDialog({ message }),
            pickFile: () => context.device.pickFile({
                accept: 'image',
                allowMultipleFiles: false,
                maximumAllowedFileSize: 1048576 // 1 MB
            }),
        };

        this.component = ReactDOM.render(
            React.createElement(
                ImageControlComponent,
                props
            ),
            this.container
        );
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.component.setValue(context.parameters.field.raw);
    }

    /**
     * It is called by the framework prior to a control receiving new data. 
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        const value = this.component.getValue() ?? undefined;
        return {
            field: value,
            length: value?.length ?? 0
        };
    }

    /** 
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
        ReactDOM.unmountComponentAtNode(this.container);
    }
}

// // The implementation of the Device API in the test harness is not implemented properly, so this is
// // here to allow testing the control in the harness
// if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
//     (<any>window).CustomControls.XrmProxy._deviceContext.pickFile = function (options: ComponentFramework.DeviceApi.PickFileOptions): Promise<ComponentFramework.FileObject[]> {
//         return new Promise<ComponentFramework.FileObject[]>((resolve, reject) => {
//             const input = document.createElement('input');
//             input.type = 'file';
//             input.accept = options.accept + '/*';
//             input.multiple = options.allowMultipleFiles;
//             input.onchange = (e: Event) => {
//                 if (!input.files) return reject();
//                 const fileList = Array.from(input.files);
//                 if (!fileList) return reject();

//                 Promise.all(
//                     fileList.map(file =>
//                         new Promise<ComponentFramework.FileObject>((conversionResolve, conversionReject) => {
//                             toBase64(file)
//                                 .then(base64 => conversionResolve({
//                                     fileContent: base64,
//                                     fileName: file.name,
//                                     fileSize: file.size,
//                                     mimeType: file.type,
//                                 }))
//                                 .catch(conversionReject)
//                         })
//                     )
//                 )
//                     .then(files => resolve(files))
//                     .catch(e => reject(e));
//             };
//             input.click();
//         });

//     }
// }