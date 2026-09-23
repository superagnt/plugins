---
status: reference
created: 2026-09-23
updated: 2026-09-23
type: reference
---

# ICP scoring rubric

The score decides everything downstream: who costs an email lookup, who gets a free resource, who gets a message. This is the scorer from the managed version of this skill (the hosted "LinkedIn Outbound Scout"), which was itself generalized from a client's production scoring pipeline, plus the weekly loop that keeps it honest. Use it in step 4. Run locally, you are the scorer and you apply this rubric yourself; in the standing version it becomes the data job's cached instruction (`autopilot-agent-team.md`).

## TL;DR

- **Two layers.** A cheap gate that rejects only what is provable (an explicitly out-of-region location, or an empty or fake profile), then one holistic score against a written ICP description, with the reason written onto the row. Every judgment about fit belongs to the score, never to a gate.
- **Why only two rejections.** Hard gates freeze one company's opinions into the pipeline (a title blacklist, a vendor gate, a single country), and on a different business they qualify nobody. In one production system the hard gates rejected 59% of scored leads before any judgment happened. The managed version cut its gate to two rejections for exactly that reason.
- **The order is the cost discipline.** A free URL check, one profile read, the gate, the company, research only when needed, the score, then the email lookup for qualified leads only. Each step exists to stop a lead before a more expensive one runs.
- **The bar is 50, and an unresolved maybe qualifies.** A staged touch is cheap and reversible, and it is how a maybe gets resolved. A score at or under 50 needs a concrete wrong-way reason, never just thin evidence.
- **Calibrate weekly from two reports.** Leads above 50 that never convert mean the ICP description is too loose; closest calls the user would happily email mean it's too tight. Fix the words, not the threshold.

## The ICP description

The score reads a description written in prose, in the buyer's own terms, not a points table. Store it in `icp_profile.icp_description` and draft it with the user on the first run:

- **Who buys:** the roles and seniority that own the problem, at what kind of company (category, size, go-to-market), and the situation in which they feel it.
- **Hot-account signals:** evidence that marks an account as in-market right now (hiring for the function, a launch, a tool switch, a new market). Keep these in `icp_profile.trigger_signals`.
- **Looks close, never buys:** the lookalikes that fill a list and never convert (vendors in the same space, consultants who advise on it, students and job seekers, companies outside the size band). This sentence does more to raise the hit rate than any other.
- **Target geography:** the countries or regions the user can sell to (`icp_profile.target_geography`). An unknown location never disqualifies anyone.
- **Personas (optional):** a short id and one line each, used as opener context, never as a gate.

## Layer 1: the gate

Cheap and narrow. It decides only whether to keep spending on this lead, and it can answer only with "provably out of region" or "provably not a real profile".

1. **Geography, on positive evidence only.** Weigh every geo signal the profile carries (location string, country code, country name, geo id); an explicit country outranks a city string. Disqualify only when a signal explicitly names a place outside the target. A missing location, an unplaceable city, "remote" or "global": none of those is contrary evidence. "Unknown" is a normal, frequent answer and never a disqualification.
2. **Junk.** An empty, spam or obviously fake profile: no name, no title and no company at all, a wall of promotional keywords, a placeholder or bot account.

**Do not judge the role here.** Not the title, the seniority, the industry, or whether the person looks like a buyer, a competitor, an agency or a student. The gate doesn't have the evidence yet, and a gate that guesses at fit from a headline silently starves the funnel; it costs more good leads than every bad lead it ever stops.

The one deterministic exclusion that is not a judgment: anyone whose company is on the user's do-not-contact list (competitors they named, customers, partners, their own staff) is dropped here, absolutely.

Pull names, titles, company and domain out of the profile deterministically before any model sees it; a model that has to extract fields as well as judge does both worse. The gate can also propose one or two web searches about the company (the company name in quotes) for the score to use when the profile and company data don't settle it. A gate rejection writes `fit_score = 3` with the reason, which keeps "judged and rejected" distinct from "not yet scored".

## Layer 2: the score

One holistic judgment per lead, from the profile, the company data, any research, what the lead engaged with, and the ICP description. The rubric, as the managed version runs it:

**How to score.** Assign a 0 to 100 ICP fit score. Don't apply a formula or add up points; weigh every signal together and arrive at one judgment. Three questions carry it:

1. Is this person's company a plausible customer, as the ICP description defines one?
2. Do they have the title, seniority and scope to buy, champion or meaningfully influence the purchase?
3. Do the company's category, size and go-to-market suggest active investment in the problem the user solves?

Weight fit and buying authority most heavily. A large company is not a penalty.

**Competitors and vendors: score them, don't gate them.** A company that sells what the user sells, to the same buyers, would never buy: score it under 20 and say so in one clause of the reason. And be precise, because the most expensive mistake is calling something a competitor because it's nearby. A consultant who works in the space, an agency that could put the user's product in the stack it runs for clients, a company one category over, a person whose title sounds like the user's own marketing: none of those sells the product. Judge the company by what it sells, never by the job title, and when the evidence doesn't settle it, score the plausible buyer and name the doubt.

**Trigger signals are a bonus.** Evidence of one pushes a score up. Their absence is never a mark down.

**Authority rules that are routinely gotten wrong:**

