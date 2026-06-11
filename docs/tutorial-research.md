# Teaching Methods for the Four Operations — Research Report

*Prepared to inform an interactive **Tutorial** mode for Mad Minute Math.*
*Scope: Kindergarten–Grade 6, general Canadian curriculum (Ontario, BC, and the
WNCP/Western tradition), covering both the conceptual/strategy methods kids learn
today and the traditional written algorithms most adults learned.*

> **How to read this.** Claims tied to a 🟢 are backed by primary provincial
> ministry documents and were adversarially fact-checked (3 independent verifier
> votes each). Claims tied to a 🟡 draw on established education research
> (Pashler, Bruner, Van de Walle) rather than a verified curriculum quote — solid,
> but not ministry-sourced. See **Sources & confidence** at the end.

---

## 1. TL;DR — the one principle that should shape the whole tutorial

🟢 Across every Canadian jurisdiction studied, arithmetic is taught **concept →
strategy → student's own method → standard algorithm**, in that order. Official
Ontario policy says students need "multiple opportunities to model solutions …
develop their own algorithms; and to estimate answers … *before* using and
memorizing a formal algorithm," and that traditional algorithms should be taught
"through guided mathematics, including a focus on the **meaning behind the
algorithms and the use of models**." ([Ontario NS&N Guide 1–3](https://oame.on.ca/eduproject/ontariomathedresources/files/Number%20Sense%20and%20Numeration%201-3%20Revised.pdf); [WNCP/Alberta framework](https://open.alberta.ca/publications/3949146))

**Implication for our tutorial:** every operation should let the learner *see and
manipulate* the idea (counters, ten-frames, arrays, number lines, base-ten
blocks) first, then meet a strategy, and only then watch the "carry/borrow"
algorithm reveal itself **on top of** the model they already understand. The
algorithm is the destination, not the starting line.

---

## 2. "Learning styles" vs. what the evidence actually supports 🟡

You used the phrase "learning styles." Worth being precise here, because it
changes how we design:

