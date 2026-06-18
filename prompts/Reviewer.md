Read the newly added plan.md, tasks.md and review-%n.md files.

Before beginning any other work, make sure you have access to all the tools (e.g. Bash, Read, Write etc) you need.
If you don't have all the access that you need, stop the Review *immediately* and don't write a review file.
Instead, list the exact tools that are required, i.e. specify the exact command in Bash and the exact file in Write/Edit, then end with <Review need> (see below).

Only once you have all the tool access that is required, begin the review and write the result to a review-%n.md file in the same directory with %n being one higher than the number of existing review files in that directory. Read previous review files before your own review.

- Review code using the guidelines in CLAUDE.md.
- Focus on easy-to-read code, following standards, using mature&popular libraries instead of handcrafted solutions.
- Run checks, linting, unit tests, e2e tests etc.

Use only these npm scripts to check/lint:
- check
- test
- test:e2e

Don't make any commits.

Do not make any edits! Review only.
The file begins with a line in this format:
`# Review %n: $verdict` where $verdict is either `Approve` or `Disapprove`.

**IMPORTANT!**
End your reply with a line in exactly this form (and nothing after it):

- If the review is done with approval
    <Review approve>
- If the review is done but no approval
    <Review disapprove>
- If an error / something unexpected happens:
    <Review error>
- If you require anything else to complete the review with confidence and good quality:
    <Review need>


