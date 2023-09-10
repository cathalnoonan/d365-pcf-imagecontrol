import { ResourceStrings } from '../strings'

export interface FieldLengthValidatorOptions {
    maxFieldLength: number
    fieldLength: number
    resourceStrings: ResourceStrings
}

export class FieldLengthValidator {

    constructor(private options: FieldLengthValidatorOptions) { }

    public validate = async (text: string): Promise<string> => {

        // Guard clauses
        if (text.length > this.options.maxFieldLength) {
            throw {
                message: this.options.resourceStrings.maxFieldLengthError,
                details: {
                    textLength: text.length,
                    maxFieldLength: this.options.maxFieldLength,
                }
            }
        } else if (text.length > this.options.fieldLength) {
            throw {
                message: this.options.resourceStrings.fieldLengthError,
                details: {
                    textLength: text.length,
                    fieldLength: this.options.fieldLength,
                }
            }
        }

        // Value is valid
        return text
    }

}