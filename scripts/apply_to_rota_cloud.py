#!/usr/bin/env python3
"""Apply AIF-C01 integration to an existing *clean* rota-cloud checkout.

The generated package is intentionally additive to the CLF-C02 course.
Refuses to change unexpected upstream code instead of silently corrupting it.

Usage: python3 scripts/apply_to_rota_cloud.py /path/to/rota-cloud
Copy this delivery's src/, content/, data/, docs/ and scripts/ into the
checkout first, without replacing unrelated files.
"""
from pathlib import Path
import sys

pending:dict[Path,str]={}

def swap(path:Path,old:str,new:str):
    s=pending.get(path)
    if s is None:
        s=path.read_text(encoding='utf-8')
    if new in s:
        print('already applied',path)
        return
    occurrences=s.count(old)
    if occurrences!=1:
        raise RuntimeError(f'Expected one exact integration anchor in {path}: got {occurrences} for {old[:100]!r}')
    pending[path]=s.replace(old,new,1)
    print('validated patch',path)

if len(sys.argv)!=2:
    sys.exit('Usage: python3 scripts/apply_to_rota_cloud.py /path/to/rota-cloud')
root=Path(sys.argv[1]).resolve()
registry=root/'src/courses/registry.ts'
app=root/'src/App.tsx'
shell=root/'src/components/layout/Shell.tsx'
catalog=root/'src/pages/CatalogPage.tsx'
for path in (registry,app,shell,catalog):
    if not path.is_file():sys.exit(f'Missing {path}. Are you applying this to the rota-cloud checkout?')

swap(registry,
"    id: 'aif-c01',\n    code: 'AIF-C01',\n    title: 'AI Practitioner',\n    level: 'Foundational',\n    status: 'soon',\n    blurb: 'Fundamentos de IA, machine learning e IA generativa na AWS.',",
"    id: 'aif-c01',\n    code: 'AIF-C01',\n    title: 'AI Practitioner',\n    level: 'Foundational',\n    status: 'available',\n    blurb: 'Dos fundamentos de IA aos modelos de base, agentes e governança.',\n    stats: [\n      { value: 30, label: 'capítulos' },\n      { value: 80, label: 'questões' },\n      { value: 120, label: 'flashcards' },\n    ],")

swap(app,
"import { CourseLayout, LegacyRedirect } from '@/courses/CourseContext'",
"import { CourseLayout, LegacyRedirect } from '@/courses/CourseContext'\nimport { AifCourseApp } from '@/courses/aif/AifCourseApp'")
swap(app,
"            <Route path=\"cursos/:courseId\" element={<CourseLayout />}>\n",
"            <Route path=\"cursos/aif-c01/*\" element={<AifCourseApp />} />\n            <Route path=\"cursos/:courseId\" element={<CourseLayout />}>\n")

swap(shell,
"        setSearchOpen(true)\n      }\n      if (event.key === 'Escape')",
"        if (course?.id === 'aif-c01') navigate(coursePath('aif-c01', '/busca'))\n        else setSearchOpen(true)\n      }\n      if (event.key === 'Escape')")
swap(shell,
"  }, [inCourse])",
"  }, [inCourse, course?.id, navigate])")
swap(shell,
"  useEffect(() => {\n    const started = performance.now()",
"  useEffect(() => {\n    // The CLF-C02 study timer must not accrue while a different course is open.\n    if (course?.id === 'aif-c01') return\n    const started = performance.now()")
swap(shell,
"  }, [update])",
"  }, [update, course?.id])")
swap(shell,
"<Button variant=\"ghost\" aria-label=\"Buscar\" onClick={() => setSearchOpen(true)}>",
"<Button variant=\"ghost\" aria-label=\"Buscar\" onClick={() => course?.id === 'aif-c01' ? navigate(coursePath('aif-c01', '/busca')) : setSearchOpen(true)}>")
swap(shell,
"      {searchOpen && inCourse && (",
"      {searchOpen && inCourse && course?.id !== 'aif-c01' && (")

swap(catalog,
"import { getCorpus } from '@/lib/corpus'",
"import { getCorpus } from '@/lib/corpus'\nimport { readAifProgress } from '@/courses/aif/AifCourseApp'")
swap(catalog,
"  const done = progress.completedChapterIds.length",
"  const done = progress.completedChapterIds.length\n  const aifDone = readAifProgress().completed.length")
swap(catalog,
"            const available = course.status === 'available'",
"            const available = course.status === 'available'\n            const courseDone = course.id === 'aif-c01' ? aifDone : done\n            const courseChapters = course.id === 'aif-c01' ? 30 : chapters")
swap(catalog,
"aria-label={`${done} de ${chapters} capítulos concluídos`}",
"aria-label={`${courseDone} de ${courseChapters} capítulos concluídos`}")
swap(catalog,
"style={{ width: `${(done / chapters) * 100}%` }}",
"style={{ width: `${(courseDone / courseChapters) * 100}%` }}")
swap(catalog,
"{done > 0 ? 'Continuar' : 'Abrir curso'}",
"{courseDone > 0 ? 'Continuar' : 'Abrir curso'}")
for path, content in pending.items():
    path.write_text(content,encoding='utf-8')
print('AIF-C01 integration applied. Run npm run typecheck, npm run lint, npm test, npm run build.')
