import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class ImageControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  // Control objects
  private context: ComponentFramework.Context<IInputs>;
  private notifyOutputChanged: () => void;
  private container: HTMLDivElement;

  // Local objects
  private img: HTMLImageElement;
  private label: HTMLLabelElement;
  private clearButton: HTMLButtonElement;
  private fieldMetadata: ComponentFramework.PropertyHelper.FieldPropertyMetadata.StringMetadata | undefined;

  private CSSClasses = {
    Hidden: "hidden",
    ImageControlContainer: "imageControl-container",
    ClearButton: "clearButton",
    ClearButtonContainer: "clearButton-container",
    ImageBorder: "image-border",
    ImageControlLabel: "imageControl-label"
  }

  private Constants = {
    MultipleLineMaxFieldLength: 1048576,
    Val: "val",
    Yes: "yes"
  }

  private ResourceStrings = {
    DragImageHere: "DragImageHere_message",
    NoFileError_message: "NoFileError_message",
    DragImageHere_message: "DragImageHere_message",
    ClickToClear_message: "ClickToClear_message",
    MultipleFileError_message: "MultipleFileError_message",
    FileTypeError_message: "FileTypeError_message",
    FieldMetadataMissingError_message: "FieldMetadataMissingError_message",
    FieldLengthError_message: "FieldLengthError_message",
    MaxFieldLengthError_message: "MaxFieldLengthError_message"
  };

  /** 
  * Empty constructor.
   */
  constructor()	{
    // Bind functions
    this.addEventListeners = this.addEventListeners.bind(this);
    this.createElements = this.createElements.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.toBase64 = this.toBase64.bind(this);
    this.addDataImage = this.addDataImage.bind(this);
    this.removeDataImage = this.removeDataImage.bind(this);
    this.alertError = this.alertError.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDropSuccess = this.onDropSuccess.bind(this);
    this.validateFieldLength = this.validateFieldLength.bind(this);
    this.clearButtonClick = this.clearButtonClick.bind(this);
  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
   */
  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container :HTMLDivElement)	{
    this.context = context;
    this.notifyOutputChanged = notifyOutputChanged;
    this.container = container;
    
    this.fieldMetadata = this.context.parameters.field.attributes;

    this.createElements();
    this.addEventListeners();
    this.updateView(context);
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.context = context;

    let error: boolean = false;
    if (!context.parameters || 
        !context.parameters.field || 
        !context.parameters.field.raw || 
        context.parameters.field.raw === this.Constants.Val) {
      error = true;
    }

    const hidden = this.CSSClasses.Hidden;
    if (error) {
      // Show the label
      if (this.label.classList.contains(hidden)) {
        this.label.classList.remove(hidden);
      }

      // Hide the image and button
      this.img.src = "";
      if (!this.img.classList.contains(hidden)) {
        this.img.classList.add(hidden);
      }
      if (!this.clearButton.classList.contains(hidden)) {
        this.clearButton.classList.add(hidden);
      }
    } else {
      // Hide the label
      if (!this.label.classList.contains(hidden)) {
        this.label.classList.add(hidden);
      }
      
      // Show the image and button
      this.img.src = this.addDataImage(context.parameters.field.raw);
      if (this.img.classList.contains(hidden)) {
        this.img.classList.remove(hidden);
      }
      if (this.clearButton.classList.contains(hidden)) {
        this.clearButton.classList.remove(hidden);
      }
    }

    // Image border
    if (this.context.parameters.imageBorder.raw === this.Constants.Yes && !this.img.classList.contains(this.CSSClasses.ImageBorder)) {
      this.img.classList.add(this.CSSClasses.ImageBorder);
    } else if (this.context.parameters.imageBorder.raw !== this.Constants.Yes && this.img.classList.contains(this.CSSClasses.ImageBorder)) {
      this.img.classList.remove(this.CSSClasses.ImageBorder);
    }
  }

  /**
   * It is called by the framework prior to a control receiving new data. 
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
		return {
      field: this.context.parameters.field.raw,
      length: this.context.parameters.field.raw!.length
    };
  }

  /** 
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
    this.removeEventListeners();
  }
  
  private createElements(): void {
    const resources: ComponentFramework.Resources = this.context.resources;

    const hidden = this.CSSClasses.Hidden;

    const imageControlContainer = <HTMLDivElement>document.createElement("div");
    imageControlContainer.classList.add(this.CSSClasses.ImageControlContainer);
    this.container.appendChild(imageControlContainer);

    this.img = <HTMLImageElement>document.createElement("img");
    this.img.classList.add(hidden);
    if (this.context.parameters.imageBorder.raw === this.Constants.Yes) {
      this.img.classList.add(this.CSSClasses.ImageBorder);
    }
    imageControlContainer.appendChild(this.img);

    this.label = <HTMLLabelElement>document.createElement("label");
    this.label.classList.add(this.CSSClasses.ImageControlLabel);
    this.label.classList.add(hidden);
    this.label.innerText = resources.getString(this.ResourceStrings.DragImageHere_message);
    imageControlContainer.appendChild(this.label);

    const clearButtonContainer = <HTMLDivElement>document.createElement("div");
    clearButtonContainer.classList.add(this.CSSClasses.ClearButtonContainer);
    imageControlContainer.appendChild(clearButtonContainer);
    
    this.clearButton = <HTMLButtonElement>document.createElement("button");
    this.clearButton.classList.add(hidden);
    this.clearButton.classList.add(this.CSSClasses.ClearButton);
    this.clearButton.innerText = resources.getString(this.ResourceStrings.ClickToClear_message);
    clearButtonContainer.appendChild(this.clearButton);
  }

  private alertError(message: string, details?: string | null): string {
    const options: ComponentFramework.NavigationApi.ErrorDialogOptions = {
      message: message
    };
    if (details) {
      if (details.trim() !== '') {
        options.details = details;
      }
    }
    this.context.navigation.openErrorDialog(options);
    return message;
  }

  private onDragOver(ev: DragEvent): void {
    ev.preventDefault();
  }

  private onDrop(ev: DragEvent): void {
    ev.preventDefault();
    
    if (!ev.dataTransfer) {
      return;
    }
    if (!ev.dataTransfer.files) {
      return;
    }
    
    const resources = this.context.resources;

    const files = ev.dataTransfer.files;
    if (files.length === 0) {
      this.alertError(resources.getString(this.ResourceStrings.NoFileError_message));
      return;
    }
    if (files.length > 1) {
      this.alertError(resources.getString(this.ResourceStrings.MultipleFileError_message));
      return;
    }

    const file = files[0];
    if (file.type !== "image/png") {
      this.alertError(resources.getString(this.ResourceStrings.FileTypeError_message));
      return;
    }

    this.toBase64(file).then(this.validateFieldLength, this.alertError).then(this.onDropSuccess, this.alertError);
  }

  private onDropSuccess(message: string): void {
    this.context.parameters.field.raw = this.removeDataImage(message);
    this.updateView(this.context);
    this.notifyOutputChanged();
  }

  private addEventListeners(): void {
    this.container.ondragover = this.onDragOver;
    this.container.ondrop = this.onDrop;
    this.clearButton.onclick = this.clearButtonClick;
  }

  private removeEventListeners(): void {
    this.container.ondragover = null;
    this.container.ondrop = null;
    this.clearButton.onclick = null;
  }

  private toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(<string>reader.result);
      reader.onerror = error => reject(<string><unknown>error);
    });
  }

  private addDataImage(base64String: string): string {
    return "data:image/png;base64," + base64String;
  }

  private removeDataImage(base64String: string): string {
    return base64String.replace("data:image/png;base64,", "");
  }

  private validateFieldLength(text: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const resources = this.context.resources;
      
      if (!this.fieldMetadata) {
        reject(resources.getString(this.ResourceStrings.FieldMetadataMissingError_message))
      } else if (text.length > this.Constants.MultipleLineMaxFieldLength) {
        reject(resources.getString(this.ResourceStrings.MaxFieldLengthError_message));
      } else if (text.length > this.fieldMetadata.MaxLength) {
        reject(resources.getString(this.ResourceStrings.FieldLengthError_message))
      } else {
        resolve(text);
      }
    });
  }

  private clearButtonClick(ev: MouseEvent): void {
    this.context.parameters.field.raw = "";
    this.updateView(this.context);
    this.notifyOutputChanged();
  }
}