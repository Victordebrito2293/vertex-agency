import re

# Read files
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
    
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. HTML HEADERS & SECURITY
security_headers = """
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://bislekqqepdnkflbauln.supabase.co; script-src 'self' 'unsafe-inline' https://unpkg.com; connect-src 'self'; form-action 'self' https://wa.me;">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta name="referrer" content="strict-origin-when-cross-origin">
"""
html = html.replace('<title>', security_headers + '\n    <title>')

# HTML Img Protection (draggable="false")
html = html.replace('<img ', '<img draggable="false" ')
html = html.replace('class="blog-img-wrapper"', 'class="blog-img-wrapper protected-img"')

# 2. CSS SECURITY
css_security = """
  body { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
  input, textarea, select { -webkit-user-select: auto; user-select: auto; }
  img { pointer-events: none; }
  .protected-img { position: relative; }
  .protected-img::after { content: ""; position: absolute; top:0; left:0; right:0; bottom:0; z-index: 10; pointer-events: auto; }
"""
css += css_security

# CSS MINIFICATION
css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
css = re.sub(r'\s+', ' ', css)
css = css.replace('{ ', '{').replace(' }', '}').replace('; ', ';').replace(': ', ':')

# 3. JS SECURITY & OBFUSCATION
js_security = """
// Security Protections
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => { if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault() });
document.addEventListener('dragstart', e => { if(e.target.tagName === 'IMG') e.preventDefault() });
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'p')) {
        e.preventDefault();
    }
});
// XSS Sanitizer Override
window._sanitize = function(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
};
"""

js = js.replace('document.getElementById(\'wa-nome\').value.trim()', 'window._sanitize(document.getElementById(\'wa-nome\').value.trim())')
js = js.replace('document.getElementById(\'wa-empresa\').value.trim()', 'window._sanitize(document.getElementById(\'wa-empresa\').value.trim())')
js = js.replace('document.getElementById(\'wa-servico\').value', 'window._sanitize(document.getElementById(\'wa-servico\').value)')
js = js.replace('document.getElementById(\'wa-mensagem\').value.trim()', 'window._sanitize(document.getElementById(\'wa-mensagem\').value.trim())')

js = js_security + js

# JS MINIFICATION
js = re.sub(r'//.*', '', js)
js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
js = re.sub(r'\s+', ' ', js)
js = js.replace(' = ', '=').replace(' { ', '{').replace('; ', ';')

# HTML MINIFICATION
html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)
html = re.sub(r'\s+', ' ', html)
html = html.replace('> <', '><')

# Write back files
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Minified and secured!")
