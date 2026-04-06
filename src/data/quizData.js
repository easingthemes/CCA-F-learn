export const quizSections = [
  {
    id: 's1',
    title: 'Claude Code for Continuous Integration',
    shortTitle: 'CI/CD Integration',
    context:
      'You are setting up Claude Code within your team\'s CI/CD pipeline. The system performs automated code reviews, generates test suggestions, and provides feedback on pull requests. You need to design prompts that deliver useful feedback while keeping false positives low.',
    color: '#e88c30',
    questions: [
      {
        id: 1,
        text: 'Your pipeline uses Claude for three distinct jobs: (1) a lint-and-logic check on every pull request that gates merging, (2) a full dependency vulnerability scan that runs on a Saturday schedule, and (3) automated documentation generation triggered each night for modules changed that day. The Message Batches API cuts costs by 50% but may take up to 24 hours. You want to minimize spend without hurting developer workflow. Which pairing of each job to its API mode is correct?',
        options: [
          {
            letter: 'A',
            text: 'Use real-time calls for the PR lint-and-logic check; use the Message Batches API for the weekly vulnerability scan and nightly documentation generation.',
          },
          {
            letter: 'B',
            text: 'Use real-time calls for the PR lint-and-logic check and nightly documentation generation; use the Message Batches API only for the weekly vulnerability scan.',
          },
          {
            letter: 'C',
            text: 'Use real-time calls for all three jobs for predictable latency, and offset costs with prompt caching.',
          },
          {
            letter: 'D',
            text: 'Use the Message Batches API for all three jobs to capture the full 50% savings, polling for results in each workflow.',
          },
        ],
        correct: 'A',
        explanation:
          'The PR check blocks developers and demands immediate results via real-time calls. The weekly vulnerability scan and nightly documentation generation both run on fixed schedules with no one waiting, so they can comfortably absorb the up-to-24-hour batch window and capture the 50% cost reduction.',
        wrongExplanations: {
          B: 'This correctly uses real-time calls for the latency-sensitive PR check but leaves money on the table by paying full price for nightly documentation generation, a scheduled job that can easily tolerate batch processing times.',
        },
        studyArea:
          'Claude Code for Continuous Integration — review Batch Processing concepts in the exam study guide.',
        studyAreaLink: '/domains/d4#task-4.5',
      },
      {
        id: 2,
        text: 'Your automated review scans error-handling blocks. The prompt tells Claude to "verify that error handling is correct and complete." The system frequently flags acceptable patterns (catch blocks that log and re-throw, intentionally empty catches with explanatory comments) while overlooking handlers that silently swallow exceptions and return stale data. What change fixes the root cause of this inconsistency?',
        options: [
          {
            letter: 'A',
            text: 'Add few-shot examples of poor error handling so the model can pattern-match similar issues',
          },
          {
            letter: 'B',
            text: 'Define precise criteria: flag error handlers only when they suppress exceptions without logging, re-throwing, or returning an explicit error state',
          },
          {
            letter: 'C',
            text: 'Provide git history so Claude can spot error handlers added hastily in recent commits',
          },
          {
            letter: 'D',
            text: 'Pre-filter catch blocks that contain comments or logging before sending them to Claude',
          },
        ],
        correct: 'B',
        explanation:
          'Replacing the vague "correct and complete" instruction with a precise definition of what constitutes a problem—suppressing exceptions without logging, re-throwing, or returning an error state—eliminates both false positives on acceptable patterns and false negatives on genuinely dangerous handlers.',
      },
      {
        id: 3,
        text: 'Your automated review produces findings in four categories. Bug detection and security findings have a 6% false positive rate, while code complexity findings have 45% and formatting findings have 55%.\n\nDevelopers have started ignoring all review output because "most of it is noise." The unreliable categories are eroding confidence in the accurate ones. How do you best restore trust while keeping the system useful?',
        options: [
          {
            letter: 'A',
            text: 'Leave all categories active and gradually improve each one with better few-shot examples over the next sprint.',
          },
          {
            letter: 'B',
            text: 'Lower the sensitivity uniformly across every category until the aggregate false positive rate is acceptable.',
          },
          {
            letter: 'C',
            text: 'Show a confidence percentage alongside each finding and let developers filter by threshold.',
          },
          {
            letter: 'D',
            text: 'Turn off the high-noise categories (complexity, formatting) immediately and keep only bug detection and security active while you refine the prompts for the disabled categories.',
          },
        ],
        correct: 'D',
        explanation:
          'Immediately removing the noisy categories stops the trust bleed by ensuring every finding developers see is highly likely to be real. The valuable bug-detection and security checks continue providing value while you iterate on the prompts for complexity and formatting before re-enabling them.',
      },
      {
        id: 4,
        text: 'Your security scanner works in multiple rounds: Claude examines a source file, then uses a tool to request dependency manifests, lock files, or configuration files it needs for deeper analysis before issuing its final verdict. You define a tool that supplies these files on demand. You are considering switching this workflow to the Message Batches API to save on costs.\n\nWhat is the key technical barrier to using batch processing here?',
        options: [
          {
            letter: 'A',
            text: 'The batch API does not allow tool schemas to be included in the request payload.',
          },
          {
            letter: 'B',
            text: 'The fire-and-forget nature of batch requests means there is no way to run a tool mid-request and feed its output back for Claude to continue reasoning.',
          },
          {
            letter: 'C',
            text: 'Batch responses are returned in random order, making it impossible to correlate results with the original requests.',
          },
          {
            letter: 'D',
            text: 'The up-to-24-hour turnaround is too slow for a security gate, although the multi-turn workflow would technically work in batch mode.',
          },
        ],
        correct: 'B',
        explanation:
          'Batch processing is fire-and-forget: once a request is submitted, there is no channel to intercept a tool-use request, execute the tool, and return results for Claude to continue. This makes iterative tool-calling workflows fundamentally incompatible with batch mode.',
        wrongExplanations: {
          D: 'Latency is a practical concern, but the claim that the workflow would otherwise function is wrong. The core issue is architectural: batch mode cannot support the back-and-forth tool-calling loop, regardless of turnaround speed.',
        },
        studyArea:
          'Claude Code for Continuous Integration — review Batch Processing concepts in the exam study guide.',
        studyAreaLink: '/domains/d4#task-4.5',
      },
      {
        id: 5,
        text: 'Your CI setup has two Claude-powered review stages: a required status check that must pass before a PR can merge, and an "extended audit" that kicks off after midnight, polls for batch results, then posts detailed recommendations the next morning. You want to cut API costs with the Message Batches API (50% savings, up to 24-hour turnaround, poll-based). Which stage should use batch processing?',
        options: [
          { letter: 'A', text: 'Extended audit only' },
          { letter: 'B', text: 'Neither stage' },
          { letter: 'C', text: 'Both stages' },
          { letter: 'D', text: 'Required status check only' },
        ],
        correct: 'A',
        explanation:
          'The extended audit already runs overnight with no one waiting, tolerates high latency, and uses polling—a perfect match for the Message Batches API. The required status check blocks developers and must return quickly, ruling out batch mode.',
      },
      {
        id: 6,
        text: 'Your CI job invokes the Claude Code CLI in --print mode with CLAUDE.md for project context. The resulting reviews are high quality, but developers struggle to act on them because Claude returns free-form paragraphs. Your team wants to automatically create individual inline comments on the PR at the exact changed lines, which requires machine-readable data containing the file path, line number, severity, and a concrete fix. What is the best approach?',
        options: [
          {
            letter: 'A',
            text: 'Add formatting rules to the review prompt requiring each finding to use a parseable template like [FILE:path] [LINE:n] [SEV:level] …',
          },
          {
            letter: 'B',
            text: 'Keep the narrative output and add a second Claude call that converts it into a structured JSON array of findings.',
          },
          {
            letter: 'C',
            text: 'Add an "Output Format" section to CLAUDE.md with sample structured findings so Claude picks up the pattern from project context.',
          },
          {
            letter: 'D',
            text: 'Pass --output-format json and --json-schema to the CLI to enforce a strict JSON schema, then parse the output to post inline comments via the GitHub API.',
          },
        ],
        correct: 'D',
        explanation:
          'The `--output-format json` and `--json-schema` CLI flags enforce structured output at the tool level, guaranteeing valid JSON with the required fields. This is the most reliable approach because it uses native CLI capabilities purpose-built for structured output rather than relying on prompt-level formatting hints.',
      },
      {
        id: 7,
        text: 'Your CI job suggests new unit tests for each PR. On a PR adding a payment retry mechanism, Claude proposes 12 test cases, but the team finds that 7 of them duplicate scenarios already present in the existing test file. How do you most effectively reduce these redundant suggestions?',
        options: [
          {
            letter: 'A',
            text: 'Add a post-processing step that compares suggestion descriptions against existing test names using keyword overlap',
          },
          {
            letter: 'B',
            text: 'Tell Claude to suggest only negative-path and boundary tests, skipping happy-path scenarios',
          },
          {
            letter: 'C',
            text: 'Cap the number of suggestions at 5, assuming Claude will surface the highest-value ones first',
          },
          {
            letter: 'D',
            text: 'Include the current test file in the prompt context so Claude can see which scenarios are already covered',
          },
        ],
        correct: 'D',
        explanation:
          'Providing the existing test file lets Claude see what is already covered and reason about which additional tests would be genuinely new. This addresses the root cause—lack of information about existing coverage—rather than applying brittle post-hoc filters.',
        wrongExplanations: {
          A: 'Keyword matching between suggestion descriptions and existing test names is fragile: semantically identical tests described with different wording would slip through. This treats the symptom instead of the root cause.',
        },
        studyArea:
          'Claude Code for Continuous Integration — review Context Provision Methods concepts in the exam study guide.',
        studyAreaLink: '/domains/d5#task-5.1',
      },
      {
        id: 8,
        text: 'A GitHub Actions step runs claude "Review this diff for potential regressions" but the job never completes. The runner logs show Claude Code is waiting for user input. How do you fix this for an automated pipeline?',
        options: [
          {
            letter: 'A',
            text: 'Use the -p flag: claude -p "Review this diff for potential regressions"',
          },
          {
            letter: 'B',
            text: 'Export CLAUDE_HEADLESS=true before the command',
          },
          {
            letter: 'C',
            text: 'Pipe /dev/null into stdin: claude "Review this diff for potential regressions" < /dev/null',
          },
          {
            letter: 'D',
            text: 'Append --batch: claude --batch "Review this diff for potential regressions"',
          },
        ],
        correct: 'A',
        explanation:
          'The `-p` (or `--print`) flag is the documented method for running Claude Code non-interactively. It processes the prompt, writes the result to stdout, and exits immediately—exactly what CI runners need.',
      },
      {
        id: 9,
        text: 'Your review pipeline catches real bugs, but developers complain the output is not actionable. Comments read like "possible race condition in worker pool" or "suboptimal query plan" with no guidance on what to change. Adding a prompt instruction like "always provide a concrete fix" yields inconsistent results—some findings are detailed, others remain vague. Which technique most reliably produces uniform, actionable feedback?',
        options: [
          {
            letter: 'A',
            text: 'Provide 3-4 few-shot examples demonstrating the exact output structure: identified issue, file and line, and a specific code-level fix',
          },
          {
            letter: 'B',
            text: 'Split into two passes—one to detect issues, another to generate fixes—so each prompt can specialize',
          },
          {
            letter: 'C',
            text: 'Make the existing instructions even more granular, spelling out every required field (location, issue type, severity, remediation) in the prompt',
          },
          {
            letter: 'D',
            text: 'Increase the amount of surrounding source code in context so Claude has enough information to suggest concrete fixes',
          },
        ],
        correct: 'A',
        explanation:
          'Few-shot examples are the most reliable way to lock in a consistent output format when instructions alone produce variable quality. Concrete examples give the model an unambiguous pattern to replicate, which outperforms increasingly detailed but still abstract written rules.',
        wrongExplanations: {
          C: 'The scenario states that detailed instructions already failed to produce consistent output. Adding even more granular instructions repeats the same approach with diminishing returns—abstract rules are inherently less reliable than concrete examples for format consistency.',
        },
        studyArea:
          'Claude Code for Continuous Integration — review Few-Shot Prompting concepts in the exam study guide.',
        studyAreaLink: '/domains/d4#task-4.2',
      },
      {
        id: 10,
        text: 'Your team uses Claude Code to refactor modules, but a recurring problem appears: subtle regressions—renamed internal APIs that break downstream callers, removed fallbacks that matter in production—are only caught when a different engineer reviews the PR. Claude\'s extended thinking trace shows it evaluated those risks and decided its changes were safe. How do you directly address this self-review blind spot?',
        options: [
          {
            letter: 'A',
            text: 'Run a separate, independent Claude Code instance to review the diff without access to the refactoring session\'s reasoning.',
          },
          {
            letter: 'B',
            text: 'Feed the full test suite and API docs into the refactoring prompt so Claude has better context during generation.',
          },
          {
            letter: 'C',
            text: 'Turn on extended thinking with a higher budget so Claude deliberates longer before finalizing changes.',
          },
          {
            letter: 'D',
            text: 'Add a self-review instruction telling Claude to challenge its own refactoring decisions before outputting the final diff.',
          },
        ],
        correct: 'A',
        explanation:
          'A second, independent Claude instance reviewing the diff without the original reasoning eliminates confirmation bias—the root cause. Just like a fresh human reviewer, it evaluates the changes on their own merits rather than inheriting the original session\'s rationalization.',
        wrongExplanations: {
          D: 'Self-review within the same context cannot overcome confirmation bias. The scenario explicitly shows Claude already evaluated these risks and concluded its approach was correct; asking it to self-critique in the same session will likely reproduce the same conclusions.',
        },
        studyArea:
          'Claude Code for Continuous Integration — review Multi-Instance Verification concepts in the exam study guide.',
        studyAreaLink: '/domains/d4#task-4.6',
      },
      {
        id: 11,
        text: 'Your review pipeline averages 18 findings per PR with a 35% false positive rate. The main pain point is triage time: developers must expand each collapsed finding to read Claude\'s rationale before deciding to act or dismiss. Your CLAUDE.md already covers acceptable coding patterns thoroughly, and management has ruled out any approach that hides findings from developers. What change best reduces the triage burden?',
        options: [
          {
            letter: 'A',
            text: 'Have Claude embed its reasoning summary and a confidence level directly in each finding so developers can triage at a glance',
          },
          {
            letter: 'B',
            text: 'Build a post-processor that learns from historical dismissals and auto-suppresses findings matching past false positive signatures',
          },
          {
            letter: 'C',
            text: 'Set a confidence threshold so only high-confidence findings reach developers, suppressing uncertain ones automatically',
          },
          {
            letter: 'D',
            text: 'Group findings into "must-fix" and "optional" buckets with different review expectations',
          },
        ],
        correct: 'A',
        explanation:
          'Surfacing reasoning and confidence inline lets developers evaluate each finding instantly without expanding it. All findings remain visible (satisfying the no-filtering constraint), but triage becomes dramatically faster because the rationale is immediately available.',
        wrongExplanations: {
          D: 'Bucketing findings into priority tiers reorganizes the list but does not reduce per-finding investigation time. Developers still need to read Claude\'s reasoning for each item to decide whether to act, so the core bottleneck remains.',
        },
        studyArea:
          'Claude Code for Continuous Integration — review False Positive Reduction concepts in the exam study guide.',
        studyAreaLink: '/domains/d4#task-4.2',
      },
      {
        id: 12,
        text: 'Your review system assigns inconsistent priority labels—equivalent issues like unvalidated user input get "high" in one PR and "low" in another. Teams cannot tell which findings demand immediate attention. How do you most effectively improve labeling consistency?',
        options: [
          {
            letter: 'A',
            text: 'Ask Claude to explain its priority reasoning for each finding, then have a human reviewer adjust labels based on that reasoning',
          },
          {
            letter: 'B',
            text: 'Provide explicit priority definitions in the prompt with concrete code snippets illustrating each level',
          },
          {
            letter: 'C',
            text: 'Instruct Claude to rank findings relative to each other within the same PR so the worst issue always gets the highest priority',
          },
          {
            letter: 'D',
            text: 'Create a lookup table in CLAUDE.md mapping each issue category to a fixed priority and instruct Claude to use it',
          },
        ],
        correct: 'B',
        explanation:
          'Explicit priority definitions paired with concrete code examples remove the ambiguity that causes inconsistency. This gives the model clear, repeatable reference points for each level, producing more predictable classifications.',
        wrongExplanations: {
          D: 'A fixed category-to-priority lookup ignores context: the same issue type can be critical or minor depending on the code path and exposure. This rigid mapping oversimplifies the problem and can produce inaccurate labels.',
        },
        studyArea:
          'Claude Code for Continuous Integration — review Classification Consistency concepts in the exam study guide.',
        studyAreaLink: '/domains/d4#task-4.2',
      },
      {
        id: 13,
        text: 'Your review pipeline runs on every push to a PR. After the first run surfaces 10 findings, the developer pushes fixes. The second run reports 7 findings, but 4 of them repeat comments on code the developer already corrected. How do you eliminate this redundant feedback without reducing review thoroughness?',
        options: [
          {
            letter: 'A',
            text: 'Feed the previous run\'s findings into the new prompt and instruct Claude to report only new or still-open issues.',
          },
          {
            letter: 'B',
            text: 'Add a deduplication filter that drops any finding whose file path and description match a previous comment.',
          },
          {
            letter: 'C',
            text: 'Limit the review scope to only files changed in the latest push, ignoring files from earlier commits.',
          },
          {
            letter: 'D',
            text: 'Only run reviews on the first push and the final pre-merge state, skipping intermediate pushes.',
          },
        ],
        correct: 'A',
        explanation:
          'Including prior findings in context lets Claude intelligently distinguish fixed issues from persisting ones, maintaining full analysis depth while eliminating redundant comments on already-resolved code.',
      },
      {
        id: 14,
        text: 'Your team pays for real-time Claude calls across two workflows: (1) a required status check that blocks merging until it passes, and (2) a code-quality trends report generated each night for the Monday morning standup. A lead suggests moving both to the Message Batches API to save 50%. What is the right call?',
        options: [
          {
            letter: 'A',
            text: 'Move both workflows to batch processing and poll for results in each.',
          },
          {
            letter: 'B',
            text: 'Move both to batch processing but fall back to real-time calls if a batch exceeds a timeout.',
          },
          {
            letter: 'C',
            text: 'Keep real-time calls for both to ensure consistent behavior.',
          },
          {
            letter: 'D',
            text: 'Move only the nightly trends report to batch processing; keep the required status check on real-time calls.',
          },
        ],
        correct: 'D',
        explanation:
          'The batch API can take up to 24 hours with no latency guarantee, which is fine for a nightly report no one reads until morning but unacceptable for a status check that blocks developers from merging. Matching each workflow to the API that fits its latency needs is the correct strategy.',
      },
      {
        id: 15,
        text: 'A PR touches 16 files across the order-processing module. A single-pass review of all files together yields uneven results: thorough feedback on some files, shallow comments on others, missed bugs, and contradictory advice—calling a pattern dangerous in one file while endorsing the same pattern elsewhere. How should you restructure the review?',
        options: [
          {
            letter: 'A',
            text: 'Break the review into per-file passes for local issues, then add a separate cross-file pass that examines data flow and integration concerns.',
          },
          {
            letter: 'B',
            text: 'Run three independent full-PR reviews and surface only findings that appear in at least two of the three.',
          },
          {
            letter: 'C',
            text: 'Require developers to submit PRs of no more than 4 files so the single-pass review stays within its effective range.',
          },
          {
            letter: 'D',
            text: 'Upgrade to a larger model with a bigger context window so all 16 files receive adequate attention in one pass.',
          },
        ],
        correct: 'A',
        explanation:
          'Per-file passes eliminate attention dilution, ensuring each file gets consistent, thorough analysis. A dedicated cross-file pass then catches integration issues like data-flow dependencies, covering both local and systemic review quality.',
      },
    ],
  },
  {
    id: 's2',
    title: 'Customer Support Resolution Agent',
    shortTitle: 'Support Agent',
    context:
      'You are developing a customer support agent using the Claude Agent SDK. The agent resolves high-ambiguity requests such as returns, billing disputes, and account issues. It connects to backend systems through MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your goal is 80%+ first-contact resolution with appropriate escalation.',
    color: '#1E728C',
    questions: [
      {
        id: 1,
        text: 'You are developing a customer support agent using the Claude Agent SDK. The agent resolves high-ambiguity requests such as returns, billing disputes, and account issues. It connects to backend systems through MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your goal is 80%+ first-contact resolution with appropriate escalation.\n\nDuring evaluation, you observe that the agent consistently invokes lookup_order when customers ask billing-related questions, even though get_customer would provide the relevant billing profile data. What is the most important thing to investigate first?',
        options: [
          {
            letter: 'A',
            text: 'Create a comprehensive mapping of query keywords to tool names and inject it into the system prompt as a routing table',
          },
          {
            letter: 'B',
            text: 'Examine the tool descriptions to verify they clearly communicate each tool\'s intended use case and scope',
          },
          {
            letter: 'C',
            text: 'Build a middleware classifier that intercepts billing queries and programmatically redirects them to get_customer',
          },
          {
            letter: 'D',
            text: 'Remove lookup_order from the tool set for billing-related conversations to eliminate the incorrect option',
          },
        ],
        correct: 'B',
        explanation:
          'Tool descriptions are the primary signal the model relies on when deciding which tool to invoke. When the agent persistently selects the wrong tool, the first step is to verify that each tool\'s description clearly communicates its purpose, expected inputs, and when it should be chosen over alternatives.',
        wrongExplanations: {
          C: 'Introducing a middleware classifier to intercept and reroute queries is an over-engineered workaround that bypasses the agent\'s built-in tool selection capability rather than fixing the root cause in the tool definitions.',
        },
        studyArea:
          'Customer Support Resolution Agent — review Tool Selection Reliability concepts in the exam study guide.',
        studyAreaLink: '/domains/d2#task-2.1',
      },
      {
        id: 2,
        text: 'Monitoring reveals that in 12% of interactions, your agent bypasses get_customer and immediately calls process_refund using only the customer\'s self-reported email address, occasionally issuing refunds to the wrong account. What is the most reliable way to prevent this?',
        options: [
          {
            letter: 'A',
            text: 'Strengthen the system prompt with bold instructions that customer identity must always be confirmed via get_customer before any financial operations.',
          },
          {
            letter: 'B',
            text: 'Deploy a request analyzer that detects refund intent and dynamically restricts the available tool set to only get_customer until verification is complete.',
          },
          {
            letter: 'C',
            text: 'Implement a programmatic gate that prevents process_refund and lookup_order from executing until get_customer has returned a verified customer ID.',
          },
          {
            letter: 'D',
            text: 'Include few-shot examples in the prompt where the agent always performs identity verification first, even when customers provide seemingly complete information.',
          },
        ],
        correct: 'C',
        explanation:
          'A programmatic gate that blocks downstream tools until get_customer returns a verified customer ID provides a deterministic enforcement mechanism. Unlike prompt-based approaches, it eliminates the possibility of the agent circumventing the verification step, regardless of how the LLM interprets instructions.',
      },
      {
        id: 3,
        text: 'Your agent resolves individual issues at 94% accuracy (e.g., "Where is my order #7890?"). But when customers raise multiple topics in a single message (e.g., "I want a refund for order #7890 and I also need to change the email on my account"), accuracy drops to 58%. The agent tends to address only one topic or confuse parameters between the two. What is the most effective way to improve performance on these compound requests?',
        options: [
          {
            letter: 'A',
            text: 'Add a preprocessing step that uses a separate API call to split compound messages into individual requests, handles each one independently, and merges the outputs.',
          },
          {
            letter: 'B',
            text: 'Merge related tools into a single multi-purpose tool that can handle multiple operations in one invocation.',
          },
          {
            letter: 'C',
            text: 'Include few-shot examples in the system prompt that demonstrate the correct reasoning chain and tool sequence when a customer raises multiple topics at once.',
          },
          {
            letter: 'D',
            text: 'Add a post-response validator that checks whether all mentioned topics were addressed and automatically re-invokes the agent for any that were missed.',
          },
        ],
        correct: 'C',
        explanation:
          'Few-shot examples showing how to reason through and correctly sequence tools for compound requests directly address the gap. Since the agent already handles individual concerns at 94% accuracy, it has the underlying capability; it just needs pattern guidance for decomposing and routing parameters across multiple concerns within a single message.',
        wrongExplanations: {
          A: 'Routing compound messages through a separate model call for decomposition introduces unnecessary latency, cost, and architectural complexity. The agent already understands individual concerns well; prompt-level examples can bridge the gap far more efficiently.',
        },
        studyArea:
          'Customer Support Resolution Agent — review Tool Selection Reliability concepts in the exam study guide.',
        studyAreaLink: '/domains/d2#task-2.1',
      },
      {
        id: 4,
        text: 'For straightforward requests like "cancel order #4455," your agent resolves issues in 3-4 tool calls with a 91% success rate. However, for multi-faceted requests like "I was overcharged, my coupon wasn\'t applied, and I need to return one of the items," the agent takes 14+ tool calls with only 51% resolution. Logs show it tackles each concern one at a time, re-fetching the same customer and order data for every concern. What change would most effectively improve handling of these complex requests?',
        options: [
          {
            letter: 'A',
            text: 'Insert mandatory approval gates after each concern is resolved, requiring the agent to confirm progress before moving to the next one.',
          },
          {
            letter: 'B',
            text: 'Combine get_customer, lookup_order, and billing tools into a single comprehensive investigate_case tool to reduce the number of separate calls.',
          },
          {
            letter: 'C',
            text: 'Instruct the agent to identify all distinct concerns upfront, gather shared context once, then investigate each concern in parallel before composing a unified response.',
          },
          {
            letter: 'D',
            text: 'Provide few-shot examples in the system prompt illustrating optimal tool call sequences for common multi-part billing and return scenarios.',
          },
        ],
        correct: 'C',
        explanation:
          'Having the agent identify all concerns upfront, gather shared context once, and investigate each in parallel directly solves both problems: it eliminates redundant data retrieval by reusing customer and order context, and it reduces total tool calls by parallelizing the investigations before producing a single cohesive resolution.',
        wrongExplanations: {
          A: 'Mandatory approval gates between sequential steps would reinforce the serial processing pattern and add even more overhead per concern, worsening rather than improving the redundant data-fetching problem.',
        },
        studyArea:
          'Customer Support Resolution Agent — review Multi-step Workflow Orchestration concepts in the exam study guide.',
        studyAreaLink: '/domains/d1#task-1.2',
      },
      {
        id: 5,
        text: 'Latency analysis reveals your agent averages 5+ API round-trips per resolution. Trace logs show that Claude consistently issues get_customer and lookup_order as separate sequential turns, even in cases where both are clearly needed from the initial message. What is the most effective way to reduce these unnecessary round-trips?',
        options: [
          {
            letter: 'A',
            text: 'Raise max_tokens substantially so Claude has more output space to plan ahead and naturally issue multiple tool requests.',
          },
          {
            letter: 'B',
            text: 'Build a speculative execution layer that automatically fires likely-needed tools in parallel with any explicitly requested tool, returning all results together.',
          },
          {
            letter: 'C',
            text: 'Add instructions in the prompt for Claude to issue all needed tool requests in a single turn, and return all tool results together before making the next API call.',
          },
          {
            letter: 'D',
            text: 'Design composite tools such as get_customer_and_order that combine frequent lookup pairs into single calls.',
          },
        ],
        correct: 'C',
        explanation:
          'Instructing Claude to batch related tool requests in a single turn and returning all results together leverages Claude\'s native ability to request multiple tools simultaneously. This directly addresses the sequential calling pattern with minimal changes to the system architecture.',
      },
      {
        id: 6,
        text: 'Trace analysis uncovers a puzzling pattern: when customers use the word "billing" in their messages (e.g., "I have a billing question about my last delivery"), the agent calls get_customer first 81% of the time. When customers phrase equivalent requests without "billing" (e.g., "I have a question about the charge for my last delivery"), it calls lookup_order first 90% of the time. The tool descriptions are precise and clearly scoped. What is the most likely explanation for this behavior?',
        options: [
          {
            letter: 'A',
            text: 'The tool descriptions should include explicit "do not use when" clauses to counteract the keyword-driven bias the model has learned',
          },
          {
            letter: 'B',
            text: 'The system prompt includes phrasing that inadvertently associates terms like "billing" with customer-level operations, creating keyword-driven tool selection bias',
          },
          {
            letter: 'C',
            text: 'Claude\'s pre-training data contains strong associations between "billing" and customer account operations that override well-crafted tool descriptions',
          },
          {
            letter: 'D',
            text: 'The model needs fine-tuning on domain-specific examples to override its default associations between billing terminology and customer lookup tools',
          },
        ],
        correct: 'B',
        explanation:
          'The systematic keyword-dependent split (81% vs 90%) points to explicit instructions in the system prompt that react to the word "billing" and steer the agent toward customer-related tools. Since the tool descriptions are already precise and well-scoped, the discrepancy most likely originates from upstream prompt instructions creating unintended behavioral patterns.',
        wrongExplanations: {
          A: 'Adding "do not use when" clauses to tool descriptions contradicts the premise that the descriptions are already precise and clearly scoped. The problem lies in system prompt instructions that override correct tool selection, not in the tool definitions themselves.',
        },
        studyArea:
          'Customer Support Resolution Agent — review Tool Selection Reliability concepts in the exam study guide.',
        studyAreaLink: '/domains/d2#task-2.1',
      },
      {
        id: 7,
        text: 'You are building the core agentic loop for the support agent. After each Claude API response, your code must decide whether to execute the requested tools and loop back, or to deliver the final message to the customer. What is the correct mechanism for making this decision?',
        options: [
          {
            letter: 'A',
            text: 'Scan Claude\'s response text for closing phrases such as "Let me know if you need anything else" to detect when the conversation is complete.',
          },
          {
            letter: 'B',
            text: 'Enforce a hard ceiling on iterations (e.g., 8 turns) and terminate the loop when the count is reached, regardless of task state.',
          },
          {
            letter: 'C',
            text: 'Inspect the stop_reason field in the API response: continue looping when it is "tool_use" and terminate when it is "end_turn".',
          },
          {
            letter: 'D',
            text: 'Check whether the response contains a text content block with more than a certain number of characters, and treat lengthy text as a signal that the agent is finished.',
          },
        ],
        correct: 'C',
        explanation:
          'The stop_reason field is Claude\'s structured, unambiguous signal for agentic loop control. A value of "tool_use" means Claude is requesting tool execution and expects results back, while "end_turn" means Claude has finished its response and the loop should end.',
      },
      {
        id: 8,
        text: 'Evaluation logs indicate that for ambiguous messages like "I need to sort out something with a recent purchase," the agent often picks get_customer when lookup_order would be more appropriate. You want to add few-shot examples to your system prompt to sharpen tool selection for these edge cases. Which strategy will be most effective?',
        options: [
          {
            letter: 'A',
            text: 'Provide 12-15 straightforward examples that cover each tool\'s most common and unambiguous use cases to build a strong baseline.',
          },
          {
            letter: 'B',
            text: 'Organize examples by tool category—group all get_customer examples first, then all lookup_order examples—so the model can learn each tool\'s profile.',
          },
          {
            letter: 'C',
            text: 'Expand each tool\'s description with explicit "prefer when" and "avoid when" rules that cover the ambiguous scenarios.',
          },
          {
            letter: 'D',
            text: 'Provide 4-6 examples focused specifically on ambiguous cases, each including a reasoning chain that explains why one tool was selected over the other plausible option.',
          },
        ],
        correct: 'D',
        explanation:
          'A small set of examples targeting the specific ambiguous scenarios where mistakes occur, each with explicit reasoning about why one tool is chosen over the alternative, teaches the model the comparative decision process it needs for edge cases. Worked examples with reasoning outperform declarative rules for nuanced tool selection.',
        wrongExplanations: {
          C: 'Static "prefer when" and "avoid when" rules in tool descriptions are less effective than worked examples for teaching nuanced decision-making. The model gains more from observing the actual reasoning process in context than from reading abstract conditional rules.',
        },
        studyArea:
          'Customer Support Resolution Agent — review Tool Selection Reliability concepts in the exam study guide.',
        studyAreaLink: '/domains/d2#task-2.1',
      },
      {
        id: 9,
        text: 'Your agent struggles with inconsistent data formats returned by MCP tools: get_customer returns dates as epoch milliseconds, lookup_order returns them as "MM/DD/YYYY" strings, and status fields come back as numeric codes (0=open, 1=resolved, 2=escalated). Several of these tools are third-party MCP servers whose output format you cannot change. What is the most maintainable solution for normalizing these outputs?',
        options: [
          {
            letter: 'A',
            text: 'Register a PostToolUse hook that intercepts each tool\'s output and applies deterministic format transformations before the agent processes the results',
          },
          {
            letter: 'B',
            text: 'Define a convert_formats tool that the agent invokes after every data retrieval to translate raw values into a standard schema',
          },
          {
            letter: 'C',
            text: 'Rewrite the tools you own to emit standardized formats and build thin wrapper tools around the third-party servers',
          },
          {
            letter: 'D',
            text: 'Document every tool\'s data conventions in the system prompt and instruct the agent to mentally convert values during reasoning',
          },
        ],
        correct: 'A',
        explanation:
          'A PostToolUse hook provides a single, deterministic interception point that normalizes all tool outputs—including those from third-party MCP servers—before the agent sees them. This is the most maintainable approach because transformations happen in code, uniformly across all tools, without depending on LLM interpretation or additional tool calls.',
        wrongExplanations: {
          C: 'Rewriting owned tools while wrapping third-party tools creates two parallel normalization strategies, increasing maintenance burden and making it harder to guarantee consistent formatting across the entire tool set.',
        },
        studyArea:
          'Customer Support Resolution Agent — review Agent SDK Hook Patterns concepts in the exam study guide.',
        studyAreaLink: '/domains/d1#task-1.5',
      },
      {
        id: 10,
        text: 'Your agent uses a sliding-window summarization strategy: once the conversation exceeds 75% of the context limit, earlier turns are condensed into summaries while recent turns remain intact. A recurring complaint from customers is that the agent forgets specific figures they mentioned earlier. For example, a customer says "the $42.50 adjustment you promised" but the agent can\'t locate that amount because it was compressed into "discussed a billing adjustment" fifteen turns prior. What is the best way to solve this?',
        options: [
          {
            letter: 'A',
            text: 'Maintain a complete conversation transcript in an external database and query it whenever the agent detects a back-reference like "you promised" or "as we discussed."',
          },
          {
            letter: 'B',
            text: 'Raise the summarization threshold from 75% to 90% so more of the conversation stays verbatim before compression kicks in.',
          },
          {
            letter: 'C',
            text: 'Rewrite the summarization prompt to require that all dollar amounts, dates, order numbers, and explicit commitments are preserved word-for-word in every summary.',
          },
          {
            letter: 'D',
            text: 'Maintain a structured "case facts" block—containing amounts, dates, identifiers, and commitments—that is populated as the conversation progresses and included in every prompt outside the summarized history.',
          },
        ],
        correct: 'D',
        explanation:
          'A persistent "case facts" block that lives outside the summarized history ensures critical transactional details remain reliably available in every prompt, regardless of how aggressively earlier turns are compressed. This addresses the root cause: summarization is inherently lossy for precise numerical details and commitments.',
      },
      {
        id: 11,
        text: 'When a customer provides only their name, get_customer sometimes returns two or three matching profiles. The agent currently selects the profile whose email domain matches the company\'s most common customer domain, but this heuristic leads to incorrect account selection in 18% of multi-match cases. How should you handle this?',
        options: [
          {
            letter: 'A',
            text: 'Add few-shot examples training Claude to use subtle contextual clues (mentioned products, shipping city) to infer which profile is correct without asking the customer.',
          },
          {
            letter: 'B',
            text: 'Change get_customer to apply a scoring algorithm and return only the single highest-confidence match, eliminating the ambiguity entirely.',
          },
          {
            letter: 'C',
            text: 'Build a confidence model that auto-selects when match probability exceeds 90% and prompts for clarification otherwise.',
          },
          {
            letter: 'D',
            text: 'Instruct the agent to ask the customer for a disambiguating detail such as their email address, phone number, or order number whenever get_customer returns more than one match.',
          },
        ],
        correct: 'D',
        explanation:
          'Asking the customer for a disambiguating identifier is the most reliable resolution because the customer has definitive knowledge of their own identity. A single additional conversational turn is a small cost to eliminate the 18% error rate caused by heuristic-based guessing among multiple matches.',
      },
      {
        id: 12,
        text: 'Your agent repeatedly invokes lookup_order when customers inquire about their account settings (e.g., "how do I update my payment method?"), instead of calling get_customer. Both tools have bare-minimum descriptions ("Looks up order information" / "Fetches customer data") and accept overlapping identifier inputs. What is the highest-leverage first step to fix this?',
        options: [
          {
            letter: 'A',
            text: 'Enrich each tool\'s description with the input formats it accepts, representative query examples, boundary conditions, and guidance on when to choose it over similar tools.',
          },
          {
            letter: 'B',
            text: 'Add 6-8 few-shot examples in the system prompt showing account-related queries correctly routed to get_customer.',
          },
          {
            letter: 'C',
            text: 'Merge both tools into a single unified_lookup tool that internally routes to the correct backend based on the identifier type.',
          },
          {
            letter: 'D',
            text: 'Add a pre-processing layer that parses the user\'s message for keywords and identifier patterns and pre-selects the appropriate tool before the agent runs.',
          },
        ],
        correct: 'A',
        explanation:
          'Expanding tool descriptions with input formats, representative queries, edge cases, and decision boundaries directly addresses the root cause: minimal descriptions that give the LLM insufficient information to distinguish between similar tools. This is a low-effort, high-impact first step that improves the primary mechanism through which LLMs decide which tool to call.',
      },
      {
        id: 13,
        text: 'Your agent\'s technical resolutions for complex cases—multi-item returns, disputed charges, promotional pricing issues—are accurate, yet customer satisfaction for these cases trails simple-case satisfaction by 18%. Investigation shows the agent resolves the issue correctly but inconsistently communicates the details: sometimes it omits the relevant policy, other times it leaves out expected timelines or follow-up actions. The specific missing element varies case by case. You need to improve response quality without adding human oversight. What approach is most effective?',
        options: [
          {
            letter: 'A',
            text: 'Upgrade from a smaller model to a larger model for flagged complex cases, routing based on a complexity classifier.',
          },
          {
            letter: 'B',
            text: 'Add a final step where the agent asks the customer "Is there anything else you\'d like to know?" before closing the ticket, giving them a chance to request missing details.',
          },
          {
            letter: 'C',
            text: 'Introduce a self-evaluation step where the agent reviews its draft response against completeness criteria—relevant policy, timelines, next steps—and revises before sending.',
          },
          {
            letter: 'D',
            text: 'Create few-shot examples in the system prompt demonstrating fully detailed resolution messages for five frequent complex case types, covering policy context, timelines, and follow-up actions.',
          },
        ],
        correct: 'C',
        explanation:
          'A self-evaluation step (evaluator-optimizer pattern) directly addresses the inconsistent completeness by having the agent check its own draft against explicit criteria before delivering it. Because the specific gaps vary from case to case, a dynamic self-critique catches omissions that static templates or examples cannot anticipate.',
        wrongExplanations: {
          D: 'Few-shot examples can demonstrate ideal structure for common case types, but they cannot cover the wide variety of context-specific gaps that differ across cases. This approach is better suited for predictable, repeatable patterns than for the diverse omissions described here.',
        },
        studyArea:
          'Customer Support Resolution Agent — review Self-Evaluation Patterns concepts in the exam study guide.',
        studyAreaLink: '/domains/d4#task-4.6',
      },
      {
        id: 14,
        text: 'Your agent\'s first-contact resolution rate is 52%, far below the 80% target. Log analysis shows it escalates routine cases—like standard warranty replacements where the customer has already provided a receipt photo—while attempting to autonomously resolve situations that require manager-level policy exceptions. What is the most effective way to correct this escalation calibration?',
        options: [
          {
            letter: 'A',
            text: 'Have the agent output a confidence score before each action and automatically escalate when confidence drops below a set threshold.',
          },
          {
            letter: 'B',
            text: 'Train a separate classification model on historical ticket data to predict escalation need before the main agent begins processing.',
          },
          {
            letter: 'C',
            text: 'Define explicit escalation criteria in the system prompt accompanied by few-shot examples that illustrate the boundary between self-resolvable and escalation-worthy cases.',
          },
          {
            letter: 'D',
            text: 'Integrate real-time sentiment detection and escalate automatically when customer frustration exceeds a defined level.',
          },
        ],
        correct: 'C',
        explanation:
          'Explicit escalation criteria with few-shot examples directly address the core problem: the agent lacks clear decision boundaries between cases it should handle and cases it should escalate. This is the most proportionate and effective first intervention, requiring no additional infrastructure while teaching the agent precisely where the line is.',
      },
      {
        id: 15,
        text: 'The agent has already retrieved all relevant data via get_customer and lookup_order. It now faces a situation that requires judgment. Which of the following scenarios represents the most appropriate reason to invoke escalate_to_human?',
        options: [
          {
            letter: 'A',
            text: 'The customer insists they returned an item, but the warehouse scan log shows no inbound package. The agent should escalate because sharing conflicting evidence could upset the customer.',
          },
          {
            letter: 'B',
            text: 'The customer asks about both a shipping delay and a promo code issue. The agent should escalate because handling two separate concerns in one session requires human coordination.',
          },
          {
            letter: 'C',
            text: 'The customer asks for a loyalty-tier upgrade based on lifetime spend. Company policies define tier thresholds for new customers but say nothing about manual upgrades for existing accounts. The agent should escalate because the policy has a gap.',
          },
          {
            letter: 'D',
            text: 'The customer wants to cancel a subscription that renews tomorrow. The agent should escalate because the customer might regret the cancellation after the renewal date passes.',
          },
        ],
        correct: 'C',
        explanation:
          'This is a genuine policy gap: the company\'s rules cover tier thresholds for new customers but are entirely silent on manual upgrades for existing accounts. The agent cannot invent policy, so escalation for human judgment on how to interpret or extend the existing rules is the correct action.',
        wrongExplanations: {
          A: 'Although the situation involves contradictory information, the agent has factual warehouse data it can share with the customer following standard procedures. Escalating to avoid a potentially uncomfortable conversation reflects emotional avoidance, not a genuine operational need for human intervention.',
        },
        studyArea:
          'Customer Support Resolution Agent — review Escalation Decisions concepts in the exam study guide.',
        studyAreaLink: '/domains/d1#task-1.4',
      },
    ],
  },
  {
    id: 's3',
    title: 'Code Generation with Claude Code',
    shortTitle: 'Code Generation',
    context:
      'You are using Claude Code to accelerate software development. Your team relies on it for code generation, refactoring, debugging, and documentation. You need to configure it effectively with custom slash commands, CLAUDE.md settings, and choose between plan mode and direct execution appropriately.',
    color: '#2d308d',
    questions: [
      {
        id: 1,
        text: 'Your team wants to migrate a legacy Django application from a single shared database to a multi-tenant architecture with per-tenant schemas. This requires coordinated changes to the ORM layer, middleware, routing, and tenant provisioning logic spanning over 80 files. How should you begin this task with Claude Code?',
        options: [
          {
            letter: 'A',
            text: 'Use direct execution with a detailed prompt specifying every schema change, middleware update, and routing modification needed upfront.',
          },
          {
            letter: 'B',
            text: 'Start with direct execution on the ORM layer first, then iterate file-by-file through middleware and routing as patterns emerge.',
          },
          {
            letter: 'C',
            text: 'Use direct execution and switch to plan mode only if Claude produces incorrect changes or encounters conflicts between modules.',
          },
          {
            letter: 'D',
            text: 'Use plan mode to map out the existing data access patterns, identify cross-cutting dependencies, and propose a migration strategy before touching any files.',
          },
        ],
        correct: 'D',
        explanation:
          'Plan mode is the right choice for a complex architectural migration like moving to multi-tenancy. It allows Claude to safely explore the codebase, understand how data access patterns are interconnected across the ORM, middleware, and routing layers, and design a coherent strategy before making potentially breaking changes across 80+ files.',
      },
      {
        id: 2,
        text: 'Your monorepo contains a Go backend using strict error wrapping conventions, a Vue frontend with Composition API patterns, and a Python ML pipeline following NumPy-style docstrings. Integration tests live in a top-level /tests directory alongside both backend and frontend fixtures, and you want consistent test conventions regardless of which subdirectory a test originates from. What is the most maintainable way to ensure Claude applies the right conventions automatically?',
        options: [
          {
            letter: 'A',
            text: 'Write a comprehensive root CLAUDE.md with labeled sections for each language and trust Claude to select the appropriate section based on the file being edited',
          },
          {
            letter: 'B',
            text: 'Place a CLAUDE.md inside each subdirectory (backend/, frontend/, ml-pipeline/) containing that subdirectory\'s specific conventions',
          },
          {
            letter: 'C',
            text: 'Build skills in .claude/skills/ for each language that describe the relevant patterns and invoke them manually when switching contexts',
          },
          {
            letter: 'D',
            text: 'Use .claude/rules/ files with YAML frontmatter containing glob patterns (e.g., **/*.go, **/*.vue, tests/**/*) to activate the correct conventions based on file paths',
          },
        ],
        correct: 'D',
        explanation:
          'Rule files in `.claude/rules/` with YAML frontmatter and glob patterns (e.g., `**/*.go`, `**/*.vue`, `tests/**/*`) deterministically apply the correct conventions based on file paths. This handles cross-cutting concerns like the shared /tests directory elegantly without requiring per-directory files or manual intervention, making it the most maintainable option.',
      },
      {
        id: 3,
        text: 'Your team built a /security-audit skill that scans the repository for vulnerable dependencies, checks configuration files for exposed secrets, and validates authentication flows. Developers complain that after running the audit, Claude struggles to recall what they were working on before and sometimes hallucinates findings from the audit in unrelated follow-up responses. How do you fix this without reducing the audit\'s thoroughness?',
        options: [
          {
            letter: 'A',
            text: 'Instruct the skill to output only a pass/fail summary with no detailed findings unless explicitly requested',
          },
          {
            letter: 'B',
            text: 'Break the audit into three separate skills (dependencies, secrets, auth) so each produces less output individually',
          },
          {
            letter: 'C',
            text: 'Add context: fork to the skill\'s frontmatter so the audit runs in an isolated sub-agent that does not fill the main conversation\'s context',
          },
          {
            letter: 'D',
            text: 'Add max-tokens: 2000 to the frontmatter to cap the amount of output the skill can generate',
          },
        ],
        correct: 'C',
        explanation:
          'Adding `context: fork` to the skill\'s frontmatter runs the security audit in an isolated sub-agent context. The verbose scan output stays separate from the main conversation, preventing it from crowding out the developer\'s prior working context and stopping audit findings from leaking into unrelated responses.',
      },
      {
        id: 4,
        text: 'Your eight-person team wants to connect Claude Code to a private Jira MCP server so developers can look up tickets, update statuses, and log time directly from their editor. Each developer authenticates to Jira with an individual API token. You need every team member to have the same tooling out of the box without storing secrets in the repository. What is the best configuration strategy?',
        options: [
          {
            letter: 'A',
            text: 'Build a lightweight proxy service that reads Jira tokens from a shared vault and add the proxy as the MCP server in your project .mcp.json.',
          },
          {
            letter: 'B',
            text: 'Define the Jira server in the project .mcp.json with a dummy token value and tell developers to override it in their user-scope .mcp.json.',
          },
          {
            letter: 'C',
            text: 'Have each developer add the Jira server individually using claude mcp add --scope user so it appears in their personal configuration.',
          },
          {
            letter: 'D',
            text: 'Add the Jira server to the project .mcp.json using environment variable expansion (${JIRA_API_TOKEN}) for authentication and document the required variable in the project setup guide.',
          },
        ],
        correct: 'D',
        explanation:
          'A project-scoped `.mcp.json` with environment variable expansion (`${JIRA_API_TOKEN}`) gives every developer identical, version-controlled MCP configuration while letting each person supply their own credentials through a local environment variable. Documenting the variable in the setup guide ensures smooth onboarding without committing secrets.',
        wrongExplanations: {
          B: 'Placing a dummy token value in version control is a bad practice that can be mistaken for a real credential by automated scanners and relies on developers remembering to override it locally. This fragile two-step process is unnecessary when native environment variable expansion solves the problem cleanly.',
        },
        studyArea:
          'Code Generation with Claude Code — review MCP Server Integration concepts in the exam study guide.',
        studyAreaLink: '/domains/d2#task-2.4',
      },
      {
        id: 5,
        text: 'You asked Claude Code to write a data pipeline step that converts raw CSV rows into structured event objects. After two attempts, the output objects still have incorrect date parsing and the nested metadata fields are in the wrong shape. Your prompts have been written in natural language paragraphs, but Claude keeps interpreting the nesting and date format rules differently. What is the best way to resolve this on the next try?',
        options: [
          {
            letter: 'A',
            text: 'Rewrite the prompt with precise technical language specifying the exact nesting hierarchy, field names, and date format strings.',
          },
          {
            letter: 'B',
            text: 'Include 2-3 concrete before/after examples showing sample CSV rows and the exact event objects they should produce.',
          },
          {
            letter: 'C',
            text: 'Ask Claude to show you how it currently interprets the nesting and date requirements so you can pinpoint the misunderstanding.',
          },
          {
            letter: 'D',
            text: 'Define a TypeScript interface for the event object and have Claude validate its output against the type definition after each attempt.',
          },
        ],
        correct: 'B',
        explanation:
          'Concrete input-output examples remove the ambiguity that prose descriptions inherently carry. By showing Claude exactly what a CSV row should become as an event object, you eliminate misinterpretation of nesting and date formats in one step, which directly addresses the repeated failures caused by differing readings of natural language.',
        wrongExplanations: {
          D: 'A TypeScript interface can verify structural correctness after the fact, but it does not help Claude understand the transformation logic needed to produce the right output. The core problem is comprehension of the mapping rules, not validation of the result.',
        },
        studyArea:
          'Code Generation with Claude Code — review Iterative Refinement concepts in the exam study guide.',
        studyAreaLink: '/domains/d3#task-3.5',
      },
      {
        id: 6,
        text: 'Five developers have used Claude Code on a shared repository for months. They all see Claude consistently enforcing the team\'s "use structured logging with correlation IDs" rule. A sixth developer joins, clones the repo, and finds Claude does not follow this rule at all. Everyone has the same branch checked out. What is the most likely explanation and correct resolution?',
        options: [
          {
            letter: 'A',
            text: 'The original five developers have a stale cached version of the instructions that includes the rule, while the new developer loaded a version where it was removed. Have everyone restart Claude Code to refresh the cache.',
          },
          {
            letter: 'B',
            text: 'The structured-logging rule was placed in each original developer\'s user-level ~/.claude/CLAUDE.md rather than in the project\'s .claude/CLAUDE.md. Move it to the project-level file so it applies for all contributors.',
          },
          {
            letter: 'C',
            text: 'The new developer has a personal ~/.claude/CLAUDE.md that contains conflicting logging preferences which override the project configuration. Have them delete the conflicting section.',
          },
          {
            letter: 'D',
            text: 'Claude Code learns individual coding preferences over time through interaction history. The new developer simply needs to correct Claude a few times until it adapts to the team\'s logging convention.',
          },
        ],
        correct: 'B',
        explanation:
          'The most likely cause is that the logging guideline lives in each existing developer\'s user-level ~/.claude/CLAUDE.md, which is invisible to anyone else. Moving the rule to the project-level .claude/CLAUDE.md ensures every current and future team member receives the instruction automatically upon cloning the repo.',
      },
      {
        id: 7,
        text: 'Your project\'s CLAUDE.md has ballooned to over 350 lines. It contains naming conventions, error handling patterns, a release workflow checklist, a hotfix procedure, and instructions for running load tests. You want Claude to enforce naming and error handling conventions in every session, but only surface the release, hotfix, and load-test guidance when a developer is actually performing those tasks. What restructuring makes the most sense?',
        options: [
          {
            letter: 'A',
            text: 'Keep everything in CLAUDE.md but use @include directives to pull in separate files for each topic so editing is easier',
          },
          {
            letter: 'B',
            text: 'Move all content into individual skills organized by topic, leaving only a one-line project description in CLAUDE.md',
          },
          {
            letter: 'C',
            text: 'Keep naming and error handling conventions in CLAUDE.md, and create on-demand skills for release, hotfix, and load-test workflows with descriptive trigger keywords',
          },
          {
            letter: 'D',
            text: 'Move everything into .claude/rules/ files with glob patterns so rules load only when Claude is editing files that match those patterns',
          },
        ],
        correct: 'C',
        explanation:
          'CLAUDE.md content loads into every conversation, which is appropriate for universal standards like naming and error handling. Skills are invoked on-demand when Claude detects matching trigger keywords, making them ideal for infrequent task-specific workflows like releases, hotfixes, and load testing that would otherwise bloat the always-loaded context.',
      },
      {
        id: 8,
        text: 'The project repository contains a /deploy skill in .claude/skills/deploy/SKILL.md that the whole team uses. One developer prefers an alternative deployment flow that tags the release differently and runs extra smoke tests. They want their custom version without disrupting other team members. What is the correct recommendation?',
        options: [
          {
            letter: 'A',
            text: 'Create a personal skill at ~/.claude/skills/deploy/SKILL.md using the same /deploy name',
          },
          {
            letter: 'B',
            text: 'Add a conditional block in the project skill that checks an environment variable to decide which flow to run',
          },
          {
            letter: 'C',
            text: 'Create a personal skill in ~/.claude/skills/ under a distinct name such as /my-deploy',
          },
          {
            letter: 'D',
            text: 'Add a precedence: personal flag in the personal skill\'s frontmatter to override the project-level version',
          },
        ],
        correct: 'C',
        explanation:
          'Project skills take precedence over personal skills that share the same name. The developer must use a different name (like `/my-deploy`) in their personal `~/.claude/skills/` directory so that both the team\'s standard skill and their custom variant are independently accessible.',
      },
      {
        id: 9,
        text: 'Your team has a /spike skill that lets developers quickly prototype two or three competing approaches to a problem before choosing one. After running the skill, developers notice Claude continues to reference the discarded prototypes in later code generation, sometimes mixing patterns from the rejected approaches into production code. What configuration change best prevents this cross-contamination?',
        options: [
          {
            letter: 'A',
            text: 'Split the skill into /spike-start and /spike-finish, with the finish skill instructing Claude to discard the spike context.',
          },
          {
            letter: 'B',
            text: 'Prefix the skill with ! so it runs as an external bash subprocess instead of within the conversation.',
          },
          {
            letter: 'C',
            text: 'Move the skill from .claude/skills/ to ~/.claude/skills/ so each developer gets an isolated copy.',
          },
          {
            letter: 'D',
            text: 'Add context: fork to the skill\'s frontmatter so the prototyping runs in an isolated sub-agent and its output does not persist in the main conversation.',
          },
        ],
        correct: 'D',
        explanation:
          'The `context: fork` frontmatter option executes the skill in an isolated sub-agent context. All the prototyping discussion and abandoned approaches stay outside the main conversation history, preventing discarded patterns from influencing subsequent production code generation.',
      },
      {
        id: 10,
        text: 'You need to integrate a payment processor into your e-commerce platform. The existing codebase uses Stripe for subscriptions, but the new requirement is to add PayPal as an alternative. PayPal offers three integration paths: Express Checkout (redirect-based, simplest), Braintree SDK (drop-in UI, moderate complexity), and Commerce Platform (full API with dispute management, highest complexity). The product ticket says "add PayPal" with no further specification about which capabilities are needed or whether dispute handling matters. How should you proceed with Claude Code?',
        options: [
          {
            letter: 'A',
            text: 'Use direct execution to scaffold a PayPal module following the same patterns as the existing Stripe integration and pick the integration path later.',
          },
          {
            letter: 'B',
            text: 'Use direct execution with Express Checkout since it\'s the simplest and most similar to Stripe\'s redirect flow.',
          },
          {
            letter: 'C',
            text: 'Use direct execution with the Braintree SDK since its drop-in UI provides a good balance of simplicity and functionality.',
          },
          {
            letter: 'D',
            text: 'Enter plan mode to analyze each integration path\'s trade-offs against the existing Stripe architecture and present a recommendation before writing any code.',
          },
        ],
        correct: 'D',
        explanation:
          'When requirements are ambiguous and multiple valid implementation approaches exist with significantly different architectural consequences, plan mode is the correct choice. It lets Claude explore the trade-offs of each PayPal integration path, compare them against the existing Stripe architecture, and recommend an approach for team alignment before committing to code.',
      },
      {
        id: 11,
        text: 'You have discovered that providing 3-4 complete example resolver implementations as context dramatically improves the quality and consistency of new GraphQL resolvers Claude generates. However, this exemplar context is irrelevant when you are debugging query performance, updating schema types, or writing resolver tests. What is the most efficient way to manage this context?',
        options: [
          {
            letter: 'A',
            text: 'Create a skill that loads the example resolvers and includes pattern-matching instructions, invoked on-demand via a slash command when generating new resolvers.',
          },
          {
            letter: 'B',
            text: 'Set up path-specific rules in .claude/rules/ that activate whenever Claude works in the resolvers/ directory, automatically loading the exemplar code.',
          },
          {
            letter: 'C',
            text: 'Manually paste the relevant resolver examples into the prompt each time you want to generate a new one.',
          },
          {
            letter: 'D',
            text: 'Add the example resolvers directly to CLAUDE.md so they are always available in every conversation.',
          },
        ],
        correct: 'A',
        explanation:
          'An on-demand skill with the exemplar resolvers and pattern instructions is loaded only when explicitly invoked via slash command for new resolver generation. This avoids wasting context on unrelated tasks like debugging, schema changes, or test writing in the same directory.',
        wrongExplanations: {
          B: 'Path-specific rules activate for all work in the resolvers/ directory, which includes debugging, testing, and schema changes where the exemplar context adds no value and unnecessarily consumes context window space.',
        },
        studyArea:
          'Code Generation with Claude Code — review Custom Slash Commands concepts in the exam study guide.',
        studyAreaLink: '/domains/d3#task-3.2',
      },
      {
        id: 12,
        text: 'You want to define a /lint-fix slash command that automatically runs your linter, collects errors, and asks Claude to fix them. This command must be available to every team member as soon as they pull the latest changes. Where should you place the command file?',
        options: [
          {
            letter: 'A',
            text: 'Inside the root CLAUDE.md file as a specially formatted code block',
          },
          {
            letter: 'B',
            text: 'In ~/.claude/commands/ on each developer\'s machine',
          },
          {
            letter: 'C',
            text: 'In a .claude/settings.json file under a "commands" key',
          },
          {
            letter: 'D',
            text: 'In the .claude/commands/ directory within the project repository',
          },
        ],
        correct: 'D',
        explanation:
          'The `.claude/commands/` directory inside the project repository is the designated location for project-scoped custom slash commands. Files placed here are version-controlled and automatically available to every developer who clones or pulls the repo, meeting the requirement for team-wide availability.',
      },
      {
        id: 13,
        text: 'Over time your team\'s CLAUDE.md has accumulated 600 lines spanning React component patterns, GraphQL conventions, accessibility requirements, CI/CD pipeline rules, and infrastructure-as-code guidelines. Finding the right section to update has become painful. What does Claude Code provide for breaking this monolithic file into focused, topic-based modules?',
        options: [
          {
            letter: 'A',
            text: 'A .claude/rules/ directory where each markdown file covers a single topic (e.g., accessibility.md, graphql.md, ci-pipeline.md)',
          },
          {
            letter: 'B',
            text: 'Nested CLAUDE.md files in subdirectories that each override their parent\'s instructions for that part of the tree',
          },
          {
            letter: 'C',
            text: 'A .claude/config.yaml that maps glob patterns to labeled sections inside the existing CLAUDE.md',
          },
          {
            letter: 'D',
            text: 'README.md files placed in relevant subdirectories, which Claude automatically loads as supplemental instructions',
          },
        ],
        correct: 'A',
        explanation:
          'Claude Code supports a `.claude/rules/` directory where teams can place separate markdown files for each topic. This lets you break a large, monolithic CLAUDE.md into focused modules like `accessibility.md` or `graphql.md` that are easier to locate, review, and update independently.',
      },
      {
        id: 14,
        text: 'Your team maintains a /scaffold skill that generates boilerplate files for new microservices. It accepts a service name through $ARGUMENTS. Three recurring problems have surfaced: (1) developers frequently run the skill without providing a name, producing generic placeholder files, (2) the skill sometimes picks up stale architecture decisions from earlier in the conversation and applies outdated patterns, and (3) one developer accidentally deleted a shared Kubernetes namespace when the skill had unrestricted tool access. Which single configuration approach solves all three problems?',
        options: [
          {
            letter: 'A',
            text: 'Add argument-hint frontmatter to prompt for the service name, use context: fork to run scaffolding in an isolated sub-agent, and set allowed-tools to restrict access to file creation operations only.',
          },
          {
            letter: 'B',
            text: 'Use positional parameters $1 and $2 instead of $ARGUMENTS to enforce structured input, reference architecture docs via @ syntax to control context, and add a description frontmatter warning about destructive operations.',
          },
          {
            letter: 'C',
            text: 'Add validation logic in the SKILL.md instructing Claude to check that $ARGUMENTS is non-empty, include a note to ignore prior conversation context, and list Kubernetes commands that must never be run.',
          },
          {
            letter: 'D',
            text: 'Split into /scaffold-init and /scaffold-deploy skills, add instructions in each to request a service name if missing, and give each skill a different set of allowed tools.',
          },
        ],
        correct: 'A',
        explanation:
          'This approach uses three purpose-built skill frontmatter features to address each issue: `argument-hint` shows the expected service name parameter during autocomplete (solving missing arguments), `context: fork` runs the skill in an isolated sub-agent free from stale conversation context (solving outdated pattern bleed), and `allowed-tools` restricts the skill to file creation only (preventing accidental destructive operations).',
      },
      {
        id: 15,
        text: 'You are standardizing retry logic across a 150-file codebase that makes external HTTP calls. The work has three stages: (1) cataloging every HTTP call site and its current error handling pattern, (2) collaboratively designing the retry wrapper with your team, and (3) applying the wrapper consistently everywhere. During Stage 1, Claude produces extensive output listing hundreds of call sites with surrounding code context, and your context window is running low before discovery is even complete.\n\nHow should you restructure the workflow to finish all three stages effectively?',
        options: [
          {
            letter: 'A',
            text: 'Switch to headless mode with --continue and pass explicit summaries between invocations to carry forward the catalog.',
          },
          {
            letter: 'B',
            text: 'Document the retry pattern in CLAUDE.md, then process files in small batches across fresh sessions, relying on the shared instructions for consistency.',
          },
          {
            letter: 'C',
            text: 'Delegate Stage 1 to the Explore subagent so the verbose cataloging runs in a separate context and only a concise summary returns to the main conversation for Stages 2 and 3.',
          },
          {
            letter: 'D',
            text: 'Stay in the main conversation for all stages and run /compact between stages to reclaim context space.',
          },
        ],
        correct: 'C',
        explanation:
          'The Explore subagent is purpose-built for verbose discovery work. It runs the cataloging in a separate context and returns only a compact summary, preserving the main conversation\'s context window for the collaborative design discussion and the consistent implementation pass where retained context matters most.',
      },
    ],
  },
  {
    id: 's4',
    title: 'Multi-Agent Research System',
    shortTitle: 'Multi-Agent System',
    context:
      'You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates tasks to specialized subagents: one for web searches, one for document analysis, one for synthesizing findings, and one for generating reports. The system investigates topics and produces comprehensive, cited reports.',
    color: '#7b1fa2',
    questions: [
      {
        id: 1,
        text: 'The web search subagent regularly hits transient issues during research tasks—rate-limited API responses from search providers, DNS resolution failures on certain domains, and occasional socket timeouts when fetching page content. Currently, every failure is immediately returned to the coordinator, which then decides whether to retry the query, try an alternative search provider, or abort. This creates a bottleneck where the coordinator spends most of its reasoning budget on routine failure management rather than research orchestration. What is the most effective architectural improvement?',
        options: [
          {
            letter: 'A',
            text: 'Build a centralized retry service that sits between all subagents and the coordinator, intercepting failures and applying configurable retry policies before any error reaches the coordinator.',
          },
          {
            letter: 'B',
            text: 'Have the coordinator pre-validate all search queries and target URLs before dispatching them to the web search subagent, filtering out requests likely to fail.',
          },
          {
            letter: 'C',
            text: 'Configure the subagent to silently suppress all transient errors and return whatever partial data it collected, marking the response as complete so the coordinator does not need to intervene.',
          },
          {
            letter: 'D',
            text: 'Equip the subagent with local retry and fallback logic for transient issues, escalating to the coordinator only when recovery attempts are exhausted, along with details of what was tried and any partial data gathered.',
          },
        ],
        correct: 'D',
        explanation:
          'Equipping the subagent with local retry and fallback logic follows the principle of handling errors at the lowest level capable of resolving them. This frees the coordinator from routine failure management while ensuring that genuinely unresolvable problems are still escalated with full context, including what recovery strategies were attempted and any partial results obtained.',
      },
      {
        id: 2,
        text: 'Performance testing reveals that the web search subagent produces approximately 110K tokens of raw page extracts with inline commentary, and the document analysis subagent generates around 90K tokens including verbose reasoning traces and full-text quotations. Together these 200K tokens far exceed the synthesis agent\'s optimal operating range of 60K tokens, causing degraded output quality. What is the most effective solution?',
        options: [
          {
            letter: 'A',
            text: 'Deploy a shared knowledge graph that upstream agents write to and the synthesis agent queries selectively using graph traversal tools',
          },
          {
            letter: 'B',
            text: 'Restructure upstream agents to emit concise structured outputs (extracted claims, source metadata, confidence indicators) rather than raw content and verbose reasoning chains',
          },
          {
            letter: 'C',
            text: 'Split the synthesis agent into multiple specialized synthesizers, each handling a subset of the input so no single agent exceeds its token budget',
          },
          {
            letter: 'D',
            text: 'Insert a compression agent between the upstream agents and the synthesis agent that distills outputs into shorter summaries',
          },
        ],
        correct: 'B',
        explanation:
          'Restructuring upstream agents to emit concise structured outputs tackles the root cause by reducing token volume at its origin while retaining the essential information the synthesis agent needs. This eliminates bloated raw content and reasoning traces that inflate token counts without contributing value to the synthesis step.',
        wrongExplanations: {
          A: 'A shared knowledge graph introduces substantial architectural complexity and requires the synthesis agent to formulate graph queries to retrieve findings, which risks incomplete coverage if queries miss relevant nodes. The synthesis task requires holistic awareness of all findings, not selective retrieval, making this approach poorly suited to the problem.',
        },
        studyArea:
          'Multi-Agent Research System — review Multi-Agent Orchestration concepts in the exam study guide.',
        studyAreaLink: '/domains/d1#task-1.2',
      },
      {
        id: 3,
        text: 'Latency analysis shows that the report generation subagent frequently pauses to request citation verification from the coordinator, which forwards the request to the document analysis subagent and returns the result. This round-trip pattern occurs an average of 8 times per report, adding 35% to total generation time. Closer examination reveals that 85% of these verification requests are straightforward bibliographic lookups (confirming author names, publication dates, DOI numbers), while 15% involve substantive cross-referencing across multiple sources. What is the most effective way to reduce this overhead while preserving accuracy?',
        options: [
          {
            letter: 'A',
            text: 'Provide the report generation subagent with a scoped check_citation tool that handles simple bibliographic lookups directly, while substantive cross-referencing requests continue routing through the coordinator to the document analysis subagent.',
          },
          {
            letter: 'B',
            text: 'Have the document analysis subagent pre-generate an exhaustive citation index during its analysis phase, anticipating every reference the report generation subagent might need to verify.',
          },
          {
            letter: 'C',
            text: 'Batch all citation verifications: have the report generation subagent collect every needed verification into a single list, return it to the coordinator at the end, and then regenerate the report once all verifications come back.',
          },
          {
            letter: 'D',
            text: 'Give the report generation subagent full access to the document analysis subagent\'s tool suite so it can perform any verification independently without coordinator involvement.',
          },
        ],
        correct: 'A',
        explanation:
          'Providing a scoped citation-checking tool eliminates the round-trip overhead for the 85% of verifications that are simple lookups, while preserving the coordinator-mediated path for the 15% requiring substantive cross-referencing. This follows the principle of least privilege by keeping the report generation agent focused on its core responsibility with only the minimal additional capability needed.',
        wrongExplanations: {
          B: 'Pre-generating an exhaustive citation index relies on predicting which references the report generation subagent will need to verify, which is inherently speculative. This wastes processing time building an index that may not match actual verification needs, and cannot anticipate references that emerge only during the report drafting process.',
        },
        studyArea:
          'Multi-Agent Research System — review Tool Distribution concepts in the exam study guide.',
        studyAreaLink: '/domains/d2#task-2.3',
      },
      {
        id: 4,
        text: 'During a healthcare policy research task, the document analysis subagent processes three types of sources with different outcomes: peer-reviewed journals returned 22 relevant articles, government regulatory filings returned "no matching records," and hospital database queries returned "authentication failed — session expired." When designing error propagation back to the coordinator, what approach enables the best recovery decisions?',
        options: [
          {
            letter: 'A',
            text: 'Have the subagent handle all non-success outcomes internally with retries and only surface errors that persist after multiple attempts, keeping the coordinator focused on orchestration.',
          },
          {
            letter: 'B',
            text: 'Clearly differentiate infrastructure failures (expired session) that require corrective action from legitimate empty results ("no matching records") that represent completed searches with no findings.',
          },
          {
            letter: 'C',
            text: 'Compute a composite reliability score (e.g., "1 of 3 sources failed") and return it alongside the successful results, with full diagnostic logs available if the coordinator requests them.',
          },
          {
            letter: 'D',
            text: 'Treat both the empty results and the authentication failure as errors requiring coordinator intervention, since neither produced usable research data.',
          },
        ],
        correct: 'B',
        explanation:
          'An expired authentication session (infrastructure failure) and "no matching records" (valid empty result) are fundamentally different outcomes demanding different responses. Differentiating them lets the coordinator re-authenticate and retry the hospital database while correctly treating the empty regulatory filings as a legitimate, informative finding rather than a problem to solve.',
        wrongExplanations: {
          A: 'Handling all non-success outcomes internally with retries hides critical context from the coordinator, such as the distinction between a source that was successfully queried but returned nothing and one that could not be reached at all. The coordinator needs this visibility to manage resource allocation and decide whether additional action is warranted.',
        },
        studyArea:
          'Multi-Agent Research System — review Error Propagation concepts in the exam study guide.',
        studyAreaLink: '/domains/d2#task-2.2',
      },
      {
        id: 5,
        text: 'The web search subagent encounters a data source that consistently returns malformed HTML — the page structure is so broken that no parser can extract meaningful content from it. How should the system handle this failure?',
        options: [
          {
            letter: 'A',
            text: 'Quietly omit the source from the results and proceed with other successfully parsed pages so the workflow is not disrupted.',
          },
          {
            letter: 'B',
            text: 'Raise an unhandled exception that propagates upward and halts the entire multi-agent research pipeline.',
          },
          {
            letter: 'C',
            text: 'Attempt to parse the malformed HTML five times using different parser configurations with increasing timeouts before giving up.',
          },
          {
            letter: 'D',
            text: 'Return the failure details and source URL to the coordinator agent so it can decide whether to try an alternative source, a cached version, or skip the page.',
          },
        ],
        correct: 'D',
        explanation:
          'Returning failure details to the coordinator preserves decision-making authority at the appropriate level. The coordinator can choose the best recovery path — such as fetching an archived version, trying a different URL, or skipping the source — while maintaining full visibility into what went wrong and why.',
        wrongExplanations: {
          C: 'Repeatedly attempting to parse structurally broken HTML with different configurations is futile because the corruption is inherent to the source content, not a transient parsing issue. This wastes compute resources on a permanent condition that retries cannot resolve.',
        },
        studyArea:
          'Multi-Agent Research System — review Error Propagation concepts in the exam study guide.',
        studyAreaLink: '/domains/d2#task-2.2',
      },
      {
        id: 6,
        text: 'You originally gave the synthesis subagent a general-purpose query_data tool designed to retrieve information from any connected system. In production, you discover the synthesis agent is using this tool to run live web searches and pull fresh data during synthesis — behavior reserved for the web search subagent. This leads to contradictory findings when live results differ from the web search agent\'s earlier snapshot. What is the most effective fix?',
        options: [
          {
            letter: 'A',
            text: 'Replace query_data with a retrieve_findings tool scoped to only access the stored results already collected by other subagents.',
          },
          {
            letter: 'B',
            text: 'Add explicit instructions to the synthesis agent\'s system prompt stating it must not use query_data for live web searches and should only access pre-collected data.',
          },
          {
            letter: 'C',
            text: 'Add a URL allowlist filter to query_data that blocks requests to external web domains while permitting internal data store access.',
          },
          {
            letter: 'D',
            text: 'Remove query_data entirely from the synthesis agent and require it to request any additional data through the coordinator, which routes to the appropriate subagent.',
          },
        ],
        correct: 'A',
        explanation:
          'Replacing the general-purpose tool with one scoped to only access stored subagent results eliminates the misuse at the interface level. This follows the principle of least privilege by making live web searches structurally impossible for the synthesis agent rather than relying on prompt-based instructions that the model may not consistently follow.',
      },
      {
        id: 7,
        text: 'The document analysis subagent encounters a rate limit from a third-party API while retrieving supplementary metadata for academic papers. You need to design how this failure information reaches the coordinator so it can decide on next steps. Which error propagation approach best enables intelligent recovery?',
        options: [
          {
            letter: 'A',
            text: 'Let the rate-limit exception bubble up unhandled to a global error handler that logs the failure and terminates the research pipeline.',
          },
          {
            letter: 'B',
            text: 'Return a structured error payload to the coordinator containing the failure type (rate limit), the affected query parameters, any metadata already retrieved, and suggested recovery options such as waiting or using cached data.',
          },
          {
            letter: 'C',
            text: 'Implement an internal retry loop with increasing delays within the subagent, and only return a generic "metadata unavailable" status after all retries fail.',
          },
          {
            letter: 'D',
            text: 'Catch the rate-limit error inside the subagent and return the papers without metadata, marking them as fully processed.',
          },
        ],
        correct: 'B',
        explanation:
          'Returning a structured error payload — including the failure type, affected queries, partial results, and suggested alternatives — gives the coordinator the full picture needed for intelligent recovery. It can decide whether to wait and retry, use cached metadata, or proceed without it, all based on concrete information rather than guesswork.',
      },
      {
        id: 8,
        text: 'During a competitive landscape analysis, you notice the web search subagent and the document analysis subagent are both independently researching the same competitor companies, producing highly redundant findings. The combined output contains extensive duplication, inflating token usage by roughly 80% without meaningfully expanding research coverage. What is the most effective way to address this?',
        options: [
          {
            letter: 'A',
            text: 'Switch to sequential execution where the document analysis agent runs first, then the web search agent receives its findings and only searches for information not already covered',
          },
          {
            letter: 'B',
            text: 'Have the coordinator divide the competitive landscape into non-overlapping segments before dispatching tasks, assigning specific competitors or market dimensions to each subagent',
          },
          {
            letter: 'C',
            text: 'Let both agents work in parallel without constraints, then add a deduplication step that merges overlapping findings before passing them to the synthesis agent',
          },
          {
            letter: 'D',
            text: 'Create a real-time shared workspace where each subagent publishes its current research focus, enabling the other to dynamically adjust and avoid covering the same ground',
          },
        ],
        correct: 'B',
        explanation:
          'Having the coordinator divide the research space into non-overlapping segments before delegation tackles the root cause — ambiguous task boundaries — at the earliest possible point. This preserves the efficiency of parallel execution while structurally preventing duplicated effort and wasted tokens.',
        wrongExplanations: {
          D: 'A real-time shared workspace introduces coordination complexity, potential race conditions, and communication overhead between agents that operate best in isolation. Some duplication will still occur before agents detect each other\'s focus. Proactive partitioning by the coordinator is both simpler and more reliable than reactive coordination between subagents.',
        },
        studyArea:
          'Multi-Agent Research System — review Multi-Agent Orchestration concepts in the exam study guide.',
        studyAreaLink: '/domains/d1#task-1.2',
      },
      {
        id: 9,
        text: 'Monitoring dashboards show that requests like "summarize the uploaded compliance audit" are handled by the web search subagent 40% of the time instead of the document analysis subagent. Investigation reveals the web search agent exposes a process_information tool described as "processes information sources and generates structured summaries," while the document analysis agent has a process_document tool described as "processes documents and generates structured summaries." How should you fix this misrouting?',
        options: [
          {
            letter: 'A',
            text: 'Rename the web search tool to format_search_results and update its description to "formats and structures data retrieved from web search queries and online sources."',
          },
          {
            letter: 'B',
            text: 'Add routing examples to the coordinator\'s system prompt: "uploaded compliance audit \u2192 document analysis agent" and "find information online \u2192 web search agent."',
          },
          {
            letter: 'C',
            text: 'Enhance the document analysis tool\'s description to list supported formats ("PDFs, spreadsheets, Word files, uploaded audits") without changing the web search tool.',
          },
          {
            letter: 'D',
            text: 'Deploy a classification layer that inspects whether the user\'s input references a file upload or a web query before the coordinator selects a subagent.',
          },
        ],
        correct: 'A',
        explanation:
          'Renaming the web search tool to `format_search_results` and rewriting its description to explicitly reference web search queries eliminates the semantic ambiguity between the two tools. This addresses the root cause — overlapping tool names and descriptions — making each tool\'s scope unambiguous so the coordinator routes correctly without additional logic.',
      },
      {
        id: 10,
        text: 'While processing sources on renewable energy costs, the document analysis subagent finds that a World Bank report projects solar panel costs dropping 55% by 2030, while an equally authoritative International Energy Agency study projects only a 20% reduction over the same period. Both sources are well-cited and the difference would materially affect the final report\'s conclusions. What is the most effective way for the document analysis agent to handle this?',
        options: [
          {
            letter: 'A',
            text: 'Evaluate the methodology of each source, select the projection with stronger supporting evidence, and use that figure as the primary data point with a brief note about the alternative.',
          },
          {
            letter: 'B',
            text: 'Include both projections in the analysis output as-is without highlighting the disagreement, letting downstream agents determine relevance from the broader research context.',
          },
          {
            letter: 'C',
            text: 'Include both projections in the analysis with a clear annotation flagging the conflict and attributing each figure to its source, then let the coordinator determine how to reconcile before synthesis proceeds.',
          },
          {
            letter: 'D',
            text: 'Pause all document processing and immediately escalate to the coordinator to resolve which projection is correct before the agent continues with remaining documents.',
          },
        ],
        correct: 'C',
        explanation:
          'This approach respects separation of concerns: the document analysis agent finishes its primary job without blocking, preserves both conflicting data points with clear source attribution, and appropriately defers the reconciliation decision to the coordinator, which has the broader research context needed to determine how to handle the disagreement.',
      },
      {
        id: 11,
        text: 'Quality reviews reveal a recurring pattern in synthesis outputs. When the combined input from all subagents reaches approximately 80K tokens, the synthesis agent consistently incorporates details from the opening section (first ~12K tokens of web search highlights) and the closing section (last ~8K tokens of document conclusions), but neglects substantial findings embedded in the middle ~60K tokens — including data directly relevant to the core research question. How should you restructure the aggregated input to fix this?',
        options: [
          {
            letter: 'A',
            text: 'Feed subagent results to the synthesis agent one source at a time in sequence, having it process and integrate each source completely before receiving the next.',
          },
          {
            letter: 'B',
            text: 'Randomize the ordering of subagent outputs for each research task so that no single source type consistently occupies the neglected middle positions.',
          },
          {
            letter: 'C',
            text: 'Aggressively compress all subagent outputs to stay under 15K tokens total, ensuring the entire input falls within the model\'s highest-attention range.',
          },
          {
            letter: 'D',
            text: 'Prepend an executive summary of the most important findings from all subagents and add clearly labeled section dividers throughout the body to aid navigation of the middle content.',
          },
        ],
        correct: 'D',
        explanation:
          'Prepending an executive summary leverages the primacy effect by placing the most critical findings in the position the model attends to most reliably. Adding clearly labeled section dividers throughout the body helps the model navigate and attend to middle-section content, directly counteracting the "lost in the middle" phenomenon without discarding any information.',
      },
      {
        id: 12,
        text: 'During a market analysis task, the web search subagent successfully retrieves data from financial databases and trade publications but fails to access two sources — a proprietary analyst platform (subscription expired) and a government statistics portal (server maintenance). The document analysis subagent processes all provided reports without issues. The synthesis subagent now needs to produce a market overview from this incomplete input. What is the most effective error propagation strategy?',
        options: [
          {
            letter: 'A',
            text: 'Have the synthesis subagent refuse to produce output and return an error to the coordinator, flagging that upstream data is incomplete and requesting a full re-run once all sources are available.',
          },
          {
            letter: 'B',
            text: 'Have the synthesis subagent produce the market overview while annotating which conclusions are well-grounded in available data and which areas lack coverage due to inaccessible sources.',
          },
          {
            letter: 'C',
            text: 'Have the synthesis subagent pause and ask the coordinator to resolve the missing sources — by renewing the subscription and waiting for the portal to come back online — before beginning synthesis.',
          },
          {
            letter: 'D',
            text: 'Proceed with synthesis using the available data and generate output that makes no mention of the missing sources, presenting all conclusions with equal confidence.',
          },
        ],
        correct: 'B',
        explanation:
          'Producing output with coverage annotations embodies graceful degradation with transparency. The synthesis agent delivers maximum value from the data that is available while clearly communicating which areas have gaps due to inaccessible sources, enabling downstream consumers to make informed judgments about confidence levels and data completeness.',
      },
      {
        id: 13,
        text: 'A team member proposes a performance optimization: have the web search subagent pass its results directly to the synthesis subagent rather than sending them back through the coordinator first. What is the primary benefit of maintaining the coordinator as the central hub for all inter-subagent communication?',
        options: [
          {
            letter: 'A',
            text: 'The coordinator combines outputs from multiple subagents into a single payload, reducing the number of network round-trips and improving overall throughput',
          },
          {
            letter: 'B',
            text: 'Only the coordinator has the serialization capabilities needed to convert subagent outputs into formats other subagents can consume',
          },
          {
            letter: 'C',
            text: 'The coordinator maintains visibility into all data flows, applies uniform error handling policies, and controls exactly what context each subagent receives',
          },
          {
            letter: 'D',
            text: 'Subagents run in sandboxed environments with no shared memory, and the coordinator is the only component with the permissions to broker data between them',
          },
        ],
        correct: 'C',
        explanation:
          'The coordinator-as-hub pattern provides centralized visibility into all data flows, consistent error handling across every interaction, and fine-grained control over the information each subagent receives. These are the core advantages of hub-and-spoke communication in a multi-agent architecture.',
      },
      {
        id: 14,
        text: 'After running the system on the topic "global supply chain disruptions," you find that each subagent performs well individually: the web search agent retrieves relevant news stories, the document analysis agent accurately processes trade reports, and the synthesis agent produces coherent output. Yet the final report focuses exclusively on semiconductor shortages, entirely omitting disruptions in agriculture, pharmaceuticals, and energy. Reviewing the coordinator\'s logs, you see it decomposed the topic into: "chip manufacturing delays," "GPU supply constraints," and "semiconductor fab capacity." What is the most likely root cause?',
        options: [
          {
            letter: 'A',
            text: 'The web search agent\'s search terms are biased toward technology topics and need broadening to cover other supply chain sectors.',
          },
          {
            letter: 'B',
            text: 'The document analysis agent is discarding sources about non-technology supply chains because its relevance scoring is calibrated too narrowly.',
          },
          {
            letter: 'C',
            text: 'The coordinator agent decomposed the broad topic into overly narrow subtasks focused on a single sector, so the subagents never received assignments covering other disrupted industries.',
          },
          {
            letter: 'D',
            text: 'The synthesis agent lacks guidelines for detecting when the findings it receives represent only a subset of the topic\'s full scope.',
          },
        ],
        correct: 'C',
        explanation:
          'The coordinator broke "global supply chain disruptions" into three semiconductor-specific subtasks, completely omitting agriculture, pharmaceuticals, and energy. Each subagent correctly executed its assigned task — the problem lies upstream in the coordinator\'s task decomposition, which was too narrow to cover the breadth of the research topic.',
        studyArea: 'Multi-Agent Research System — review Task Decomposition concepts in the exam study guide.',
        studyAreaLink: '/domains/d1#task-1.2',
      },
    ],
  },
];

export function getQuizSection(id) {
  return quizSections.find((s) => s.id === id);
}

export function getAllQuizStats(getStatus) {
  let totalScore = 0,
    totalQuestions = 0,
    sectionsCompleted = 0;
  quizSections.forEach((s) => {
    const best = getStatus(`quiz:${s.id}:best`, null);
    if (best) {
      totalScore += best.score;
      totalQuestions += best.total;
      sectionsCompleted++;
    } else {
      totalQuestions += s.questions.length;
    }
  });
  return {
    totalScore,
    totalQuestions,
    sectionsCompleted,
    totalSections: quizSections.length,
  };
}
