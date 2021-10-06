# Building the Control

## Prerequisites
- Node.JS & npm
  > Download link: [https://nodejs.org/en/](https://nodejs.org/en/)
- yarn
  > npm install -g yarn
- dotnet
  > Download link: [https://dotnet.microsoft.com/download/dotnet/5.0](https://dotnet.microsoft.com/download/dotnet/5.0)

---

There are two main aspects to the repo:
- `control/`:
  - Contains the PCF source code and configuration files
  - Built using an npm script (yarn)
- `solution/`:
  - Contains the solution metadata, and a reference to the PCF control
  - Built using the dotnet CLI
  - **Building the solution also builds the control**

Build scripts to automate the build process are done using the scripts at the root of the repo:
- `win-build.bat` - builds the solution (when using Windows)
- `mac-build.zsh` - builds the solution (when using Mac)

After the control is built, it can be imported to the Dynamics environment using your method of choice:
- Classic solution explorer
- Maker portal [https://make.powerapps.com](https://make.powerapps.com) (online only)

---

[home](../readme.md)