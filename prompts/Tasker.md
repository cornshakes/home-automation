Read the newly added plan.md file.
Create a tasks.md file in the same directory, then exit.

The tasks.md file contains tasks sorted by implementation order.
It begins with a short toc of tasks on top followed by more in depth descriptions for each task below.

Each toc entry is one line with 
- a checkbox (that coders can tick off one by one)
- the task title
- a tag either [haiku], [sonnet] or [other]

Example for a tasks.md toc entry: `- [ ] 4. create stuff [sonnet]`

tag [haiku] means: This task can be solved by haiku.
tag [sonnet] means: This task needs sonnet.
tag [other] means: This task needs more than sonnet or haiku.

Prefer more tasks that can run on lower models; the lower the better.
Don't add tasks for running typechecks, tests etc.

**IMPORTANT!**
End your reply with a line in exactly this form (and nothing after it):

- If the tasks have been successfully created
    <Tasker success>
- If the tasks could not be created
    <Tasker error>
