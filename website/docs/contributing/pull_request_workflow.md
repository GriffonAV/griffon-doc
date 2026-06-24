---
sidebar_position: 3
---


# Pull request validation workflow

## pull request to a common branch ( not dev, not main )

- If the two branches you are trying to merge are your own no review is required.  

:::warning  
If the changes involve work from others, ask at least one of them to review the pull request.
:::

## Pull request to dev

- A pull request to dev must have at least one review before it can be accepted  
    - Fix PRs are fine with just one review  
    - Important feature PRs should have two reviews when possible

## Pull request to main  
  
:::important  
Pull requests to main should only be made after a meeting with at least three team members.  
Whenever possible, review the code together in real time instead of relying on asynchronous reviews.
:::  

:::warning  
Hotfix pull requests must always be reviewed. However, they can be approved by only one team member without following the usual main PR requirements.  
:::

## General Reviewer rules

- If you’re the last requested reviewer and have no further comments, you should merge the pull request and delete the branch, unless stated otherwise in the PR


## General PR maker rules

- Treat all PR comments and requested changes seriously and address them thoroughly
- After making updates, request another review from the person who left the comment