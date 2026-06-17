Read the newly added plan.md, tasks.md and review-%n.md files.

The tasks.md file contains tasks sorted by implementation order.
It begins with a short toc of tasks on top followed by more in depth descriptions for each task below.

Create tasks for the latest review and append them in a new section in tasks.md.

Each toc entry is one line with a checkbox (that coders can tick off one by one) and a tag either [haiku], [sonnet] or [other].

tag [haiku] means: This task can be solved by haiku.
tag [sonnet] means: This task needs sonnet.
tag [other] means: This task needs more than sonnet or haiku.

Prefer more tasks that can run on lower models; the lower the better.
Add one final task to run npm lint-fix.

**IMPORTANT!**
End your reply with a line in exactly this form (and nothing after it):

- If the tasks have been successfully created
    <Tasker success>
- If the tasks could not be created
    <Tasker error>
