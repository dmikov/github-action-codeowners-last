# Assign last committers to be files Codeowners

This action reads commit list and parses existing or create new CODEOWNERS file with files assigned committers as 
codeowners. Will keep the last *n of committers on the list.

## Usage

### `workflow.yml` Example

Write a `.yml` file such as this one in your `.github/workflows` folder. [Refer to the documentation on workflow YAML 
syntax here.](https://help.github.com/en/articles/workflow-syntax-for-github-actions)

```yaml
name: 'build-codeowners'
on: # rebuild any PRs and main branch changes
  pull_request:
  push:
    branches:
      - main
      - 'releases/*'

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: create CODEOWNERS
        id: codeowners
        uses: dmikov/github-action-codeowners-last@main
        with:
          number_of_code_owners: 2
      - name: commit CODEOWNERS
        id: committed
        if: ${{ steps.codeowners.outputs.file }}
        uses: stefanzweifel/git-auto-commit-action@v4.7.2
        with:
          commit_message: 'chore(meta): update code owners'
          file_pattern: ${{ steps.codeowners.file }}
```

## Action inputs


| name                    | description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `directory_to_track`    | The directory to track. The CODEOWNERS file will be put there too. |
| `number_of_code_owners` | The number of historical codeowners to keep per source file.  |
| `file`       | The codeowners file it should be written to. |


## Action outputs

| name               | description          |
| ------------------ | ---------------------|
| `file`       | The codeowners file it was written to. Same as input. Done to avoid double typing in workflow.|

The file has to be committed back, so for the next step its location is helpful.
