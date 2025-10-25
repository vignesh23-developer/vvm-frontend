'use client';

import {ErrorMessage, useField} from 'formik';
import IconPicker from './IconPicker';
import {LucideIconName} from './LucideIconName';

interface IconPickerFieldProps {
    label: string;
    name: string;
    className?: string;
    helpText?: string;
}

export default function FormikIconPickerField({
                                                  label,
                                                  name,
                                                  className = '',
                                                  helpText,
                                              }: IconPickerFieldProps) {

    const [field, meta, helpers] = useField<LucideIconName | null>(name);


    const {setValue} = helpers;


    const handleChange = (icon: LucideIconName) => {
        setValue(icon);
    };

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium mb-1">
                {label}
            </label>

            <IconPicker
                value={field.value}
                onChange={handleChange}
                className={className}
            />

            {helpText && (
                <p className="text-gray-500 text-sm mt-1">{helpText}</p>
            )}

            <ErrorMessage
                name={name}
                component="p"
                className="text-red-500 text-sm mt-1"
            />
        </div>
    );
}