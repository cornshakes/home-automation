# Home Automation

This is a first stab at automating the prompts I've been using to make claude code work a plan in [Scrollsurf](https://github.com/cornshakes/scrollsurf). For the plan, I use a vscode claude plan mode session and then make it save the plan in the project dir once everything is worked out.

The name "Home Automation" is what it is all about - I don't want to run skynet agent swarms - it's more like, my subscription only works with claude code (ie not pi etc) so I use claude code + some very easy scripting with no ui or harness or other complicated stuff.

The tasker looks for a "newly added plan", specifically I need a non-commited plan.md file.

There are 3 scripts that can be run in cycles until an approving review is reached:

- `npm run tasker $cwd`
- `npm run coders $cwd`
- `npm run review $cwd`

This will probably not end in a perfect end state, but it works quite well for me to get larger plans

- implemented in a predictable & reasonable time frame
- without needing any in-between interaction
- providing enough documentation to do *my own actual review* of all the changes in the end

The point of this all - ie why do I not just let one opus rip - is keeping context sizes small because with larger context sizes quality & implementation time degrade while cost rises.
