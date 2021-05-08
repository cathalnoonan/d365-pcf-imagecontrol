import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { IInputs, IOutputs } from './generated/ManifestTypes'
import { ImageControlComponent, ImageControlComponentProps } from './components/imagecontrol'
import { ResourceStrings } from './strings'
import { toBase64 } from './utilities'

const MULTIPLE_LINES_OF_TEXT_MAX_LENGTH = 1048576

export class ImageControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private base64Value: string | null

    private container: HTMLDivElement
    private notifyOutputChanged: () => void

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        this.container = container
        this.notifyOutputChanged = notifyOutputChanged
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const readable = context.parameters.field.security?.readable ?? true
        if (!readable) return this.destroy()

        const fieldMetadata = context.parameters.field.attributes
        const isDisabled = context.mode.isControlDisabled
        const isEditable = context.parameters.field.security?.editable ?? true
        const resourceStrings = new ResourceStrings({ context, })

        const props: ImageControlComponentProps = {
            value: context.parameters.field.raw,
            displayBorder: context.parameters.imageBorder.raw === 'yes',
            resourceStrings,
            attribute: {
                fieldLength: fieldMetadata?.MaxLength ?? 0,
                maxFieldLength: MULTIPLE_LINES_OF_TEXT_MAX_LENGTH,
                isDisabled,
                isEditable,
            },
            updateValue: (value: string | null): void => {
                this.base64Value = value
                this.notifyOutputChanged()
            },
            alertError: (message: string): void => {
                !!message && context.navigation.openErrorDialog({ message })
            },
            pickFile: (): Promise<ComponentFramework.FileObject[]> => {
                return context.device.pickFile({
                    accept: 'image',
                    allowMultipleFiles: false,
                    maximumAllowedFileSize: 1048576 // 1 MB
                })
            },
        }

        ReactDOM.render(
            React.createElement(
                ImageControlComponent,
                props
            ),
            this.container
        )
    }

    public getOutputs(): IOutputs {
        const value = this.base64Value ?? undefined

        return {
            field: value,
            length: value?.length ?? 0
        }
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.container)
    }

}

// Test harness specific code
if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    // The implementation of the Device API in the test harness is not implemented properly, so this is
    // here to allow testing the control in the harness
    (<any>window).CustomControls.XrmProxy._deviceContext.pickFile = function (options: ComponentFramework.DeviceApi.PickFileOptions): Promise<ComponentFramework.FileObject[]> {
        return new Promise<ComponentFramework.FileObject[]>((resolve, reject) => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = options.accept + '/*'
            input.multiple = options.allowMultipleFiles
            input.onchange = (e: Event) => {
                if (!input.files) return reject()
                const fileList = Array.from(input.files)
                if (!fileList) return reject()

                Promise.all(
                    fileList.map(file =>
                        new Promise<ComponentFramework.FileObject>((conversionResolve, conversionReject) => {
                            toBase64(file)
                                .then(base64 => conversionResolve({
                                    fileContent: base64,
                                    fileName: file.name,
                                    fileSize: file.size,
                                    mimeType: file.type,
                                }))
                                .catch(conversionReject)
                        })
                    )
                )
                    .then(files => resolve(files))
                    .catch(e => reject(e))
            }
            input.click()
        })

    }

    // Force the max width of the property pane on the right
    document.querySelectorAll<HTMLDivElement>('.io-pane').forEach(pane => {
        pane.style.maxWidth = '25%';
    })
}