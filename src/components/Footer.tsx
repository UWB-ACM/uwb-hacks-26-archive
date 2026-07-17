import Link from "next/link";
import { cn } from "../util/utils";

/**
 *
 * @param className - additional styling to be added to Footer
 */
function Footer({ className = "" }: { className?: string }) {
    return (
        <footer
            className={cn(
                "flex flex-col justify-center items-center text-black py-2 lg:py-4 text-[0.6rem] md:text-[0.8rem] lg:text-[0.9rem] xl:text-base bg-[#84c6ff]",
                className,
            )}
        >
            <p className="text-center">&copy; 2026 UWB ACM</p>
            <div className="flex gap-5">
                <Link href="/tos">Terms of Service</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link
                    href="https://uwb-hacks-the-future.devpost.com/"
                    target="_blank"
                >
                    Devpost
                </Link>
                <Link
                    href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                    target="_blank"
                >
                    MLH Code of Conduct
                </Link>
            </div>
        </footer>
    );
}

export default Footer;
