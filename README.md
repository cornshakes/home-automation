# Result

Overall I see this as a failed experiment in that it only tries to do what claude already does much better internally.
I again fell victim to the [Inner Platform Effect](https://en.wikipedia.org/wiki/Inner-platform_effect), trying to build claude in claude.
I went overboard with my idea of keeping context small and being able to create trucks of code, even in parallel. Which makes no sense given that claude just made coding crazy fast anyway. I can barely deal with all the code. Something that I like is the well defined tool use without interaction, but I can also do that by using claude non-interactively on the command line, no need to build a whole project. Anyway, on with the project:

# Home Automation

This is a first stab at automating the prompts I've been using to make claude code work a plan in [Scrollsurf](https://github.com/cornshakes/scrollsurf). For the plan, I use a vscode claude plan mode session and then make it save the plan in the project dir once everything is worked out.

The name "Home Automation" is what it is all about - I don't want to run skynet agent swarms - it's more like, my subscription only works with claude code (ie not pi etc) so I use claude code + some very easy scripting with no ui or harness or other complicated stuff.

The tasker looks for a "newly added plan", specifically I need a non-commited plan.md file.

# Be Careful!
Watch the scripts, watch their output, watch your git history, watch your usage, watch all your files. These scripts will happily
- eat all your tokens
- delete all your files
- commit your home dir to a public repository

There are 3 scripts that can be run in cycles until an approving review is reached:

- `npm run tasker $cwd`
- `npm run coders $cwd`
- `npm run review $cwd`

You can also do all that automatically until either an error or an approving review is reached. *Be careful*

- `npm run full-auto $cwd`

The idea is: all the claudes work without interaction. Whenever they can't continue for some reason, that reason is communicated to me and everything stops. I can then go and fix it, then run full-auto again and it picks up exactly where it left off ie it doens't have to redo significant amounts of work.

This will probably not end in a perfect end state, but it works quite well for me to get larger plans

- implemented in a predictable & reasonable time frame
- without needing any in-between interaction
- providing enough documentation to do *my own actual review* of all the changes in the end

The point of this all - ie why do I not just let one opus rip - is keeping context sizes small because with larger context sizes quality & implementation time degrade while cost rises.
