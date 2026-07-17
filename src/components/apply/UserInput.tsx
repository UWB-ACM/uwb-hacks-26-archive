"use client";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";

import {
    Control,
    Controller,
    Path,
    UseFormClearErrors,
    UseFormRegister,
    UseFormSetError,
} from "react-hook-form";
import {
    ApplicationData,
    Major,
    ClassStanding,
    ReferralSource,
} from "@/src/util/dataTypes";
import { QuestionTypeMap } from "@/src/components/apply/FormBody";
import ResumeInput from "@/src/components/apply/ResumeInput";

export interface InputProps<
    T extends keyof ApplicationData = keyof ApplicationData,
> {
    name: T;
    register: UseFormRegister<ApplicationData>;
    control: Control<ApplicationData>;
    setError: UseFormSetError<ApplicationData>;
    clearErrors: UseFormClearErrors<ApplicationData>;
    defaultValue?: ApplicationData[T];
    required: boolean;
    onFileSelect: (file: File | null) => void;
    onDeleteResume: (deleted: boolean) => void;
}

const MAJOR_LABELS: Record<Major, string> = {
    [Major.ComputerScience]: "Computer Science",
    [Major.AppliedComputing]: "Applied Computing",
    [Major.ComputerEngineering]: "Computer Engineering",
    [Major.DataScienceVis]: "Data Science & Visualization",
    [Major.Business]: "Business",
    [Major.OtherSTEM]: "Other STEM",
    [Major.OtherNonSTEM]: "Other Non-STEM",
};

const CLASS_STANDING_LABELS: Record<ClassStanding, string> = {
    [ClassStanding.Freshman]: "Freshman",
    [ClassStanding.Sophomore]: "Sophomore",
    [ClassStanding.Junior]: "Junior",
    [ClassStanding.Senior]: "Senior",
    [ClassStanding.Masters]: "Masters / Graduate",
    [ClassStanding.RunningStart]: "Running Start",
};

const REFERRAL_SOURCE_LABELS: Record<ReferralSource, string> = {
    [ReferralSource.Discord]: "Discord",
    [ReferralSource.Email]: "Email",
    [ReferralSource.WordOfMouth]: "Word of Mouth",
    [ReferralSource.PhysicalPoster]: "Physical Poster",
    [ReferralSource.ACM]: "ACM",
    [ReferralSource.OtherClub]: "Other Club",
    [ReferralSource.Other]: "Other",
};

const NO_CODE_PREFERENCE_LABELS: Record<
    ApplicationData["noCodePreference"],
    string
> = {
    CODE: "Code",
    "NO CODE": "No Code",
    "NO PREFERENCE": "No Preference",
};

const T_SHIRT_LABELS: Record<ApplicationData["tshirtSize"], string> = {
    XS: "XS",
    SM: "SM",
    MD: "MD",
    LG: "LG",
    XL: "XL",
    "2XL": "2XL",
    "3XL": "3XL",
};

export const INPUT_TYPES: Record<
    keyof QuestionTypeMap,
    React.FC<InputProps>
> = {
    TEXT: TextInput,
    TEXT_MULTILINE: TextInputMultiline,
    BOOLEAN: BooleanInput,
    MAJOR: SelectInput(MAJOR_LABELS, "Select your major", true),
    CLASS_STANDING: SelectInput(
        CLASS_STANDING_LABELS,
        "Select your class standing",
        true,
    ),
    REFERRAL_SOURCE: SelectInput(
        REFERRAL_SOURCE_LABELS,
        "Select how you heard about us",
        true,
    ),
    NO_CODE_PREFERENCE: SelectInput(
        NO_CODE_PREFERENCE_LABELS,
        "Select your preference",
        false,
    ),
    T_SHIRT: SelectInput(T_SHIRT_LABELS, "Select your preference", false),
    RESUME_TYPE: ResumeInput,
    SCHOOL_SELECT: SchoolInput,
    COUNTRY_SELECT: CountrySelect,
    AGE_SELECT: AgeSelect,
    MLH_CODE_OF_CONDUCT: MLHCodeOfConductCheckbox,
    MLH_DATA_SHARING: MLHDataSharingCheckbox,
    MLH_COMMUNICATIONS: MLHCommunicationsCheckbox,
};

function TextInput({ name, register, defaultValue, required }: InputProps) {
    return (
        <div className="flex gap-2">
            <input
                type="text"
                className="max-w-full overflow-clip resize-none"
                defaultValue={(defaultValue as string) || ""}
                placeholder={"Enter answer here"}
                {...register(name as Path<ApplicationData>, {
                    required,
                })}
            />
        </div>
    );
}

function TextInputMultiline({
    name,
    register,
    defaultValue,
    required,
}: InputProps) {
    const updateSize = (e: FormEvent<HTMLTextAreaElement>) => {
        e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
    };

    return (
        <div className="flex gap-2">
            <textarea
                className="max-w-full overflow-clip resize-none"
                onInput={updateSize}
                onLoad={updateSize}
                defaultValue={(defaultValue as string) || ""}
                placeholder={"Enter answer here"}
                {...register(name as Path<ApplicationData>, {
                    required,
                })}
            />
        </div>
    );
}

function BooleanInput({ name, control, defaultValue, required }: InputProps) {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                validate: (value) => !required || typeof value === "boolean",
            }}
            defaultValue={defaultValue}
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <div className="flex gap-4" ref={ref}>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="true"
                            checked={value === true}
                            onBlur={onBlur}
                            // We need to convert the string value to a real boolean.
                            // For radio buttons, onChange is only called when they're checked (not unchecked).
                            onChange={() => onChange(true)}
                        />
                        Yes
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="false"
                            checked={value === false}
                            onBlur={onBlur}
                            onChange={() => onChange(false)}
                        />
                        No
                    </label>
                </div>
            )}
        />
    );
}

