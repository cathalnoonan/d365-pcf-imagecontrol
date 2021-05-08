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
            throw this.options.resourceStrings.maxFieldLengthError
        } else if (text.length > this.options.fieldLength) {
            throw this.options.resourceStrings.fieldLengthError
        }

        // Value is valid
        return text
    }

}