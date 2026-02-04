import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://evida-test.vercel.app",
            lastModified: new Date(),
        },
        {
            url: "https://evida-test.vercel.app/igaming-platform",
            lastModified: new Date(),
        },
    ];
}
