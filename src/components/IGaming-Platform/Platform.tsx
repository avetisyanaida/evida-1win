import Link from "next/link";

export const Platform = () => {
    return <section>
        <div className="container">
            <div className={'platform-content'}>
                <p>  Built as a technical demo of a casino platform for iGaming startups and affiliates.</p>
                <Link href="/igaming-platform">View platform details</Link>
            </div>
        </div>
    </section>

}