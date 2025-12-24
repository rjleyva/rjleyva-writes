<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
<html data-theme="light">
<head>
    <title>RJ Leyva's Blog - RSS Feed</title>
    <style>
        :root {
            color-scheme: light dark;

            /* Theme variables - Light mode */
            --base: #fafafa;
            --surface: #ffffff;
            --surface-secondary: #f8f9fa;
            --surface-tertiary: #f1f3f4;
            --overlay: #f2f2f2;
            --border: #e5e5e5;
            --border-subtle: #f0f0f0;
            --text: #1c1c1c;
            --text-muted: #5f5f5f;
            --text-secondary: #404040;
            --text-code: #0f0f0f;
            --text-code-bg: #e8e8e8;
            --code-keyword: #0000ff;
            --code-string: #008000;
            --code-comment: #808080;
            --code-function: #795e26;
            --code-number: #09885a;
            --accent: #3a70d6;
            --accent-rgb: 58, 112, 214;
            --accent-muted: #8eb2ec;
            --shadow-color: rgba(0, 0, 0, 0.06);
            --glass-light: rgba(255, 255, 255, 0.08);
            --glass-dark: rgba(0, 0, 0, 0.1);
            --color-white: #ffffff;
            --font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

            /* Design tokens */
            --border-radius-extra-small: 0.25rem;
            --border-radius-small: 0.375rem;
            --border-radius-medium: 0.5rem;
            --border-radius-large: 1.5rem;
            --transition-duration-fast: 0.2s ease-in-out;
            --transition-duration-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --transition-duration-slow: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            --shadow-elevation-small: 0 0.25rem 1rem var(--shadow-color);
            --shadow-elevation-medium: 0 0.5rem 2rem var(--shadow-color);
            --glass-background: linear-gradient(135deg, var(--surface) 0%, var(--glass-light) 100%);
            --glass-background-subtle: linear-gradient(135deg, var(--overlay) 0%, var(--glass-light) 100%);
            --backdrop-blur-subtle: blur(0.25rem);
            --backdrop-blur-strong: blur(1.5rem);
            --border-width-hairline: 0.0625rem;
            --outline-width-focus: 0.125rem;
            --outline-offset-focus: 0.125rem;
            --text-gradient-primary: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
            --hover-scale-interactive: scale(1.05);
            --hover-scale-subtle: scale(1.02);
            --hover-translate-y-lift: translateY(-0.5rem);
            --animation-interactive-pulse: interactive-pulse 3s ease-in-out infinite;
        }

        [data-theme='light'] {
            --base: #fafafa;
            --surface: #ffffff;
            --surface-secondary: #f8f9fa;
            --surface-tertiary: #f1f3f4;
            --overlay: #f2f2f2;
            --border: #e5e5e5;
            --border-subtle: #f0f0f0;
            --text: #1c1c1c;
            --text-muted: #5f5f5f;
            --text-secondary: #404040;
            --text-code: #0f0f0f;
            --text-code-bg: #e8e8e8;
            --code-keyword: #0000ff;
            --code-string: #008000;
            --code-comment: #808080;
            --code-function: #795e26;
            --code-number: #09885a;
            --accent: #3a70d6;
            --accent-rgb: 58, 112, 214;
            --accent-muted: #8eb2ec;
            --shadow-color: rgba(0, 0, 0, 0.06);
        }

        [data-theme='dark'] {
            --base: #0f0f10;
            --surface: #161617;
            --surface-secondary: #1a1a1b;
            --surface-tertiary: #1f1f20;
            --overlay: #1d1d1e;
            --border: #2a2a2b;
            --border-subtle: #252526;
            --text: #e8e8e8;
            --text-muted: #9c9c9c;
            --text-secondary: #c8c8c8;
            --text-code: #f0f0f0;
            --text-code-bg: #2a2a2b;
            --code-keyword: #569cd6;
            --code-string: #ce9178;
            --code-comment: #6a9955;
            --code-function: #dcdcaa;
            --code-number: #b5cea8;
            --accent: #6ea8ff;
            --accent-rgb: 110, 168, 255;
            --accent-muted: #3c6fb3;
            --shadow-color: rgba(0, 0, 0, 0.5);
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme]) {
                --base: #0f0f10;
                --surface: #161617;
                --surface-secondary: #1a1a1b;
                --surface-tertiary: #1f1f20;
                --overlay: #1d1d1e;
                --border: #2a2a2b;
                --border-subtle: #252526;
                --text: #e8e8e8;
                --text-muted: #9c9c9c;
                --text-secondary: #c8c8c8;
                --text-code: #f0f0f0;
                --text-code-bg: #2a2a2b;
                --code-keyword: #569cd6;
                --code-string: #ce9178;
                --code-comment: #6a9955;
                --code-function: #dcdcaa;
                --code-number: #b5cea8;
                --accent: #6ea8ff;
                --accent-rgb: 110, 168, 255;
                --accent-muted: #3c6fb3;
                --shadow-color: rgba(0, 0, 0, 0.5);
                --glass-dark-hover: rgba(0, 0, 0, 0.2);
            }
        }

        @keyframes interactive-pulse {
            0%, 100% {
                opacity: 0.1;
                transform: scale(1);
            }
            50% {
                opacity: 0.2;
                transform: scale(1.1);
            }
        }

        *, *::before, *::after {
            box-sizing: border-box;
        }

        html {
            overflow-x: hidden;
            overflow-y: scroll;
        }

        body {
            color: var(--text);
            background: linear-gradient(135deg, var(--base) 0%, var(--overlay) 100%);
            min-height: 100vh;
            min-width: 20rem;
            font-family: var(--font-family);
            font-synthesis: none;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
            overflow-y: scroll;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        /* RSS Feed specific styles */
        .header {
            background: var(--surface);
            padding: 30px;
            border-radius: var(--border-radius-medium);
            margin-bottom: 20px;
            box-shadow: var(--shadow-elevation-small);
            border: var(--border-width-hairline) solid var(--border);
        }

        .header h1 {
            margin: 0 0 10px 0;
            color: var(--text);
            font-weight: 800;
            font-size: clamp(1.8rem, 6vw, 3rem);
            background: var(--text-gradient-primary);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: var(--text);
        }

        .header p {
            margin: 0 0 15px 0;
            color: var(--text-muted);
        }

        .subscribe-info {
            background: var(--glass-background-subtle);
            border: var(--border-width-hairline) solid var(--accent);
            border-radius: var(--border-radius-small);
            padding: 15px;
            margin-bottom: 20px;
        }

        .subscribe-info h3 {
            margin: 0 0 10px 0;
            color: var(--accent);
            font-weight: 600;
        }

        .rss-url {
            background: var(--surface-secondary);
            border: var(--border-width-hairline) solid var(--border);
            border-radius: var(--border-radius-small);
            padding: 10px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            word-break: break-all;
            margin: 10px 0;
            color: var(--text-code);
            background: var(--text-code-bg);
        }

        .post {
            background: var(--surface);
            margin-bottom: 20px;
            padding: 25px;
            border-radius: var(--border-radius-medium);
            box-shadow: var(--shadow-elevation-small);
            border: var(--border-width-hairline) solid var(--border);
            transition: all var(--transition-duration-normal);
        }

        .post:hover {
            transform: var(--hover-scale-subtle);
            box-shadow: var(--shadow-elevation-medium);
        }

        .post h2 {
            margin: 0 0 10px 0;
            font-size: 1.4em;
            line-height: 1.3;
            font-weight: 600;
        }

        .post h2 a {
            color: var(--text);
            text-decoration: none;
            transition: color var(--transition-duration-fast);
        }

        .post h2 a:hover {
            color: var(--accent);
            text-decoration: underline;
        }

        .post-meta {
            color: var(--text-muted);
            font-size: 0.9em;
            margin-bottom: 15px;
        }

        .post-description {
            color: var(--text-secondary);
            margin-bottom: 15px;
            line-height: 1.7;
        }

        .categories {
            margin-top: 10px;
        }

        .category {
            display: inline-block;
            background: var(--overlay);
            color: var(--text-secondary);
            padding: 3px 8px;
            border-radius: var(--border-radius-large);
            font-size: 0.8em;
            margin-right: 5px;
            margin-bottom: 5px;
            border: var(--border-width-hairline) solid var(--border);
            transition: all var(--transition-duration-fast);
        }

        .category:hover {
            background: var(--accent);
            color: var(--color-white);
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: var(--border-width-hairline) solid var(--border);
            color: var(--text-muted);
            font-size: 0.9em;
        }

        .footer a {
            color: var(--accent);
            text-decoration: none;
            transition: color var(--transition-duration-fast);
        }

        .footer a:hover {
            color: var(--accent-muted);
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>RJ Leyva's Blog</h1>
        <p>RJ Leyva's personal blog documenting web development insights through writing.</p>
        <div class="subscribe-info">
            <h3>Subscribe to this feed</h3>
            <p>Copy and paste this URL into your RSS reader:</p>
            <div class="rss-url"><xsl:value-of select="/rss/channel/atom:link/@href"/></div>
        </div>
    </div>

    <xsl:for-each select="/rss/channel/item">
        <div class="post">
            <h2>
                <a href="{link}"><xsl:value-of select="title"/></a>
            </h2>
            <div class="post-meta">
                Published: <xsl:value-of select="pubDate"/>
            </div>
            <div class="post-description">
                <xsl:value-of select="description"/>
            </div>
            <div class="categories">
                <xsl:for-each select="category">
                    <span class="category"><xsl:value-of select="."/></span>
                    <xsl:if test="position() != last()"> </xsl:if>
                </xsl:for-each>
            </div>
        </div>
    </xsl:for-each>

    <div class="footer">
        <p>Generated by RJ Leyva's Blog • <a href="{/rss/channel/link}">Visit the website</a></p>
    </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