- **The popular "learning styles" theory is not supported by evidence.** The idea
  that each child is a "visual," "auditory," or "kinesthetic" learner and learns
  best when taught in "their" style (the *meshing hypothesis*) has repeatedly
  failed controlled tests. The landmark review is Pashler, McDaniel, Rohrer &
  Bjork (2008), *"Learning Styles: Concepts and Evidence."* See also the
  [Association for Psychological Science summary](https://www.psychologicalscience.org/news/releases/learning-styles-debunked-there-is-no-evidence-supporting-auditory-and-visual-learning-psychologists-say.html)
  and [Yale's Poorvu Center](https://poorvucenter.yale.edu/LearningStylesMyth).
  **Designing the tutorial to "detect a learning style" would be building on sand.**

- **What *does* work is using multiple representations of the same idea — for
  every learner.** The evidence-based version of "different ways to learn" is the
  **Concrete → Pictorial → Abstract (CPA)** progression (Jerome Bruner's
  enactive/iconic/symbolic modes; also called Concrete–Representational–Abstract,
  CRA). A learner handles a concrete model, then a picture/diagram of it, then the
  bare symbols — *the same concept, three ways, in sequence.* This is the backbone
  of Singapore math and of Van de Walle's *Elementary and Middle School
  Mathematics*, and it lines up exactly with the Canadian "use tools and models,
  then connect to the algorithm" guidance in §1.

**So:** don't sort kids into styles. **Do** teach each operation through concrete →
pictorial → abstract, and let the learner replay any step in a more concrete form
when they're stuck. That's the design north star.

> *Confidence note:* the curriculum findings in this report are primary-source
> verified; this CPA/learning-styles section rests on well-established education
> research that the research pass fetched but did not put through the same
> 3-vote check. It's mainstream consensus, but treat it as "expert reference,"
> not "ministry-quoted."

---

## 3. Scope & sequence (K–6), general Canadian 🟢

Anchored to Ontario's 2020 curriculum expectations (verified), corroborated by BC
and the WNCP/Alberta tradition. Treat grades as *typical*, not rigid.

| Grade | Addition / Subtraction | Multiplication / Division |
|------|------------------------|---------------------------|
| **K** | Counting, subitizing, "how many altogether / how many left" with objects | Informal equal groups & fair-sharing with objects |
| **1** | **Facts to 10** + related subtraction; counting on/back | Equal-group problems, total ≤ 10 (no symbols) |
| **2** | **Facts to 20**; add/subtract to 100 with strategies (making ten, decomposing, friendly numbers, compensation, count-up) | Multiplication as **repeated equal groups**; division as **equal sharing**, ≤ 12 items |
| **3** | Add/subtract to ~1000; **begin connecting to algorithms** via tools & models | Mult to **10×10**, division to **100÷10** with **arrays**; facts ×2, ×5, ×10 + related division facts |
| **4** | Larger numbers, including algorithms; estimation | Facts **1×1–10×10**; 2-/3-digit × 1-digit; **student-generated algorithms**; doubling/halving |
| **5** | Standard algorithms used fluently | Facts **0×0–12×12**; **2-digit × 2-digit & 3-digit ÷ 2-digit using the AREA MODEL *and* algorithms — connect the two** |
| **6** | Multi-digit fluency | 4-digit × / ÷ 2-digit, variety of tools & strategies |

🟢 Fact-fluency sequence verbatim from Ontario B2.2: G1 facts to 10 → G2 to 20 →
G3 ×2/×5/×10 + related division → G4 1×1–10×10 → G5 0×0–12×12.
([Ontario 2020 expectations](https://ecampusontario.pressbooks.pub/app/uploads/sites/2156/2021/11/Ontario-Math-Curriculum-2020_Expectations_All.pdf))

> ⚠️ **Currency caveat:** several fine-grained "which digit-size at which grade"
> details (esp. Gr 4–6 division bounds) come from guides citing the **2005**
> curriculum and should be reconciled with current 2020 wording before being
> hard-coded into UI copy. Also: the exact grade where *the* standard algorithm
> becomes a formal requirement is genuinely contested — claims pinning it to Gr 3
> *and* to Gr 4 were both **refuted** in fact-checking. Safe framing: **algorithm
> understanding begins in Grade 3 and standard algorithms are used through Grades
> 4–6.**

---

## 4. Operation-by-operation

Each section lists: the **conceptual strategies** (with the model and a worked
example), the **standard algorithm**, the **grade**, **interactive ideas** for our
tutorial, and **misconceptions** to catch.

### 4A. Addition

**Conceptual strategies** (🟢 named in Ontario's NS&N 1–3 guide and BC Gr 2):
- **Counting on** — start at the bigger number, count up. `8 + 3` → "8 … 9,10,11."
- **Making / bridging ten** — `8 + 5` → `8 + 2 = 10`, then `+ 3 = 13`. *Model:*
  **ten-frame** (fill the frame to 10, spill the rest).
- **Doubles & near-doubles (doubles-plus-one)** — `6 + 7` → `6 + 6 + 1 = 13`.
- **Friendly / landmark numbers & compensation** — `47 + 38` → `47 + 40 = 87`,
  then `− 2 = 85`.
- **Decomposition / partial sums** — `47 + 38` → `(40+30) + (7+8) = 70 + 15 = 85`.
  *Model:* **base-ten blocks**.
- **Open number line** — draw jumps: from 47, `+30 → 77`, `+8 → 85`.

**Standard algorithm (regrouping / "carrying")** 🟢 — works **right-to-left, digit
by digit**; when a column exceeds 9 you **regroup/trade** to the next column,
writing a small tracking digit. Ontario teaches it directly on base-ten blocks
with the worked example **241 + 174**: combine like blocks, then "11 tens can be
renamed and recomposed as 1 hundred and 1 ten."
([Ontario Gr 3 B2](https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-mathematics/grades/g3-math/strand-b/b2))

```
  ¹           ← the regrouped ten
  4 7
+ 3 8
-----
  8 5         7+8=15 → write 5, carry 1; 4+3+1=8
```

**Grade:** strategies G1–2; algorithm understanding from **G3**.

**Interactive ideas:** ten-frame you fill by tapping (auto-"spills" past 10);
base-ten blocks you drag together and a tap "regroups" 10 ones into a rod;
number-line where you choose your own jumps; then a **step-reveal** of the column
algorithm sitting beside the blocks so the carry is visibly the regrouped rod.

**Misconceptions to catch:** forgetting to add the carried digit; writing the
full two-digit column sum instead of carrying (`47+38 → 715`); place-value
misalignment when addends have different lengths.

### 4B. Subtraction

**Conceptual strategies** 🟢:
- **Counting back** — `15 − 3` → "15 … 14,13,12."
- **Counting up / think-addition** — `15 − 11` → "11 up to 15 is 4." Reframes
  subtraction as the inverse of addition (🟢 Ontario names add/subtract as inverse
  operations).
- **Decomposition** — `52 − 27` → `52 − 20 = 32`, `32 − 7 = 25`.
- **Constant difference / equal addition** — shift both numbers: `52 − 27` →
  `55 − 30 = 25` (add 3 to each).
- **Open number line** (count up): from 27, `+3 → 30`, `+22 → 52`, total `25`.

**Standard algorithm (regrouping / "borrowing")** 🟢 — right-to-left; when the top
digit is smaller, **trade** one unit from the next column (decompose a ten into
ten ones), tracking with small digits.

```
  4 ¹12
  5  2
− 2  7
------
  2  5      can't do 2−7 → trade: 12−7=5; 4−2=2
```

**Grade:** strategies G1–2; algorithm understanding from **G3**.

**Interactive ideas:** number line where the learner "hops up" from the smaller
number; base-ten blocks where a tap "un-trades" a rod into 10 ones to enable the
subtraction, mirrored by the borrow step.

**Misconceptions to catch (high priority):** the classic **"always take the
smaller from the larger"** bug — for `52 − 27`, kids do `7 − 2 = 5` in the ones
column. Also: treating subtraction as **commutative**; forgetting to reduce the
digit that was borrowed from.

> **Terminology note (Canadian):** modern curricula favour **"regrouping" / "trading"**
> over the older **"borrowing" / "carrying."** Use *regroup/trade* in UI copy;
> mention *carry/borrow* once as "what your parents called it" — which neatly
> serves both your kid users and the adults helping them.

### 4C. Multiplication

**Conceptual strategies** 🟢 (Ontario NS&N, BC Gr 3–4, WNCP/Alberta Gr 3):
- **Equal groups** — `4 × 3` = "4 groups of 3." *Model:* counters in rings.
- **Repeated addition** — `4 × 3 = 3 + 3 + 3 + 3`.
- **Skip counting** — `3, 6, 9, 12`. (🟢 BC: "connect multiplication to skip-counting.")
- **Arrays** — `4 × 3` as a 4-by-3 grid of dots. Bridges to area.
- **Area / box model** — `23 × 14` as a rectangle split by place value into 4 sub-rectangles
  (20×10, 20×4, 3×10, 3×4). 🟢 *Ontario teaches the area model* **alongside** *the
  algorithm in Grade 5 and asks students to connect the two.*
- **Doubling & halving** — `5 × 16` → `10 × 8 = 80`. (🟢 BC Gr 4.)
- **Partial products & the distributive property** — `23 × 4 = (20×4) + (3×4) = 80 + 12 = 92`.

**Standard algorithm (long multiplication)** 🟡 step-by-step — multiply the top
number by each digit of the bottom number (ones, then tens with a **0 placeholder**),
then add the partial products:

```
   2 3
 × 1 4
 -----
   9 2     ← 23 × 4
 2 3 0     ← 23 × 10  (note the placeholder 0)
 -----
 3 2 2
```

**Fact learning** 🟢: facts come *with* strategies, not as cold flashcards — ×2 =
doubles, ×4 = double-double, ×5 = half of ×10, ×10 patterns, then the "tricky"
6–9 facts. (Maps directly onto your existing **number-families** practice presets.)

**Grade:** concepts G2–3; facts ×2/×5/×10 by **G3**, all to 10×10 by **G4**,
to 12×12 by **G5**; area model + algorithm **G5**.

**Interactive ideas (the most visually satisfying to build first):** drag counters
into equal groups; **tap-to-build an array** that animates into an **area model**,
which then splits into partial-product rectangles whose numbers feed the written
algorithm. This single visual carries a kid from Grade 2 "groups of" all the way
to Grade 5 long multiplication.

**Misconceptions to catch:** multiplying only by the ones digit of a 2-digit
multiplier (forgetting the tens / the placeholder 0); confusing `4 × 3` ("4 groups
of 3") with "3 groups of 4" before commutativity is solid; adding instead of
multiplying.

### 4D. Division

🟢 The foundational distinction (Ontario junior guide, WNCP/Alberta Gr 3):
- **Partitive (equal sharing)** — you know the *number of groups*, find *how many
  per group*. "12 cookies shared among 3 kids."
- **Quotative (equal grouping / measurement)** — you know *how many per group*,
  find *the number of groups*. "12 cookies, 3 per bag — how many bags?"

Both produce `12 ÷ 3 = 4`, but they *feel* different and both must be experienced.
(🟢 Ontario notes students don't need to *name* them — just meet both.)

**Conceptual strategies** 🟢:
- **Repeated subtraction** — `12 − 3 − 3 − 3 − 3 = 0` → 4 times.
- **Relate to multiplication / fact families** — `12 ÷ 3 = ?` ↔ `3 × ? = 12`.
- **Arrays / open arrays** — `12 ÷ 3` = a 3-row array, how many columns?
- **Partial quotients / chunking ("big seven")** 🟢 — subtract easy multiples of
  the divisor and tally them: `156 ÷ 4` → `−40 (×10)`, `−80 (×20)`, `−36 (×9)` →
  quotient `39`. Ontario calls the distributive property "the basis for a variety
  of division strategies, including the standard algorithm," and shows decomposing
  the dividend into friendly pieces.

**Standard algorithm (long division)** 🟡 — the **Divide → Multiply → Subtract →
Bring down** cycle:

```
    3 9
  ┌──────
4 │ 1 5 6
    1 2        4×3=12
    ───
      3 6      bring down 6
      3 6      4×9=36
      ───
        0      remainder 0  →  156 ÷ 4 = 39
```

🟢 **Pacing guidance, straight from Ontario:** *"a premature introduction to a
standard division algorithm does little to promote student understanding"* —
junior instruction should build understanding and flexible strategies first. So in
our tutorial, **partial quotients/chunking comes before long division.**
([Ontario Division 4–6 guide](https://oame.on.ca/eduproject/ontariomathedresources/files/Number%20Sense%20and%20Numeration%20Vol%204%20Division%204-6.pdf))

**Grade:** sharing/grouping concepts G2–3; arrays G3; flexible/partial-quotient
strategies G4–5; standard long division **G5–6** (after the strategies).

**Interactive ideas:** drag items to "share into N plates" (partitive) vs. "fill
plates of N" (quotative) — same total, two animations; a chunking tool where the
learner peels off friendly multiples and watches the quotient tally; an open array
that grows to fill the dividend.

**Misconceptions to catch:** treating division as commutative (`12 ÷ 3` vs
`3 ÷ 12`); mishandling remainders (dropping them, or not knowing whether to round
up/down — which depends on the *context*); place-value slips in long division.

---

## 5. Canadian math vocabulary for the UI 🟢/🟡

Use these so the tutorial matches what kids hear at school:

| Concept | Use in UI | Avoid / "grown-up word" |
|--------|-----------|--------------------------|
| 2 + 3 = 5 | **addend** + addend = **sum** | — |
| 5 − 2 = 3 | **minuend − subtrahend = difference** | — |
| 4 × 3 = 12 | **factor × factor = product** | "times" (ok casually) |
| 12 ÷ 3 = 4 | **dividend ÷ divisor = quotient** (+ **remainder**) | — |
| trading a ten | **regroup / trade / decompose / recompose** | "borrow," "carry" |
| 4 groups of 3 | **equal groups**, **array**, **skip count** | — |
| sharing vs grouping | **equal sharing** / **equal grouping** | partitive/quotative (don't surface to kids) |

---

## 6. Recommendations for the Tutorial mode

**Design principles**
1. **Concrete → Pictorial → Abstract for every lesson.** Manipulate a model →
   see the diagram → meet the symbols. Let the learner "drop back" to a more
   concrete view on demand.
2. **Strategy before algorithm.** Teach the named strategy and the model first;
   reveal the carry/borrow/long-division steps *layered on top of* the model.
3. **One visual that scales.** Favour models that carry across grades — the
   **array → area model** (multiplication/division) and the **number line**
   (addition/subtraction) each span K–6.
4. **Don't gate on "learning style."** Offer every learner all representations.

**Suggested build order (highest visual payoff first)**
1. **Multiplication via arrays → area model.** Most satisfying to animate, maps to
   your existing number-families practice, and the same widget later powers long
   multiplication. *Start here.*
2. **Addition with ten-frames + regrouping on base-ten blocks** (Ontario already
   gives us the 241+174 worked example to mirror).
3. **Subtraction** (reuse base-ten blocks + number line; emphasize the count-up
   strategy and the "smaller-from-larger" misconception check).
4. **Division: sharing vs grouping animation → chunking/partial quotients → long
   division** (in that order, per Ontario's pacing).

**How it fits the existing app** (no new dependencies needed)
- Add a **Tutorial** screen alongside home/game/results/settings (reuse the
  `setScreen` router and `.screen` pattern).
- The interactive models (ten-frames, arrays, area model, number line, base-ten
  blocks) are **SVG or `<canvas>` + pointer drag** — the same toolkit already used
  for the confetti canvas; no framework or library required.
- Reuse the typed `Settings`/`Problem`/`OpKey` model and the
  number-families/difficulty presets to scope each lesson.
- Keep lessons short and game-flavoured to match the existing tone (combo/streak
  language, the same palette and fonts).

**Per-stage misconception checks to bake in** (from §4): smaller-from-larger
subtraction, forgetting the carry/borrow, the missing placeholder-0 in long
multiplication, division-as-commutative, and remainder handling.

---

## 7. Sources & confidence

**Primary (ministry) — verified, high confidence 🟢**
- Ontario Mathematics Curriculum 2020, full expectations — <https://ecampusontario.pressbooks.pub/app/uploads/sites/2156/2021/11/Ontario-Math-Curriculum-2020_Expectations_All.pdf>
- Ontario *Guide to Effective Instruction, Number Sense & Numeration 1–3* — <https://oame.on.ca/eduproject/ontariomathedresources/files/Number%20Sense%20and%20Numeration%201-3%20Revised.pdf>
- Ontario *Guide to Effective Instruction, Division 4–6* — <https://oame.on.ca/eduproject/ontariomathedresources/files/Number%20Sense%20and%20Numeration%20Vol%204%20Division%204-6.pdf>
- Ontario curriculum, Grade 3 Strand B2 (standard-algorithm wording, base-ten example) — <https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-mathematics/grades/g3-math/strand-b/b2>
- British Columbia Mathematics curriculum — <https://curriculum.gov.bc.ca/curriculum/mathematics>
- WNCP K–9 Common Curriculum Framework (Western/Northern; Alberta) — <https://open.alberta.ca/publications/3949146>

**Education-research references — established, not ministry-verified 🟡**
- Pashler, McDaniel, Rohrer & Bjork (2008), *Learning Styles: Concepts and Evidence* — summary: <https://www.psychologicalscience.org/news/releases/learning-styles-debunked-there-is-no-evidence-supporting-auditory-and-visual-learning-psychologists-say.html>; <https://poorvucenter.yale.edu/LearningStylesMyth>
- Bruner's CPA / enactive–iconic–symbolic; Van de Walle, *Elementary and Middle School Mathematics* (CPA / multiple representations)
- Standard-algorithm step-by-step explainers (secondary, for procedure only): Third Space Learning, Cuemath

**What we could NOT confirm (don't overstate these in copy)**
- That any framework literally prescribes "CPA" by name (**refuted** — the
  principle holds, the label isn't in the WNCP text).
- A single grade where *the* standard algorithm is "introduced" (claims for Gr 3
  **and** Gr 4 both refuted) — use "grounded in Gr 3, used through Gr 4–6."
- The array/area model as *mandated* at Grade 4 (refuted; confirmed at **Grade 5**).

**Open follow-ups** (worth a second pass if we go deep on any operation)
- Reconcile older guides' digit-size bounds with the 2020 curriculum.
- Province-by-province differences (Alberta's post-2022 program, Saskatchewan,
  Manitoba, Québec) beyond ON/BC/WNCP.
- A dedicated misconceptions source per operation/grade.

---

*Research method: 5 search angles → 24 sources fetched → 104 claims extracted →
top 25 adversarially verified (3 votes each; 20 confirmed, 5 refuted). The refuted
claims are listed above so we don't build on them.*
