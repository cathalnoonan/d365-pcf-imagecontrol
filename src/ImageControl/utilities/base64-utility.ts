const dataImageBase64 = 'data:image/png;base64,';

export function addDataImage(base64String: string): string {
    return dataImageBase64 + base64String;
}

export function removeDataImage(base64String: string): string {
    return base64String.replace(dataImageBase64, '');
}

export function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(<string>reader.result);
        reader.onerror = error => reject(<string><unknown>error);
    });
}