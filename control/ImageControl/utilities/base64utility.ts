export function addDataImage(base64String: string): string {
    return `data:image;base64,${base64String}`
}

export function removeDataImage(base64String: string): string {
    // Replace 'data:image/*;base64,' with empty string
    return base64String.replace(/data:image\/(\D{0,});base64,/, '')
}

export function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(<string>reader.result)
        reader.onerror = error => reject(<string><unknown>error)
    })
}