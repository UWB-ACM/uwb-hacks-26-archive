export default function ContactSection() {
    return (
        <section className="w-full bg-[#13c5f8]">
            <div className="w-[80vw] max-w-[1000px] py-4 lg:py-6 mx-auto text-center tracking-wider md:tracking-widest">
                <h2 className="text-sm lg:text-lg text-center">
                    Interested in sponsoring?
                </h2>

                <h3 className="text-base lg:text-xl text-center font-bold">
                    Reach out to{" "}
                    <a
                        href="mailto:uwbacm@uw.edu"
                        className="underline inline-block transition-transform hover:scale-102"
                    >
                        uwbacm@uw.edu
                    </a>
                    !
                </h3>
            </div>
        </section>
    );
}
