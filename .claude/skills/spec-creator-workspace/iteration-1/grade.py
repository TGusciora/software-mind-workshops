import json,glob,os,re
A=["Questionnaire of goals, scope and tech was produced","Spec has Goals/vision section","Spec has Scope with in/out of scope","Spec has numbered requirements with must/should/could priority","Spec has Technology section with rationale","Spec records assumptions and open questions","Spec has Milestones"]
for d in sorted(glob.glob("eval-*")):
    for cfg in ["with_skill","without_skill"]:
        o=f"{d}/{cfg}/outputs"
        files=glob.glob(o+"/*.md")
        spec=[f for f in files if "questionnaire" not in f]
        t=open(spec[0]).read().lower() if spec else ""
        r=[("questionnaire" in " ".join(files)),
           bool(re.search(r"goals|vision",t)),
           ("in scope" in t or "out of scope" in t or "non-goals" in t) and "scope" in t,
           bool(re.search(r"\b(must|should|could)\b",t)) and bool(re.search(r"^\W*(r|fr)?-?\d+",t,re.M)),
           bool(re.search(r"tech(nology)?|stack",t)) and bool(re.search(r"because|rationale|why|reason",t)),
           "assumption" in t and "open question" in t,
           "milestone" in t]
        ev=[{"text":a,"passed":p,"evidence":"checked spec text for expected headings/keywords"} for a,p in zip(A,r)]
        json.dump({"expectations":ev},open(f"{d}/{cfg}/grading.json","w"),indent=2)
        print(d,cfg,sum(r),"/",len(r))
    m=json.load(open(f"{d}/eval_metadata.json"));m["assertions"]=A;json.dump(m,open(f"{d}/eval_metadata.json","w"),indent=2)
