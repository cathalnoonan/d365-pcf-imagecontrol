# D365 PCF - Image Control

[![Build](https://github.com/cathalnoonan/d365-pcf-imagecontrol/actions/workflows/BUILD.yml/badge.svg)](https://github.com/cathalnoonan/d365-pcf-imagecontrol/actions/workflows/BUILD.yml)
[![Github All Releases](https://img.shields.io/github/downloads/cathalnoonan/d365-pcf-imagecontrol/total.svg)]()

## Image control for Multiple Lines of Text fields
This control can be added as a custom control for a Multiple Lines of Text field to display the contents as an image

![Drag and Drop Here](./docs/res/DragAndDropHere.png)
![Sample Image](./docs/res/Sample.png)

The control will store the Base64 encoded content of the PNG image without the `data:image/png;base64,` at the start

This will allow us to output the image in a word document, as shown in the example below

![Word Template Example](./docs/res/WordTemplateExample.png)

---

## Download

The solution can be downloaded from the [Releases page](https://github.com/cathalnoonan/d365-pcf-imagecontrol/releases)

---

## Docs
- [Installation](./docs/installation.md)
- [Configuration](./docs/configuration.md)

## Development Docs
- [Building the control](./docs/building.md)
- [Adding translation](./docs/adding_translation.md)

---

## License
MIT
