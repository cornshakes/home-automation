Read the newly added plan.md, tasks.md and review-%n.md files.
There's a toc in tasks.md that lists tasks in implementation order.
The tasks have to be done sequentially from top to bottom.
A task is blocked until all previous tasks are completed (checked off).

Work through the tasks tagged [$TAG]:
- Find the first unchecked task. As it is the first unchecked task, it is unblocked.
- If it is tagged [$TAG], do it (see below).
- Continue to the next unchecked task and repeat, as long as it is tagged [$TAG].
- Exit as soon as the next unchecked task is NOT tagged [$TAG], or no unchecked tasks remain.

Doing a task:
When doing a task, make sure you run the relevant tests.
Before finishing, make sure that `npm run check-fix` passes cleanly.
After finishing, update the tasks.md file to put an x into the checkbox of the task that you just completed.
If you try to get it right 3 times but it's still not working, respond with a short summary, then end with an error (see below).


Use only these npm scripts to check/lint/fix:
- check-fix
- test
- test:e2e
- test:e2e:update

Don't make any commits.

**IMPORTANT!**
End your reply with a line in exactly this form (and nothing after it):

- If there are no unchecked tasks tagged [$TAG] left anywhere:
    <Coder all_done>
- If unchecked [$TAG] tasks remain but the next unchecked task is tagged for someone else (blocked for you):
    <Coder more_later>
- If an error / something unexpected happens:
    <Coder error>
- If you require anything else (e.g. tool access, more info) to complete a task with confidence and good quality:
    <Coder need>
