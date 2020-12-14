# Assign last committers to be file Codeowners

This action reads commit list and parses existing or create new CODEOWNERS file with files assigned committers as 
codeowners. Will keep the last *n of committers on the list.

## Usage

### `workflow.yml` Example

Write a `.yml` file such as this one in your `.github/workflows` folder. [Refer to the documentation on workflow YAML 
syntax here.](https://help.github.com/en/articles/workflow-syntax-for-github-actions)

```yaml
name: Mark Codeowners

on: [pull_request]

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: dmikov/github-action-codeowners-last@master
        with:
          directory_to_track: /src
          number_of_code_owners: 2
```
## Action inputs


| name                    | description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `directory_to_track`    | The directory to track. The CODEOWNERS file will be put there too. |
| `number_of_code_owners` | The number of historical codeowners to keep per source file.  |


## Action outputs

| name               | description          |
| ------------------ | ---------------------|
| `file`       | The codeowners file it was written to. |

The file has to be committed back, so for the next step its location is helpful.
