# Building the Control

## Prerequisites
- Node.JS & npm
  > Download link: [https://nodejs.org/en/](https://nodejs.org/en/)
- dotnet 8
  > Download link: [https://dotnet.microsoft.com/download/dotnet/8.0](https://dotnet.microsoft.com/download/dotnet/8.0)

---

There are two main aspects to the repo:
- `control/`:
  - Contains the PCF source code and configuration files.
  - Built using an npm script.
- `solution/`:
  - Contains the solution metadata, and a reference to the PCF control.
  - Built using the dotnet CLI.
  - **Building the solution also builds the control**

To build the control, run the following command at the root of the repository:
- ```sh
  dotnet build
  ```

After the control is built, it can be imported to the Dynamics environment using your method of choice:
- Classic solution explorer.
- Maker portal [https://make.powerapps.com](https://make.powerapps.com) (online only).

---

[home](../readme.md)
