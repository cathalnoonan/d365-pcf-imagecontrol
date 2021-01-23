import { ResourceStringUtility } from '.';

export interface FieldLengthValidatorOptions {
    maxFieldLength: number;
    fieldLength: number;
    resourceStrings: ResourceStringUtility
}

export class FieldLengthValidator {

    private options: FieldLengthValidatorOptions;

    constructor(options: FieldLengthValidatorOptions) {
        this.options = options;
    }

    public validate = (text: string): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const { maxFieldLengthError, fieldLengthError } = this.options.resourceStrings;

            if (text.length > this.options.maxFieldLength) {
                return reject(maxFieldLengthError);
            } else if (text.length > this.options.fieldLength) {
                return reject(fieldLengthError);
            }

            return resolve(text);
        })
    }

}