# GriffonAV Documentation

This repository contains the source for the [GriffonAV documentation website](https://griffon-av.vercel.app/). It documents how to install and use GriffonAV, how the project works, how to contribute, and how to use its extensions.

The GriffonAV application itself is maintained in the [GriffonAV/griffon](https://github.com/GriffonAV/griffon) repository.

## Website structure

The website is built with [Docusaurus](https://docusaurus.io/) and lives in [`website`](./website):

- `website/docs` — user and developer documentation
- `website/extensions` — extension documentation, published as a separate website section
- `website/blog` — project articles and updates
- `website/src` — React components, pages, hooks, and styling
- `website/static` — images and other static assets
- `website/docusaurus.config.ts` — website and navigation configuration
- `website/sidebars.ts` — main documentation sidebar
- `website/extensions-sidebars.ts` — extensions sidebar

Files that are no longer published but are kept for reference live in [`archived`](./archived).

## Local development

The website requires Node.js 18 or newer.

```bash
cd website
npm install
npm start
```

The development server reloads when content or source files change.

## Validation and production build

Run the type checker and production build before submitting changes:

```bash
cd website
npm run typecheck
npm run build
```

The build treats broken links as errors. Generated static files are written to `website/build`.

## Release information

A custom Docusaurus plugin retrieves public releases from [GriffonAV/griffon](https://github.com/GriffonAV/griffon/releases) during the build. This powers the latest-release banner and installation links.

Set `GITHUB_TOKEN` in the build environment to avoid GitHub's anonymous API rate limit. If the API is unavailable, the build continues without release data and the website falls back to its regular GitHub links.

## Deployment

The production website is hosted on Vercel:

**[griffon-av.vercel.app](https://griffon-av.vercel.app/)**

The Docusaurus production URL and root base path are configured in `website/docusaurus.config.ts`.

## Contributing

Documentation improvements are welcome. Keep content in the appropriate section and verify that both the type check and production build pass before opening a pull request.

For changes to the antivirus application rather than its documentation, contribute to [GriffonAV/griffon](https://github.com/GriffonAV/griffon).

## Authors

<table>
    <tbody>
        <tr>
            <td align="center">
                <a href="https://github.com/Raphael-Mabille">
                    <img src="https://avatars.githubusercontent.com/u/114607576?s=96&v=4" width="100px;" alt="Sebabacou"/><br />
                    <sub><b>Sebabacou</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/orgs/GriffonAV/people/Sebabacou">
                    <img src="https://avatars.githubusercontent.com/u/114739950?s=96&v=4" width="100px;" alt="Raphael_m"/><br />
                    <sub><b>Raphael_m</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ewen1507">
                    <img src="https://avatars.githubusercontent.com/u/114604459?s=96&v=4" width="100px;" alt="ewen1507"/><br />
                    <sub><b>ewen1507</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/DiaboloAB">
                    <img src="https://avatars.githubusercontent.com/u/109909203?s=96&v=4" width="100px;" alt="Alexis Boitel"/><br />
                    <sub><b>Alexis Boitel</b></sub>
                </a>
            </td>
        </tr>
    </tbody>
</table>

## License

See [LICENSE](./LICENSE) for this repository's license terms.
