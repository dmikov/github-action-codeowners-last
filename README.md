# Assign last committers to be files Codeowners

Takes authors of last commit (push or pull request) and adds them to CODEOWNERS file per each file.
Will keep the last *n of committers on the list per file.

## Usage

### `workflow.yml` Example

Write a `.yml` file such as this one in your `.github/workflows` folder. [Refer to the documentation on workflow YAML 
syntax here.](https://help.github.com/en/articles/workflow-syntax-for-github-actions)

```yaml
name: 'update-codeowners'
on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main
      - 'releases/*'

jobs:
  update:
    runs-on: ubuntu-latest
    # Read the notes about preventing merges overwriting owners created by PR
    if: ! startsWith( github.event.head_commit.message, 'Merge pull request' )
    steps:
      - uses: actions/checkout@master
        with:
          fetch-depth: 0
      - name: create CODEOWNERS
        id: codeowners
        uses: dmikov/github-action-codeowners-last@main
        with:
          number_of_code_owners: 2
      - name: commit CODEOWNERS
        if: ${{ steps.codeowners.outputs.file }}
        uses: EndBug/add-and-commit@v5
        with:
          message: 'commit CODEOWNERS'
          add: ${{ steps.codeowners.outputs.file }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Action was made intentionally to have a single responsibility, it will add authors when you tell it to. So prevention
of double run on PR and merge to main branch is your responsibility. You can of course disallow pushes to
main branch without PR (as you should), then you can exclude the main branch from push trigger. As an opposite
you can only update codeowners on push to main, less observable, but less of a chance for conflicts between
multiple branches. If you need both however, the condition on the job `if: github.event.pull_request.merged != true`
should prevent double runs. Might not be so.

## Action inputs


| name                    | description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `directory_to_track`    | The directory to track. The CODEOWNERS file will be put there too. |
| `number_of_code_owners` | The number of historical codeowners to keep per source file.  |
| `file`       | The codeowners file it should be written to. |


## Action outputs

| name               | description          |
| ------------------ | ---------------------|
| `file`       | The codeowners file it was written to. Same as input or null if nothing is written.|

The file has to be committed back, so for the next step its location is helpful.
