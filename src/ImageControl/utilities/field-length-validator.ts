import { ResourceStringUtility } from './';

export interface IOptions {
    maxFieldLength: number;
    fieldLength: number;
    resourceStrings: ResourceStringUtility
}

export default class FieldLengthValidator {

    private options: IOptions;

    constructor(options: IOptions) {
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