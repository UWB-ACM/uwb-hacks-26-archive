interface FileDownloadProps {
    filePath: string;
    fileName: string;
    content?: string;
}

export default function FileDownload({
    filePath,
    fileName,
    content = "",
}: FileDownloadProps) {
    return (
        <a
            href={filePath}
            download={fileName}
            className="z-5 md:w-1/2 bg-white hover:bg-gray-100 text-[#0d83db] text-sm sm:text-base md:text-lg lg:text-xl font-bold py-3 px-6 sm:px-8 md:px-10 rounded-full flex items-center justify-center"
        >
            {content}
        </a>
    );
}
