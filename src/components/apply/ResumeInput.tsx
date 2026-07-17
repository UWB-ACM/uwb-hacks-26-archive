import React, { useState, useRef } from "react";
import { Controller, Path } from "react-hook-form";
import { ApplicationData } from "@/src/util/dataTypes";
import {
    ALLOWED_RESUME_EXTENSIONS,
    MAX_RESUME_SIZE_BYTES,
    AllowedResumeExtension,
} from "@/src/util/applicationValidation";
import { InputProps } from "@/src/components/apply/UserInput";

const ACCEPT = ALLOWED_RESUME_EXTENSIONS.map((ext) => `.${ext}`).join(",");

export default function ResumeInput({
    name,
    control,
    setError,
    clearErrors,
    defaultValue,
    onFileSelect,
    onDeleteResume,
}: InputProps) {
    const fieldPath = name as Path<ApplicationData>;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    // Whether the user explicitly cleared a previously uploaded or newly selected resume.
    // If so, we should delete the old one.
    const [cleared, setCleared] = useState(false);

    const hasExistingResume = !cleared && !fileName && defaultValue;

    return (
        <Controller
            name={fieldPath}
            control={control}
            defaultValue={defaultValue ?? undefined}
            render={({
                field: { onChange },
                fieldState: { error: fieldError },
            }) => (
                <div className="flex flex-col gap-2">
                    {/* Show file picker when there's no existing resume displayed */}
                    {!hasExistingResume && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="border-2 border-black rounded-full px-3 py-1 text-sm hover:bg-gray-100 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Choose file
                            </button>
                            {!fileName && (
                                <span className="text-sm text-gray-500">
                                    No file chosen
                                </span>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPT}
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;

                                    if (!file) {
                                        setFileName(null);
                                        onFileSelect?.(null);
                                        onChange(defaultValue ?? null);
                                        return;
                                    }

                                    // Validate size
                                    if (file.size > MAX_RESUME_SIZE_BYTES) {
                                        setError(fieldPath, {
                                            type: "validate",
                                            message: `File is too large. Maximum size is ${MAX_RESUME_SIZE_BYTES / (1024 * 1024)}MB.`,
                                        });
                                        return;
                                    }

                                    // Validate extension
                                    const ext = file.name
                                        .split(".")
                                        .pop()
                                        ?.toLowerCase();
                                    if (
                                        !ext ||
                                        !ALLOWED_RESUME_EXTENSIONS.includes(
                                            ext as AllowedResumeExtension,
                                        )
                                    ) {
                                        control.setError(fieldPath, {
                                            type: "validate",
                                            message: `Invalid file type. Allowed: ${ALLOWED_RESUME_EXTENSIONS.join(", ")}`,
                                        });
                                        return;
                                    }

                                    setFileName(file.name);
                                    setCleared(false);
                                    onFileSelect?.(file);
                                    onDeleteResume?.(false);
                                    onChange(ext);
                                    clearErrors(name);
                                }}
                            />
                        </div>
                    )}

                    {fieldError && (
                        <p className="text-red-500 text-sm">
                            {fieldError.message}
                        </p>
                    )}

                    {/* Resume exists (either from preivous app or newly selected) */}
                    {(hasExistingResume || fileName) && (
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">
                                {hasExistingResume
                                    ? "Resume previously uploaded"
                                    : `Selected: ${fileName}`}
                            </p>
                            <button
                                type="button"
                                className="text-sm text-red-500 underline"
                                onClick={() => {
                                    setFileName(null);
                                    setCleared(true);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                    onFileSelect?.(null);
                                    onDeleteResume?.(true);
                                    onChange(null);
                                    clearErrors(name);
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            )}
        />
    );
}