- **Operator-buyers are their own budget authority.** A freelancer, fractional operator, solo consultant or small agency that runs this motion for itself or its clients is the buyer. "One-person shop" and "unclear budget" are what being the decision-maker looks like at that scale.
- **A senior title is itself the authority evidence.** A head of the function, or a director and above in it, needs no separate proof of budget.
- **Score the person, not the employer's resemblance to the core profile.** A fitting buyer at an unusual company is an unresolved maybe (51 to 60), not a miss. The wrong-way band is for people with no plausible use for the product, wherever they work.

**The bands:**

| Score | Meaning |
|---|---|
| 81 to 100 | Clear fit with real authority, backed by explicit evidence |
| 61 to 80 | Real fit: the right kind of company, and someone who can buy or champion there |
| 51 to 60 | Plausible fit the evidence doesn't settle. Name what's unknown; it qualifies |
| 20 to 50 | Something concrete points the wrong way (wrong function, wrong kind of company, no use for the product). The reason must name it |
| under 20 | Not a fit, or a company that sells what the user sells |
| 3 | Reserved for a gate rejection, nothing else |

**Calibration, before committing to a number.** Leads above 50 earn a staged touch, and the default for an unresolved maybe is yes. Absence of evidence is not negative evidence: a sparse profile, a company with no website, a title you can't place is uncertainty, not a mismatch. A plausible fit with unknowns belongs in 51 to 60 with the uncertainty named ("plausible operations lead at a company the research didn't identify; no signal either way on size or budget"). A score under the bar means you found a wrong-way reason, not that you lacked a right-way one. Never invent facts that aren't in the evidence; say the evidence is thin, then still commit to a number.

**Personas.** Assign one only when it's a confident fit; prefer none over a forced guess, and never assign one under 20. A persona is opener context, never a gate.

**What gets written:** `fit_score`, `fit_reason` (two or three concrete sentences that cite the evidence used and name the uncertainty when there was some), `persona`, and the status. One preserving write per lead: never overwrite a known value with a blank.

**Model choice.** In the standing version, the high-volume production jobs run both layers on a small model at well under a cent per lead; the managed version spends a mid-size reasoning model on the score alone (about 1.3 cents per lead), because it's the judgment everything rides on. Start small. Escalate only if the closest calls look wrong, or only for leads within about ten points of the bar.

## The weekly calibration loop

Every week, or every hundred or so scored leads, run these with `agnt_db_execute_sql` (`agnt_db_select` can't express the aggregates or the time windows) and show the results to the user. The user decides; you propose the sentence to change.

**1. Score distribution.** One line in every run report, because it tells thin sourcing apart from a bar set too high:

```sql
SELECT count(*) FILTER (WHERE fit_score > 50) AS qualified,
       count(*) FILTER (WHERE fit_score > 3 AND fit_score <= 50) AS under,
       count(*) FILTER (WHERE fit_score = 3) AS gated,
       count(*) AS scored
FROM leads
WHERE fit_score IS NOT NULL AND updated_at > now() - interval '7 days';
```

**2. Closest calls.** The best leads that fell short, with the reason. When a run qualifies nobody, list these instead of an empty table:

```sql
SELECT person, title, company, fit_score, fit_reason
FROM leads
WHERE fit_score > 3 AND fit_score <= 50
ORDER BY fit_score DESC, updated_at DESC
LIMIT 5;
```

**3. Qualified but silent.** Leads above the bar, staged three or more weeks ago, with no reply:

```sql
SELECT person, title, company, fit_score, fit_reason, staged_at
FROM leads
WHERE fit_score > 50 AND replied_at IS NULL
  AND staged_at < now() - interval '21 days'
ORDER BY fit_score DESC
LIMIT 10;
```

**4. Bands against outcomes.** Reply and interest rates should climb with the score. If 51 to 60 converts like 81 to 100, the bar is fine; if every band converts the same, the score isn't separating anything:

```sql
SELECT CASE WHEN fit_score > 80 THEN '81-100'
            WHEN fit_score > 60 THEN '61-80'
            ELSE '51-60' END AS band,
       count(*) AS staged,
       count(*) FILTER (WHERE replied_at IS NOT NULL) AS replied,
       count(*) FILTER (WHERE reply_intent = 'interested') AS interested
FROM leads
WHERE fit_score > 50 AND staged_at IS NOT NULL
GROUP BY 1 ORDER BY 1 DESC;
```

**What to change:**

- **Qualified leads never convert** (report 3 is full, report 4 is flat): the description is too loose. Describe the near-miss lookalikes and what separates them from a real buyer, in one or two sentences.
- **The closest calls are people the user would happily email:** it's too tight. One sentence about that kind of account fixes it.
- **A search term or source brings volume and no qualified leads** (step 2's steering query): that's a sourcing problem, the wrong audience engaging, not a scoring one. Fix the terms, not the rubric.
- **Never move the threshold to fix a description problem.** Change the words, and keep the bar at 50 unless the user decides otherwise (`icp_profile.qualify_threshold`).
- **Re-score only leads that haven't been contacted** after a change, and never re-score someone in order to contact them again.
- **Date every change** (`icp_profile.updated_at` plus a one-line note of what changed), so the steering data stays readable across versions of the description.

## Sources

The managed LinkedIn Outbound Scout's qualification pipeline and rubric (the gate prompt, the scoring rubric, the calibration rules and the closest-calls report), itself generalized from a client's production scorer that had frozen its opinions into hard gates; and the configuration and outcomes of two production scoring jobs running this motion on superagnt, read in September 2026.
