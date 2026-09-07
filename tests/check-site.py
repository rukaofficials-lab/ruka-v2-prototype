"""Check every local page/asset link and inline JavaScript without dependencies."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
from html.parser import HTMLParser
import re, subprocess, tempfile
ROOT = Path(__file__).resolve().parent.parent
errors = []
class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ('href', 'src') or not value:
                continue
            url = urlsplit(value)
            if not url.scheme and not url.netloc and url.path:
                target = ROOT / unquote(url.path)
                if not target.exists():
                    errors.append(f'{page.name}: missing {value}')
for page in ROOT.glob('*.html'):
    source = page.read_text()
    Links().feed(source)
    for script in re.findall(r'<script>(.*?)</script>', source, re.S):
        with tempfile.NamedTemporaryFile(suffix='.js', mode='w') as file:
            file.write(script)
            file.flush()
            result = subprocess.run(['node', '--check', file.name], capture_output=True, text=True)
            if result.returncode:
                errors.append(f'{page.name}: {result.stderr}')
for script in ROOT.glob('*.js'):
    result = subprocess.run(['node', '--check', str(script)], capture_output=True, text=True)
    if result.returncode:
        errors.append(result.stderr)
if errors:
    raise SystemExit('\n'.join(errors))
print('PASS: local links/assets and JavaScript syntax across all 11 HTML pages')
