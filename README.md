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
      - uses: submitty/action-pr-title@master
```
