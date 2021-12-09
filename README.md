# REFERENCES

## What are Workspaces for? [01-workspaces]

Workspaces help us managing repositories with multiple packages - more than one `package.json` file. In projects like this, you usually have a complex dependency tree, with many packages depending on each other. This special type of repository is known as a **monorepo**.

## What changes with Workspaces?

Now, when you run npm install in a `multi-package` repository, npm's dependency tree manager is smart enough to scan your folders looking for all dependencies to install.

Dependencies are hoisted, meaning they get installed in the root `node_modules` folder. This is done for performance reasons: if a dependency is shared by multiple packages, it gets saved only once in the root.

Your packages (the ones you created) also get symlinked in the root `node_modules` folder. If two of your packages depend on each other, they get the reference from there.

For example, if you have this structure:

```
.
├── package.json
└── packages
    ├── package-a
    │   └── package.json # Dependencies: `lodash`
    └── package-b
        └── package.json # Dependencies: `lodash`, `package-a`
```

After running `npm install`, your `node_modules` folder will look like this:

```
.
├── node_modules
│   ├── lodash # `lodash` is installed in the root `node_modules/`
│   ├── package-a # package-a is symlinked
│   └── package-b # package-b is symlinked
├── package.json
└── packages
    └── # ...
```

If you have packages using the same dependency but on different versions, npm will create a `node_modules` folder inside of one of the packages. For example, suppose `package-a` uses `lodash@4` while `package-b` is still on `lodash@3`:

```
.
├── package.json
└── packages
    ├── package-a
    │   └── package.json # Dependencies: `lodash@4`
    └── package-b
        └── package.json # Dependencies: `lodash@3`
```

When running npm install, you will get the following result:

```
.
├── node_modules
│   ├── lodash # This will be `lodash` version 4.x
│   └── # ...
├── package.json
└── packages
    ├── package-a
    │   └── package.json
    └── package-b
        │   node_modules # `node_modules` is created inside the package
        │      └── lodash # This is `lodash` version 3.x
        └── package.json
```

These are just a few examples to illustrate how the new dependency resolution works on Workspaces, there's certainly a lot more happening under the hood.

You can run all the "test" scripts at once by adding the --workspaces (plural) to your npm run command:

```
# Run "test" script on all packages
npm run test --workspaces

# Tip - this also works:
npm run test  -ws
```

The `install` command also accepts the `--workspace` flag:

> Important! This was only introduced on npm@7.14.0

```
# Install `lodash` on `package-a`
npm install lodash --workspace package-a

# Install `tap` on `package-b` as a dev dependency
npm install tap --workspace package-b --save-dev

# Install `package-a` on `package-b`
npm install package-a --workspace package-b

# Install `eslint` in all packages
npm install eslint --workspaces
```

https://ruanmartinelli.com/posts/npm-7-workspaces-1

---

## Simplify your monorepo with npm7 workspaces [02-monorepo-react]

**Monorepo use cases**

A monorepo is a term describing a single git repository that contains many projects.

The most common reason to set up a monorepo is to streamline work within a dev team that maintains multiple apps that are using a shared piece of code, for example a common User Interface library.

Imagine a team that develops two React apps that shares some common UI elements like inputs, selectors, accordions, etc. It would be nice to extract that UI in form of React components and prepare building blocks that are ready to use for all members of the team.

Apart from that it's just more convenient to have all your source files opened in a single IDE instance. You can jump from project to project without switching windows on your desktop.

**Defining workspaces in npm 7**
I am prefixing all packages' names with `@oce` so they will be distinctive from the official npm registry. Just change it to yours.

This is the most crucial part of the whole setup. Insert below inside your root folder's package.json to set up a monorepo.

```
{
    "name": "@oce/monorepo-react",
    "private": true,
    "version": "1.0.0",
    "workspaces": [
        "./common/*"
    ]
}
```

https://dev.to/limal/simplify-your-monorepo-with-npm-7-workspaces-5gmj
