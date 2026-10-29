"""Execute generated reference implementations in native Python, outside the UI."""
import contextlib, io, json, sys

def normalize(text):
    return '\n'.join(line.rstrip() for line in text.strip().replace('\r\n', '\n').split('\n'))

count = 0
with open('/tmp/python-prep-reference-cases.json') as file:
    exercises = json.load(file)
for exercise in exercises:
    for case in exercise['cases']:
        out = io.StringIO()
        old_stdin = sys.stdin
        try:
            sys.stdin = io.StringIO(case['input'])
            with contextlib.redirect_stdout(out):
                exec(exercise['code'], {})
        finally:
            sys.stdin = old_stdin
        assert normalize(out.getvalue()) == normalize(case['expected']), (exercise['topic'], case)
        count += 1
print(f'Python reference implementations: {count} cases passed')
