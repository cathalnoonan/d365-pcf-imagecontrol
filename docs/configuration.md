# Configuration

The control can be added to "Multiple Lines of Text" fields.

Open the form editor for the form that you wish to add the control to in the classic form editor.

Select a multiple lines of text field to designate for the control.
- If the field you wish to add to the form does not exist yet, it must be created first.
- Refer to the note at the bottom of this page for more information.
![Configure: Select control](./res/ConfigureSelectControl.png)

Double click the multiple lines of text field, select the `Controls` tab and then click `Add Control...`.
![Configure: Field Properties](./res/FieldProperties.png)

From the list of controls, select `Image Control` and click the `Add` button.
![Configure: Add Control](./res/AddControl.png)

After the control is added to the field, it must be selected for the `Web`, `Phone`, and `Tablet` options so that 
it will be displayed instead of the default control for a multiple lines of text field.
![Configure control for devices](./res/ConfigureControlForDevices.png)

After configuring the control to appear on web, phone, tablet, configure the remaining properties as necessary by selecting the `Image Control` control
![Configure control properties](./res/ConfigureControlProperties.png)

## Properties

The options available to configure the control are as follows:
- Field (required, bound)
  - Automatically bound to the field that the control is added to
- Length (optional, bound)
  - If configured, the control will set the length of the image's content to a second field
  - The intention of this is to allow a customizer to alter the length of the Multiple Lines of Text field if there are many users below/close to the current length limit of the field
- Image Border (required, input)
  - Decides whether to display a border around the image

> **Note:**
> 
> When the configuration is complete, don't forget to publish customizations

### Length

The length field can be bound to a Whole Number field to give visibility of how many characters are filled in the Multiple Lines of Text field supporting the image

![Configure: Field Length](./res/ConfigureLength.png)

### Image Border

A border can be displayed around the image to give an indication of any white (or empty) space included

![Configure: Image Border](./res/ConfigureImageBorder.png)

Selecting `No` will not display a border around the image

![Configure: No Image Border](./res/NoBorder.png)

Selecting `Yes` will display a border around the image

![Configure: With Image Border](./res/WithBorder.png)

---

> **Note:** 
>
> The value that will be stored in the field might be a high number of characters (it depends on the size of the image used). 
> 
> A suggestion to accept large images is to configure the multiple lines of text field to accept the maximum number
> of characters possible.
>
> If images larger than the configured field length are added, the control will not be able to store the image.

---

[home](../readme.md)