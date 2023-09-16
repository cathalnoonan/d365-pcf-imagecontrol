export function addDataImage(base64String: string): string {
    if (base64String.startsWith('data:image'))
        return base64String
    return `data:image;base64,${base64String}`
}

export function removeDataImage(base64String: string): string {
    // Replace 'data:image/*;base64,' with empty string
    return base64String.replace(/data:image\/(\D{0,});base64,/, '')
}

export function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(<string>reader.result)
        reader.onerror = error => reject(<string><unknown>error)
        reader.readAsDataURL(file)
    })
}

export async function fromFileObject(fileObject: ComponentFramework.FileObject): Promise<File> {
    const res = await fetch(addDataImage(fileObject.fileContent))
    const blob = await res.blob()

    const file = new File([blob], fileObject.fileName, { type: fileObject.mimeType })

    // TODO: Resolve error in Dynamics 365 apps for iOS.
    //       Something weird happens with the file object, it comes out empty.
    //
    // alert(`fromFileObject: fetch ${JSON.stringify({
    //     status: res.status,
    //     statusText: res.statusText,
    //     url: res.url.substring(0, 30),
    //     type: res.type
    // })}`)
    // alert(`fromFileObject: ComponentFramework.FileObject ${JSON.stringify({
    //     fileName: fileObject.fileName,
    //     mimeType: fileObject.mimeType,
    //     fileContent: fileObject.fileContent.substring(0, 10)
    // })}`)
    // alert(`fromFileObject: File ${JSON.stringify({
    //     name: file.name,
    //     size: file.size,
    //     type: file.type,
    // })}`)

    return file
}
