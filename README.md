# action-pr-title

[![Test](https://github.com/Submitty/action-pr-title/actions/workflows/test.yml/badge.svg)](https://github.com/Submitty/action-pr-title/actions/workflows/test.yml)

GitHub action that validates PR titles meets [our title guidelines](https://submitty.org/developer/how_to_contribute#how-to-make-a-pull-request-pr-to-submitty).

## Usage

```yaml

name: 'PR Title Check'
on:
  pull_request:
    # check when PR
    # * is created,
    # * title is edited, and
    # * new commits are added (to ensure failing title blocks merging)
    types: [ opened, reopened, edited, synchronize ]

jobs:
  title-check:
    runs-on: ubuntu-latest
    steps:
      - uses: submitty/action-pr-title@main
```

## Development

### Requirements:

* NodeJS 20+

### Setup

```bash
npm install
```

### Contributing

For new code, you will need to:

1. Write the code
1. Lint the code (`npm run lint`) and test it (`npm run test`)

After you're satisfied with the changes you've made, you will want to finally update the files under `dist/` with your change
by running `npm run package`. Make sure to commit these changed files, as these are the files that are used when people utilize
this action!

With that done, create a PR!
