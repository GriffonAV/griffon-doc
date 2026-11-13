import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import githubReleasesPlugin from "./plugins/github-releases";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)


const config: Config = {
    title: "Griffon",
    tagline: "GriffonAV - Linux Antivirus",
    favicon: "img/favicon.ico",

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    url: "https://griffon-av.vercel.app",
    baseUrl: "/",


    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    plugins: [
        githubReleasesPlugin,
        [
            "@docusaurus/plugin-content-docs",
            {
                id: "extensions",
                path: "extensions",
                routeBasePath: "extensions",
                sidebarPath: "./extensions-sidebars.ts",
                editUrl: "https://github.com/GriffonAV/griffon-doc/edit/main/website/",
            },
        ],
    ],

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    editUrl: "https://github.com/GriffonAV/griffon-doc/edit/main/website/",
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ["rss", "atom"],
                        xslt: true,
                    },
                    editUrl: "https://github.com/GriffonAV/griffon-doc/edit/main/website/",
                    onInlineTags: "warn",
                    onInlineAuthors: "warn",
                    onUntruncatedBlogPosts: "warn",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        image: "img/griffon.png",
        navbar: {
            title: "Griffon",
            logo: {
                alt: "Griffon Logo",
                src: "img/logo.png",
            },
            items: [
                {
                    to: "/docs/installation", // Standard link instead of type: "doc"
                    position: "left",
                    label: "Install Griffon",
                    activeBaseRegex: "^/docs/installation",
                },
                {
                    to: "/docs/introduction",
                    position: "left",
                    label: "Docs",
                    activeBaseRegex: "^/docs/introduction",
                },
                {
                    to: "/extensions",
                    position: "left",
                    label: "Extensions",
                    activeBaseRegex: "^/extensions",
                },
                {
                    to: "/blog",
                    label: "Blog",
                    position: "left"
                },
                {
                    href: "https://github.com/GriffonAV/griffon",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "Introduction",
                            to: "/docs/introduction",
                        },
                    ],
                },
                {
                    title: "Community",
                    items: [
                        {
                            label: "Discord",
                            href: "https://discord.gg/2mP5bBC7HZ",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "Blog",
                            to: "/blog",
                        },
                        {
                            label: "GitHub",
                            href: "https://github.com/GriffonAV/griffon",
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} GriffonAV. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ['toml'],
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
