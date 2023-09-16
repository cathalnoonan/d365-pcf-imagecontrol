# Adding Translation

There are a few steps needed to add the translations for another language:
1. Create the resx file following the existing naming convention.
2. Translate the text to the new language.
3. Add a reference to the resx file in the ControlManifest.

---

Steps to create the resx file:
- Copy the [existing translation for English](https://github.com/cathalnoonan/d365-pcf-imagecontrol/blob/master/control/ImageControl/strings/ImageControl.1033.resx).
- Replace the `1033` in the file name with the number that represents that language.\
  As an example:
  - English:
    > /control/ImageControl/strings/ImageControl.1033.resx
  - French:
    > /control/ImageControl/strings/ImageControl.1036.resx

Steps needed to translate the text:
- Open the new translation file in a text editor.
- **Don't modify anything above the comment:** [`<!-- Custom -->`](https://github.com/cathalnoonan/d365-pcf-imagecontrol/blob/master/control/ImageControl/strings/ImageControl.1033.resx#L65)
- Change the text inside the [`<value>...</value>` elements](https://github.com/cathalnoonan/d365-pcf-imagecontrol/blob/master/control/ImageControl/strings/ImageControl.1033.resx#L66-L137) to use the words from the other language.\
  As an example:
  - English:
    ```xml
    <data name="ImageBorder_Yes_Display_Key" xml:space="preserve">
      <value>Yes</value>
    </data>
    ```
  - French:
    ```xml
    <data name="ImageBorder_Yes_Display_Key" xml:space="preserve">
      <value>Oui</value>
    </data>
    ```

Steps to add the reference to the ControlManifest:
- Open the [ControlManifest.Input.xml file](https://github.com/cathalnoonan/d365-pcf-imagecontrol/blob/master/control/ImageControl/ControlManifest.Input.xml).
- Below the existing `<resx path="strings/ImageControl.xxx.resx" version="x.y.z" />` elements, add the new translation file.
  - The number representing the language in D365 needs to go in here.\
    As an example:
    ```xml
    <resources>
      <code path="index.ts" order="1" />
      <css path="styles.css" order="1" />

      <resx path="strings/ImageControl.1043.resx" version="1.4.0" />
      <resx path="strings/ImageControl.1040.resx" version="1.4.0" />
      <resx path="strings/ImageControl.1033.resx" version="1.4.0" />
    </resources>
    ```
    Will become the following after adding the French language:
    ```xml
    <resources>
      <code path="index.ts" order="1" />
      <css path="styles.css" order="1" />

      <resx path="strings/ImageControl.1043.resx" version="1.4.0" />
      <resx path="strings/ImageControl.1040.resx" version="1.4.0" />
      <resx path="strings/ImageControl.1033.resx" version="1.4.0" />
      <resx path="strings/ImageControl.1036.resx" version="1.4.0" />
    </resources>
    ```

- When adding the `<resx path="..." version="..." />` element, use the same version number that is already there; this version number will be updated as part of the next release

---

If you are building the control yourself, the version numbers must be updated before the changes will appear in Dynamics:

- /control/ImageControl/ControlManifest.Input.xml: [`<control>` element](https://github.com/cathalnoonan/d365-pcf-imagecontrol/blob/master/control/ImageControl/ControlManifest.Input.xml#L3)
- /control/ImageControl/ControlManifest.Input.xml: [`<resources>`, `<resx path="..." version="..." />` elements](https://github.com/cathalnoonan/d365-pcf-imagecontrol/blob/master/control/ImageControl/ControlManifest.Input.xml#L16-L19)
- /control/package.json: [version](https://github.com/cathalnoonan/d365-pcf-imagecontrol/blob/master/control/package.json#L3) (Optional)
- /solution/src/other/Solution.xml: [`<Version>`](https://github.com/cathalnoonan/d365-pcf-imagecontrol/blob/master/solution/src/other/Solution.xml#L11)

---

[home](../readme.md)