function SelectInput<T extends string | number>(
    items: Record<T, string>,
    placeholder: string,
    numeric: T extends string ? false : true,
): React.FC<InputProps> {
    function SelectInputInner({
        name,
        register,
        defaultValue,
        required,
    }: InputProps) {
        return (
            <select
                className="px-2 py-1"
                defaultValue={(defaultValue as T) ?? ""}
                {...register(name as Path<ApplicationData>, {
                    required,
                    valueAsNumber: numeric,
                })}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {Object.entries(items).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label as string}
                    </option>
                ))}
            </select>
        );
    }

    return SelectInputInner;
}

function SearchableSelect({
    options,
    placeholder,
    value,
    onChange,
}: {
    options: string[];
    placeholder: string;
    value: string | null;
    onChange: (value: string) => void;
}) {
    const [query, setQuery] = useState(value || "");
    const [open, setOpen] = useState(false);

    const optionsLower = useMemo(
        () => options.map((o) => o.toLowerCase()),
        [options],
    );
    const queryLower = query.trim().toLowerCase();

    // This number is arbitrary, but there needs to be some limit to prevent
    // stuttering on search.
    const filtered = (
        query
            ? options.filter((_, i) => optionsLower[i].includes(queryLower))
            : options
    ).slice(0, 50);

    return (
        <Popover.Root
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
            }}
        >
            <Popover.Anchor asChild>
                <input
                    type="text"
                    className="max-w-full overflow-clip resize-none"
                    value={open ? query : value || ""}
                    placeholder={placeholder}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                />
            </Popover.Anchor>
            <Popover.Portal>
                <Popover.Content
                    // Keep focus on the text input
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={() => setOpen(false)}
                    sideOffset={4}
                    className="z-50 w-50 max-h-50 overflow-y-auto bg-white border border-gray-300 rounded shadow-md"
                >
                    {filtered.map((option) => (
                        <div
                            key={option}
                            className="px-2 py-1 cursor-pointer hover:bg-blue-100 text-sm text-black"
                            onMouseDown={() => {
                                onChange(option);
                                setQuery(option);
                                setOpen(false);
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

function SchoolInput({ name, control, defaultValue, required }: InputProps) {
    const [schools, setSchools] = useState<string[]>([]);

    useEffect(() => {
        import("./schools.json").then((mod) => {
            setSchools(mod.default as string[]);
        });
    }, []);

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={(defaultValue as string) ?? ""}
            rules={{
                required,
                validate: (value) =>
                    schools.length === 0 ||
                    schools.includes(value as string) ||
                    "Please select a school from the list",
            }}
            render={({ field: { onChange, value } }) => (
                <SearchableSelect
                    options={schools}
                    placeholder={
                        schools.length === 0
                            ? "Loading schools..."
                            : "Search for your school..."
                    }
                    value={value as string}
                    onChange={onChange}
                />
            )}
        />
    );
}

const COUNTRIES = [
    "United States",
    "Canada",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
];

function CountrySelect({ name, control, defaultValue, required }: InputProps) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={(defaultValue as string) ?? ""}
            rules={{
                required,
                validate: (value) =>
                    COUNTRIES.includes(value as string) ||
                    "Please select a country from the list",
            }}
            render={({ field: { onChange, value } }) => (
                <SearchableSelect
                    options={COUNTRIES}
                    placeholder="Search for your country..."
                    value={value as string}
                    onChange={onChange}
                />
            )}
        />
    );
}

function AgeSelect({ name, register, defaultValue, required }: InputProps) {
    return (
        <input
            type="text"
            inputMode="numeric"
            className="max-w-full overflow-clip resize-none"
            defaultValue={(defaultValue as number) ?? ""}
            placeholder="Enter your age"
            {...register(name as Path<ApplicationData>, {
                required,
                setValueAs: (v) => (v === "" ? null : Number(v)),
                validate: (value) =>
                    value === null ||
                    (Number.isInteger(value) && (value as number) >= 18) ||
                    "Must be 18 or older",
            })}
        />
    );
}

function MLHCheckboxBase({
    name,
    control,
    required,
    label,
}: InputProps & { label: React.ReactNode }) {
    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate: (value) => !required || value === true }}
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
                <label className="flex items-start gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={value === true}
                        onChange={(e) => onChange(e.target.checked)}
                        className="mt-1 shrink-0"
                    />
                    <span className="text-sm">{label}</span>
                </label>
            )}
        />
    );
}

function MLHCodeOfConductCheckbox(props: InputProps) {
    return (
        <MLHCheckboxBase
            {...props}
            label={
                <>
                    I have read and agree to the{" "}
                    <a
                        href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                    >
                        MLH Code of Conduct
                    </a>
                    .
                </>
            }
        />
    );
}

function MLHDataSharingCheckbox(props: InputProps) {
    return (
        <MLHCheckboxBase
            {...props}
            label={
                <>
                    I authorize you to share my application/registration
                    information with Major League Hacking for event
                    administration, ranking, and MLH administration in-line with
                    the{" "}
                    <a
                        href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                    >
                        MLH Privacy Policy
                    </a>
                    . I further agree to the terms of both the{" "}
                    <a
                        href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                    >
                        MLH Contest Terms and Conditions
                    </a>{" "}
                    and the{" "}
                    <a
                        href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                    >
                        MLH Privacy Policy
                    </a>
                    .
                </>
            }
        />
    );
}

function MLHCommunicationsCheckbox(props: InputProps) {
    return (
        <MLHCheckboxBase
            {...props}
            label="I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements (optional)."
        />
    );
}
