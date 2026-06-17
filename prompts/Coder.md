Read the newly added plan.md, tasks.md and review-%n.md files.
There's a toc in tasks.md that lists tasks in implementation order.
The tasks have to be done sequentially from top to bottom.
A task is blocked until all previous tasks are completed (checked off).

Work through the tasks tagged [$TAG]:
- Find the first unchecked task. As it is the first unchecked task, it is unblocked.
- If it is tagged [$TAG], do it, then check its checkbox.
- Continue to the next unchecked task and repeat, as long as it is tagged [$TAG].
- Exit as soon as the next unchecked task is NOT tagged [$TAG], or no unchecked tasks remain.

Don't make any commits.

**IMPORTANT!**
End your reply with a line in exactly this form (and nothing after it):

- If there are no unchecked tasks tagged [$TAG] left anywhere:
    <$TAG all_done>
- If unchecked [$TAG] tasks remain but the next unchecked task is tagged for someone else (blocked for you):
    <$TAG more_later>
- If an error / something unexpected happens:
    <$TAG error> <max 8 words>
- If you require anything else (e.g. tool access, more info) to complete a task with confidence and good quality:
    <$TAG need> <max 8 words>
