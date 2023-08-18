/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    field: ComponentFramework.PropertyTypes.StringProperty;
    length: ComponentFramework.PropertyTypes.WholeNumberProperty;
    imageBorder: ComponentFramework.PropertyTypes.EnumProperty<"yes" | "no">;
    imageMaxHeightCss: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    field?: string;
    length?: number;
}
