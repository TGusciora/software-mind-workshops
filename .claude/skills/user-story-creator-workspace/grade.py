"""Programmatic grader for user-story-creator evals. Usage: python grade.py iteration-N"""
import glob, json, os, re, sys

A = [
    "Interview questions (>=4) were produced before writing",
    "Questions offer concrete options with a recommendation",
    "Stories file has a Personas section",
    "Stories are grouped under epics (>=2)",
    "Every story uses 'As a / I want / so that'",
    "Every story has Given/When/Then acceptance criteria",
    "Every story has a MoSCoW priority",
    "Every story has a unique stable ID",
    "Stories file has an Out of scope section",
    "Stories file itself lists Assumptions and Open questions",
    "Every 'As a' persona appears in the Personas section",
]

ID = r"\b[A-Z]{1,8}-\d+(?:\.\d+)?\b"
H = r"(?im)^#+\s*(?:\d+\.\s*)?"  # heading, optionally numbered ("## 2. Personas")
PRIO = r"\b(Must|Should|Could|Won'?t)\b|\((?:M|S|C|W)\)|\*\*(?:M|S|C|W)\*\*|Priority:\s*[MSCW]\b"


def split_stories(t):
    # A story starts at a heading or bold line that carries an ID (US-01, US-1.1, ENROLL-01)
    parts = re.split(rf"\n(?=(?:#{{2,5}} [^\n]*?|\*\*\s*){ID})", t)
    return [p for p in parts if re.search(r"(?i)\bI want\b", p) and re.match(rf"(?:#{{2,5}} [^\n]*?|\*\*\s*){ID}", p.lstrip())]


def grade(outdir):
    files = glob.glob(outdir + "/*.md")
    q = [f for f in files if "questionnaire" in os.path.basename(f)]
    s = [f for f in files if f not in q]
    qt = open(q[0]).read() if q else ""
    t = open(max(s, key=os.path.getsize)).read() if s else ""
    stories = split_stories(t)
    n = len(stories)
    nq = len(re.findall(r"(?m)^\s*(?:#+\s*)?(?:\*\*)?(?:Q\d+|\d+[.)])", qt)) or qt.count("?")
    persona_sec = re.search(H.replace("(?im)", "(?ims)") + r"personas?\b(.*?)(?=\n#{1,2} )", t + "\n# end")
    ps = persona_sec.group(1).lower() if persona_sec else ""
    as_a = set()
    for x in stories:
        m = re.search(r"(?im)^\W*As\s+(?:an?\b)?[\s*]*([^,*\n]+)", x)
        if m:
            as_a.add(m.group(1).strip().lower())
    stop = {"a", "an", "the", "i", "am", "who", "new", "our", "of", "at", "on", "in", "with", "and", "or"}
    bad_personas = [p for p in as_a if not any(w in ps for w in re.findall(r"[a-z]+", p) if w not in stop)]
    ids = [re.search(ID, x).group(0) for x in stories]
    epics = re.findall(r"(?im)^#+\s*(?:\d+\.\s*)?(?:epic\b|E\d+\s*[:.-])", t)
    cnt = lambda pat: sum(bool(re.search(pat, x)) for x in stories)
    gwt = sum(bool(re.search(r"(?i)\bgiven\b", x) and re.search(r"(?i)\bwhen\b", x) and re.search(r"(?i)\bthen\b", x)) for x in stories)
    checks = [
        (nq >= 4, f"questionnaire.md {'found' if q else 'missing'}, ~{nq} questions"),
        (bool(q) and "recommend" in qt.lower() and bool(re.search(r"(?i)option", qt)), "questionnaire mentions options and a recommendation" if q else "no questionnaire"),
        (bool(persona_sec), "Personas heading " + ("found" if persona_sec else "missing")),
        (len(epics) >= 2, f"{len(epics)} epic headings"),
        (n > 0 and cnt(r"(?i)so that") == n, f"{cnt(r'(?i)so that')}/{n} stories with 'so that'"),
        (n > 0 and gwt == n, f"{gwt}/{n} stories with Given/When/Then"),
        (n > 0 and cnt(PRIO) == n, f"{cnt(PRIO)}/{n} stories with a priority"),
        (n > 0 and len(set(ids)) == n, f"{n} stories, {len(set(ids))} unique IDs (e.g. {ids[:3]})"),
        (bool(re.search(H + r"(out of scope|non-goals|won'?t)", t)), "Out of scope heading check"),
        (bool(re.search(H + r"assumptions", t)) and bool(re.search(H + r"open questions", t)), "Assumptions + Open questions headings in stories file"),
        (bool(persona_sec) and not bad_personas, f"{len(as_a)} distinct 'As a' roles; not in Personas: {bad_personas[:5]}"),
    ]
    return [{"text": a, "passed": bool(p), "evidence": e} for a, (p, e) in zip(A, checks)]


it = sys.argv[1]
for d in sorted(glob.glob(f"{it}/eval-*")):
    for cfg in ["with_skill", "without_skill"]:
        for run in sorted(glob.glob(f"{d}/{cfg}/run-*")):
            ev = grade(f"{run}/outputs")
            p = sum(e["passed"] for e in ev)
            json.dump({"expectations": ev, "summary": {"passed": p, "failed": len(ev) - p, "total": len(ev), "pass_rate": p / len(ev)}},
                      open(f"{run}/grading.json", "w"), indent=2)
            print(os.path.basename(d), cfg, os.path.basename(run), f"{p}/{len(ev)}")
    m = json.load(open(f"{d}/eval_metadata.json"))
    m["assertions"] = A
    json.dump(m, open(f"{d}/eval_metadata.json", "w"), indent=2)
